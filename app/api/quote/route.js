import { NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * Creates a professional, dynamic, and action-oriented HTML email body.
 */
function createEmailMessage(from, to, subject, name, email, phone, whatsapp, details) {
  
  // Get logo and website URL from environment
  const LOGO_URL = process.env.CLOUDINARY_LOGO_URL || "https://res.cloudinary.com/dagmsvwui/image/upload/v1762199623/logo_ca0mqp.png"; // Use your actual Cloudinary logo URL
  const WEBSITE_URL = process.env.YOUR_WEBSITE_URL || "https://enfinito.studio"; // Fallback URL
  
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Dhaka',
  });

  // --- This is the new, improved HTML Email Template ---
  const emailBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                line-height: 1.6;
                background-color: #0f0f0f;
                color: #E0E0E0;
            }
            .container {
                width: 90%;
                max-width: 600px;
                margin: 40px auto;
                border: 1px solid #2a2a2a;
                border-radius: 12px;
                overflow: hidden;
                background-color: #1a1a1a;
            }
            .header {
                padding: 24px;
                background-color: #111111;
                border-bottom: 1px solid #333;
                text-align: center;
            }
            .logo {
                max-height: 40px;
                width: auto;
                border: 0;
            }
            .content {
                padding: 30px;
            }
            .title {
                margin: 0 0 10px 0;
                color: #00FFFF; /* Cyan color */
                font-size: 24px;
                font-weight: 600;
                line-height: 1.3;
            }
            .subtitle {
                margin: 0 0 25px 0;
                font-size: 16px;
                color: #aaaaaa;
            }
            .two-column-grid {
                font-size: 0;
                width: 100%;
                margin-bottom: 15px;
            }
            .column {
                width: 50%;
                display: inline-block;
                vertical-align: top;
                font-size: 16px;
                margin-bottom: 15px;
            }
            .field-label {
                font-size: 14px;
                color: #999999; /* Brighter label */
                margin: 0 0 6px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .field-value {
                font-size: 16px;
                color: #FFFFFF;
                margin: 0;
                padding: 0;
            }
            .field-value a {
                color: #4eb5d0; /* Cyan link */
                text-decoration: none;
                font-weight: 500;
            }
            .details-label {
                font-size: 14px;
                color: #999999;
                margin: 25px 0 12px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-top: 1px solid #333;
                padding-top: 25px;
            }
            .details-block {
                background-color: #222222;
                border: 1px solid #444;
                padding: 15px;
                border-radius: 4px;
                white-space: pre-wrap;
                font-family: 'Menlo', 'Courier New', monospace;
                font-size: 14px;
                color: #DDDDDD;
                /* --- ✨ THE FIX for RTL text bug --- */
                direction: ltr;
                text-align: left;
            }
            .footer {
                background-color: #111111;
                border-top: 1px solid #333;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; background-color: #0f0f0f; color: #E0E0E0;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #0f0f0f;">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    
                    <table width="600" border="0" cellpadding="0" cellspacing="0" style="width: 90%; max-width: 600px; margin: 0 auto; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; background-color: #1a1a1a;">
                        
                        <tr>
                            <td align="center" style="padding: 24px; background-color: #111111; border-bottom: 1px solid #333; text-align: center;">
                                <a href="${WEBSITE_URL}" target="_blank">
                                  <img src="${LOGO_URL}" alt="En.Studio Logo" style="max-height: 40px; width: auto; border: 0;" />
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 30px;">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td>
                                            <h2 style="margin: 0 0 10px 0; color: #00FFFF; font-size: 24px; font-weight: 600; line-height: 1.3;">New Project Quote Request</h2>
                                            <p style="margin: 0 0 25px 0; font-size: 16px; color: #aaaaaa;">From <strong>${name}</strong></p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 0; width: 100%; margin-bottom: 15px;">
                                                <tr>
                                                    <td style="width: 50%; display: inline-block; vertical-align: top; font-size: 16px; margin-bottom: 15px; padding-right: 10px; box-sizing: border-box;">
                                                        <p style="font-size: 14px; color: #999999; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                                                        <p style="font-size: 16px; color: #FFFFFF; margin: 0; padding: 0;">
                                                            <a href="mailto:${email}" style="color: #4eb5d0; text-decoration: none; font-weight: 500;">${email}</a>
                                                        </p>
                                                    </td>
                                                    <td style="width: 50%; display: inline-block; vertical-align: top; font-size: 16px; margin-bottom: 15px; padding-left: 10px; box-sizing: border-box;">
                                                        <p style="font-size: 14px; color: #999999; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">Primary Phone</p>
                                                        <p style="font-size: 16px; color: #FFFFFF; margin: 0; padding: 0;">
                                                            <a href="tel:${phone}" style="color: #4eb5d0; text-decoration: none; font-weight: 500;">${phone}</a>
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 50%; display: inline-block; vertical-align: top; font-size: 16px; margin-bottom: 15px; padding-right: 10px; box-sizing: border-box;">
                                                        <p style="font-size: 14px; color: #999999; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">WhatsApp Number</p>
                                                        <p style="font-size: 16px; color: #FFFFFF; margin: 0; padding: 0;">
                                                            <a href="https://wa.me/${whatsapp}" target="_blank" style="color: #4eb5d0; text-decoration: none; font-weight: 500;">${whatsapp}</a>
                                                        </p>
                                                    </td>
                                                    <td style="width: 50%; display: inline-block; vertical-align: top; font-size: 16px; margin-bottom: 15px; padding-left: 10px; box-sizing: border-box;">
                                                        <p style="font-size: 14px; color: #999999; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">Submitted On</p>
                                                        <p style="font-size: 16px; color: #FFFFFF; margin: 0; padding: 0;">${submittedAt}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td>
                                            <p style="font-size: 14px; color: #999999; margin: 25px 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; border-top: 1px solid #333; padding-top: 25px;">Project Details</p>
                                            <div style="background-color: #222222; border: 1px solid #444; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-family: 'Menlo', 'Courier New', monospace; font-size: 14px; color: #DDDDDD; direction: ltr; text-align: left;">
                                                ${details}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #111111; border-top: 1px solid #333; padding: 20px; text-align: center; font-size: 12px; color: #777;">
                                <p style="margin: 0;">&copy; ${new Date().getFullYear()} En.Studio | Auto-generated from Website</p>
                            </td>
                        </tr>
                    </table>

                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
  // --- End of new template ---

  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `From: "En.Studio Website" <${from}>`,
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    emailBody,
  ];
  const message = messageParts.join('\n');

  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function POST(request) {
  try {
    const { name, email, phone, whatsapp, details } = await request.json();

    if (!name || !email || !phone || !whatsapp || !details) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const {
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REFRESH_TOKEN,
      QUOTE_RECEIVER_EMAIL,
    } = process.env;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !QUOTE_RECEIVER_EMAIL) {
      console.error('Missing Gmail API credentials in .env.local');
      return NextResponse.json({ success: false, error: 'Server configuration error.' }, { status: 500 });
    }

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: GOOGLE_REFRESH_TOKEN,
    });

    await oauth2Client.getAccessToken(); // This refreshes the token
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const rawMessage = createEmailMessage(
      QUOTE_RECEIVER_EMAIL,
      QUOTE_RECEIVER_EMAIL,
      `New Quote Request from ${name}`,
      name, email, phone, whatsapp, details
    );

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: rawMessage,
      },
    });

    return NextResponse.json({ success: true, message: 'Your quote request has been sent!' });

  } catch (error) {
    console.error('Gmail API Error:', error);
    let errorMessage = 'Failed to send message.';
    if (error.response?.data?.error === 'invalid_grant') {
      errorMessage = 'Server authentication error. Please check the Refresh Token.';
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}