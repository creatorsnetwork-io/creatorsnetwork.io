/**
 * Netlify function called from Sanity Studio's custom video-upload field.
 *
 * Mints a one-time direct-upload URL from Cloudflare Stream. The browser
 * (Studio) then uploads the actual video bytes straight to Cloudflare using
 * that URL — the file never passes through this function or our servers.
 *
 * Required Netlify env vars (Site Settings → Environment Variables):
 *   CLOUDFLARE_ACCOUNT_ID   — Cloudflare account ID
 *   CLOUDFLARE_API_TOKEN    — API token scoped to "Cloudflare Stream" (read/write)
 *   STUDIO_UPLOAD_SECRET    — arbitrary shared secret, must match the value
 *                             baked into studio/schemas/videoAsset.js
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

  try {
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxDurationSeconds,
          expiry: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min to start upload
          meta: { name: fileName },
        }),
      }
    );

    const cfData = await cfRes.json();

    if (!cfRes.ok || !cfData.success) {
      console.error('Cloudflare direct_upload failed:', JSON.stringify(cfData));
      return {
        statusCode: 502,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Cloudflare request failed', details: cfData.errors || cfData }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uploadURL: cfData.result.uploadURL,
        uid: cfData.result.uid,
      }),
    };
  } catch (err) {
    console.error('Error minting Cloudflare upload URL:', err);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
