/**
 * Netlify function called from Sanity Studio's custom video-upload field.
 *
 * Provisions a one-time tus upload URL from Cloudflare Stream. The browser
 * (Studio) then uploads the actual video bytes straight to Cloudflare using
 * that URL via the tus protocol (resumable) — the file never passes through
 * this function or our servers.
 *
 * IMPORTANT: this uses Cloudflare's tus-creation endpoint
 * (POST /accounts/{id}/stream?direct_user=true with Tus-Resumable /
 * Upload-Length / Upload-Metadata headers), NOT the simpler
 * /stream/direct_upload endpoint. The latter only supports a single
 * multipart POST under 200MB and is NOT a real tus resource — pointing
 * tus-js-client's `uploadUrl` at it fails with a 400 on the client's
 * resume-check HEAD request. The tus-creation endpoint below returns an
 * already-created tus resource in the `Location` header, which is exactly
 * what tus-js-client's `uploadUrl` option expects.
 *
 * Required Netlify env vars (Site Settings → Environment Variables):
 *   CLOUDFLARE_ACCOUNT_ID   — Cloudflare account ID
 *   CLOUDFLARE_API_TOKEN    — API token scoped to "Cloudflare Stream" (read/write)
 *   STUDIO_UPLOAD_SECRET    — arbitrary shared secret, must match the value
 *                             baked into studio/components/CloudflareVideoUpload.jsx
 *
 * Note: Studio runs on a different origin (creatorsnetwork-cms.netlify.app)
 * than this function (creatorsnetwork.io), so CORS headers are required or
 * every call from Studio fails with a generic "Failed to fetch".
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-studio-secret',
};

function b64(str) {
  return Buffer.from(String(str), 'utf-8').toString('base64');
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: 'Method not allowed' };
  }

  // Basic shared-secret check — keeps this endpoint from being hit by randoms.
  // Studio is already gated behind Sanity login, so this is a light deterrent,
  // not the actual security boundary (the real secret, the Cloudflare token,
  // never leaves this function).
  const providedSecret = event.headers['x-studio-secret'] || event.headers['X-Studio-Secret'];
  const expectedSecret = process.env.STUDIO_UPLOAD_SECRET;
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    console.error('Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN env vars');
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (e) {
    // ignore — fall back to defaults below
  }

  const maxDurationSeconds = Number(body.maxDurationSeconds) || 180; // 3 min ceiling for reels
  const fileName = body.fileName || 'untitled';
  const fileSize = Number(body.fileSize);

  if (!fileSize || fileSize <= 0) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'fileSize (bytes) is required to provision a tus upload' }),
    };
  }

  const metadataParts = [`name ${b64(fileName)}`, `maxDurationSeconds ${b64(maxDurationSeconds)}`];

  try {
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream?direct_user=true`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Tus-Resumable': '1.0.0',
          'Upload-Length': String(fileSize),
          'Upload-Metadata': metadataParts.join(','),
        },
      }
    );

    if (!cfRes.ok) {
      const errText = await cfRes.text().catch(() => '');
      console.error('Cloudflare tus creation failed:', cfRes.status, errText);
      return {
        statusCode: 502,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Cloudflare request failed', details: errText }),
      };
    }

    const uploadURL = cfRes.headers.get('location');
    const uid = cfRes.headers.get('stream-media-id');

    if (!uploadURL || !uid) {
      console.error('Cloudflare response missing Location or stream-media-id header');
      return {
        statusCode: 502,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Cloudflare response missing required headers' }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadURL, uid }),
    };
  } catch (err) {
    console.error('Error provisioning Cloudflare tus upload:', err);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
