/**
 * Netlify event-triggered function.
 * Auto-fires whenever a form named "contact-cn" is submitted.
 *
 * Setup in Netlify dashboard:
 *   Site Settings → Environment Variables → Add SANITY_TOKEN
 *   (use the same write token from your seed scripts)
 *
 * The function saves each submission as a contactSubmission document in Sanity.
 * All data is read-only in Studio — no one can accidentally edit a lead from the CMS.
 */

const SANITY_PROJECT = 'yodi9k1k';
const SANITY_DATASET = 'production';

exports.handler = async function (event) {
  // Only handle POST events from Netlify Forms
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch (e) {
    console.error('Could not parse event body:', e);
    return { statusCode: 400, body: 'Bad payload' };
  }

  // Confirm it's our form
  if (!payload || payload.form_name !== 'contact-cn') {
    return { statusCode: 200, body: 'Not our form — ignored' };
  }

  const data = payload.data || {};

  // Save to Sanity if token is available
  const token = process.env.SANITY_TOKEN;
  if (!token) {
    console.warn('SANITY_TOKEN not set — skipping CMS save. Add it in Netlify → Site Settings → Environment Variables.');
    return { statusCode: 200 };
  }

  const doc = {
    _type: 'contactSubmission',
    name: data.name || '',
    email: data.email || '',
    company: data.company || '',
    interest: data.interest || '',
    message: data.message || '',
    submittedAt: new Date().toISOString(),
    netlifyId: payload.id || '',
  };

  try {
    const r = await fetch(
      `https://${SANITY_PROJECT}.api.sanity.io/v2021-06-07/data/mutate/${SANITY_DATASET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mutations: [{ create: doc }] }),
      }
    );

    const result = await r.json();
    if (r.ok) {
      console.log('Sanity: saved submission', result.documentId || JSON.stringify(result));
    } else {
      console.error('Sanity: failed to save', r.status, JSON.stringify(result));
    }
  } catch (err) {
    console.error('Sanity fetch error:', err);
  }

  return { statusCode: 200 };
};
