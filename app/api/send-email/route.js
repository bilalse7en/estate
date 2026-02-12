import { sendThankYouEmail } from '@/lib/email/resend';
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

    // Send email using Resend
    const result = await sendThankYouEmail(to, name, formData || {});

    if (!result.success) {
      console.error('Failed to send email:', result.error);
      // Don't fail the request, just log the error
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: 'Form submitted but email delivery failed',
      });
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
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
