import { sendThankYouEmail } from '@/lib/email/mailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { to, name, formData } = await request.json();

    // Validate required fields
    if (!to || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Send email using Nodemailer (Gmail)
    const result = await sendThankYouEmail(to, name, formData || {});

    if (!result.success) {
      console.error('Failed to send email:', result.error);
      
      // Return different responses based on error type
      if (result.errorType === 'CONFIG_ERROR') {
        return NextResponse.json({
          success: false,
          emailSent: false,
          error: 'Email service configuration error',
          message: 'Form submitted but email could not be sent due to configuration issue',
        }, { status: 500 });
      }
      
      if (result.errorType === 'VALIDATION_ERROR') {
        return NextResponse.json({
          success: false,
          emailSent: false,
          error: result.errorMessage,
        }, { status: 400 });
      }

      // For send errors, return success for user but log internally
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: 'Form submitted successfully (Email delivery may be delayed)',
      });
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      messageId: result.messageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({
      success: false,
      emailSent: false,
      error: 'Internal server error',
      message: 'Form submitted but email delivery failed',
    }, { status: 500 });
  }
}
