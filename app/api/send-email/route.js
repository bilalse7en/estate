import { sendThankYouEmail } from '@/lib/email/mailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { to, name, formData } = await request.json();

    if (!to || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email using Nodemailer (Gmail)
    const result = await sendThankYouEmail(to, name, formData || {});

    if (!result.success) {
      console.error('Failed to send email:', result.error);
      // Return success true so the user sees the 'CheckCircle' UI, but log the email failure internally
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: 'Form submitted successfully (Email delivery failed)',
      });
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      data: result.data
    });

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({
      success: true,
      emailSent: false,
      message: 'Form submitted but email delivery failed',
    });
  }
}
