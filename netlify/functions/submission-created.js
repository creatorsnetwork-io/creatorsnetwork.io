/**
 * Netlify event-triggered function.
 * Auto-fires whenever a form named "contact-cn" is submitted.
 *
 * Required Netlify env vars (Site Settings → Environment Variables):
 *   SANITY_TOKEN     — Sanity write token (saves lead to CMS)
 *   GMAIL_USER       — hello@creatorsnetwork.io
 *   GMAIL_APP_PASSWORD — Google App Password (not your main Gmail password)
 *                       Generate at: myaccount.google.com → Security → App Passwords
 *                       (2FA must be enabled on the account first)
 */

const nodemailer = require('nodemailer');

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
  const name    = data.name    || 'Someone';
  const email   = data.email   || '';
  const company = data.company || '';
  const interest = data.interest || '';
  const message = data.message || '';

  // ── 1. Save to Sanity ───────────────────────────────────────────────────────
  const token = process.env.SANITY_TOKEN;
  if (!token) {
    console.warn('SANITY_TOKEN not set — skipping CMS save.');
  } else {
    const doc = {
      _type: 'contactSubmission',
      name,
      email,
      company,
      interest,
      message,
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
  }

  // ── 2. Send emails via Gmail ─────────────────────────────────────────────────
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.warn('Gmail credentials not set — skipping email. Add GMAIL_USER and GMAIL_APP_PASSWORD in Netlify env vars.');
    return { statusCode: 200 };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const interestLabel = interest
    ? interest.charAt(0).toUpperCase() + interest.slice(1).replace(/-/g, ' ')
    : 'Not specified';

  // ── 2a. Notification email to CN team ────────────────────────────────────────
  const notificationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #f5f2ee; margin: 0; padding: 32px 16px; }
    .wrap { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 4px; overflow: hidden; }
    .header { background: #1a1a1a; padding: 28px 36px; }
    .header h1 { color: #fff; margin: 0; font-size: 18px; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase; }
    .header p { color: #999; margin: 6px 0 0; font-size: 13px; }
    .body { padding: 32px 36px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 4px; }
    .value { font-size: 15px; color: #1a1a1a; }
    .message-box { background: #f9f8f6; border-left: 3px solid #c9a96e; padding: 16px 20px; margin-top: 4px; }
    .message-box p { margin: 0; font-size: 15px; color: #333; line-height: 1.6; }
    .footer { border-top: 1px solid #eee; padding: 20px 36px; }
    .footer p { font-size: 12px; color: #aaa; margin: 0; }
    .cta { margin-top: 24px; }
    .cta a { display: inline-block; background: #1a1a1a; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 13px; letter-spacing: 0.06em; border-radius: 2px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>New Enquiry</h1>
      <p>Creators Network — Contact Form</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${name}</div>
      </div>
      ${email ? `<div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${email}">${email}</a></div></div>` : ''}
      ${company ? `<div class="field"><div class="label">Company</div><div class="value">${company}</div></div>` : ''}
      <div class="field">
        <div class="label">Interested in</div>
        <div class="value">${interestLabel}</div>
      </div>
      ${message ? `
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box"><p>${message.replace(/\n/g, '<br>')}</p></div>
      </div>` : ''}
      ${email ? `<div class="cta"><a href="mailto:${email}?subject=Re: Your enquiry to Creators Network">Reply to ${name}</a></div>` : ''}
    </div>
    <div class="footer">
      <p>Submitted via creatorsnetwork.io · ${new Date().toUTCString()}</p>
    </div>
  </div>
</body>
</html>`;

  // ── 2b. Confirmation email to submitter ───────────────────────────────────────
  const confirmationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; background: #f5f2ee; margin: 0; padding: 32px 16px; }
    .wrap { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 4px; overflow: hidden; }
    .header { background: #1a1a1a; padding: 28px 36px; }
    .header h1 { color: #fff; margin: 0; font-size: 20px; font-weight: 400; letter-spacing: 0.04em; }
    .header p { color: #c9a96e; margin: 6px 0 0; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; }
    .body { padding: 36px 36px 28px; }
    .body p { font-size: 15px; color: #333; line-height: 1.75; margin: 0 0 16px; }
    .body p:last-child { margin-bottom: 0; }
    .sig { margin-top: 32px; font-size: 14px; color: #666; }
    .sig strong { color: #1a1a1a; display: block; margin-bottom: 4px; }
    .footer { border-top: 1px solid #eee; padding: 20px 36px; }
    .footer p { font-size: 12px; color: #aaa; margin: 0; }
    .footer a { color: #aaa; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>We got it, ${name.split(' ')[0]}.</h1>
      <p>Creators Network</p>
    </div>
    <div class="body">
      <p>Thank you for reaching out. Your message has come through and someone from our team will be in touch shortly.</p>
      <p>In the meantime, feel free to take a look at some of our work at <a href="https://creatorsnetwork.io/proof" style="color: #1a1a1a;">creatorsnetwork.io/proof</a>.</p>
      <div class="sig">
        <strong>Himanshu Arora</strong>
        Founders Network, Creators Network
      </div>
    </div>
    <div class="footer">
      <p><a href="https://creatorsnetwork.io">creatorsnetwork.io</a></p>
    </div>
  </div>
</body>
</html>`;

  const sends = [];

  // Notification to team
  sends.push(
    transporter.sendMail({
      from: `"Creators Network" <${gmailUser}>`,
      to: gmailUser,
      subject: `New enquiry from ${name}${company ? ` — ${company}` : ''}`,
      html: notificationHtml,
    }).then(() => console.log('Notification email sent to team'))
      .catch(err => console.error('Failed to send notification email:', err))
  );

  // Confirmation to submitter (only if we have their email)
  if (email) {
    sends.push(
      transporter.sendMail({
        from: `"Himanshu Arora, Creators Network" <${gmailUser}>`,
        to: email,
        replyTo: gmailUser,
        subject: 'Got your message.',
        html: confirmationHtml,
      }).then(() => console.log('Confirmation email sent to', email))
        .catch(err => console.error('Failed to send confirmation email:', err))
    );
  }

  await Promise.all(sends);

  return { statusCode: 200 };
};
