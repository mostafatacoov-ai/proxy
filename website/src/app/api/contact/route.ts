import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, scope, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create transporter — uses environment variables for credentials
    // Set GMAIL_USER and GMAIL_APP_PASSWORD in your .env.local file
    // Gmail App Password: https://myaccount.google.com/apppasswords
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'tantawy.mac85@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Proxy Website" <${process.env.GMAIL_USER || 'tantawy.mac85@gmail.com'}>`,
      to: 'tantawy.mac85@gmail.com',
      replyTo: email,
      subject: `New Contact Form Submission — ${scope || 'General'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #111; margin-bottom: 24px; border-bottom: 2px solid #eee; padding-bottom: 12px;">
            New Message from Proxy Website
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #666; width: 120px; font-weight: bold; vertical-align: top;">Name:</td>
              <td style="padding: 10px 0; color: #111;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: bold; vertical-align: top;">Email:</td>
              <td style="padding: 10px 0; color: #111;"><a href="mailto:${email}" style="color: #0070f3;">${email}</a></td>
            </tr>
            ${scope ? `
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: bold; vertical-align: top;">Service:</td>
              <td style="padding: 10px 0; color: #111;">${scope}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 10px 0; color: #666; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 10px 0; color: #111; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px; text-align: center;">
            Sent from the contact form at proxy-group.com
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Contact email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
