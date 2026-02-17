import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'bilalghaffar46@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendThankYouEmail(to, name, formData) {
  try {
    // Validate environment variables
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Email configuration error: Missing GMAIL_USER or GMAIL_APP_PASSWORD');
      return { 
        success: false, 
        error: new Error('Email service not configured properly'),
        errorType: 'CONFIG_ERROR'
      };
    }

    // Validate email address format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!to || !emailRegex.test(to)) {
      console.error('Invalid email address:', to);
      return { 
        success: false, 
        error: new Error('Invalid email address'),
        errorType: 'VALIDATION_ERROR'
      };
    }

    // Validate required fields
    if (!name || name.trim() === '') {
      console.error('Missing required field: name');
      return { 
        success: false, 
        error: new Error('Name is required'),
        errorType: 'VALIDATION_ERROR'
      };
    }

    const mailOptions = {
      from: `"Ahmed Kapadia Private Office" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: 'Confirmation: Your Inquiry with Ahmed Kapadia Private Office',
      html: getThankYouEmailTemplate(name, formData),
      replyTo: process.env.GMAIL_USER,
    };

    console.log(`Attempting to send email to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('User confirmation email sent successfully:', info.messageId);
    
    // Also send notification to admin
    await sendAdminLeadNotification(formData);
    
    return { success: true, data: info, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', {
      message: error.message,
      code: error.code,
      response: error.response
    });
    return { 
      success: false, 
      error,
      errorType: 'SEND_ERROR',
      errorMessage: error.message
    };
  }
}

export async function sendInquiryResponseEmail(to, name, responseMessage, inquiryReference) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return { success: false, error: 'Email service not configured' };
    }

    const mailOptions = {
      from: `"Ahmed Kapadia Private Office" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: `Response to Your Inquiry: ${inquiryReference || 'Real Estate Consultation'}`,
      html: getResponseEmailTemplate(name, responseMessage),
      replyTo: process.env.GMAIL_USER,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending response email:', error);
    return { success: false, error: error.message };
  }
}

function getResponseEmailTemplate(name, message) {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', sans-serif; }
        .main { background-color: #ffffff; margin: 40px auto; max-width: 600px; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
        .header { background: #0f172a; padding: 40px; text-align: center; }
        .logo-text { color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
        .content { padding: 40px; color: #334155; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #0f172a; }
        .message-box { background-color: #f1f5f9; border-left: 4px solid #c29d59; padding: 25px; margin: 25px 0; font-style: italic; white-space: pre-wrap; }
        .footer { background-color: #0f172a; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="main">
        <div class="header">
          <h1 class="logo-text">Ahmed Kapadia</h1>
        </div>
        <div class="content">
          <div class="greeting">Hello ${name},</div>
          <p>Thank you for your patience. Our office has reviewed your inquiry, and we are pleased to provide the following update:</p>
          <div class="message-box">${message}</div>
          <p>Should you have any further questions or wish to proceed with the next steps, please do not hesitate to reply to this email or contact our office directly.</p>
          <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="margin: 0; font-weight: 700; color: #0f172a;">Best Regards,</p>
            <p style="margin: 5px 0 0 0; color: #c29d59; font-weight: 600;">The Ahmed Kapadia Private Office Team</p>
          </div>
        </div>
        <div class="footer">
          &copy; ${currentYear} Ahmed Kapadia Private Office. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendAdminLeadNotification(formData) {
  try {
    const adminEmail = process.env.GMAIL_USER;
    
    if (!adminEmail) {
      console.error('Admin notification skipped: GMAIL_USER not configured');
      return { success: false, error: 'Admin email not configured' };
    }

    const mailOptions = {
      from: `"Lead Alert" <${adminEmail}>`,
      to: adminEmail,
      subject: `🚨 NEW LEAD: ${formData.name || 'Unknown'}`,
      html: `
        <h2>New Inquiry Received</h2>
        <p><strong>Name:</strong> ${formData.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${formData.email || 'N/A'}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'N/A'}</p>
        <p><strong>Interest:</strong> ${formData.property_interest || formData.propertyInterest || 'N/A'}</p>
        <p><strong>Message:</strong> ${formData.message || 'No message provided'}</p>
        <hr />
        <p>View this lead in the <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://ahmedkapadia.com'}/admin/forms">Admin Dashboard</a>.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully:', info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error('Admin notification error:', error.message);
    // Don't throw - admin notification failure shouldn't block user confirmation
    return { success: false, error: error.message };
  }
}

function getThankYouEmailTemplate(name, formData) {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Inquiry - Ahmed Kapadia Real Estate</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .header { background: #0f172a; padding: 50px 40px; text-align: center; }
        .logo-text { color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin: 0; line-height: 1.2; }
        .logo-sub { color: #c29d59; font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; margin-top: 10px; display: block; }
        .content { padding: 45px 50px; color: #334155; line-height: 1.7; }
        .greeting { font-size: 22px; font-weight: 600; margin-bottom: 24px; color: #0f172a; }
        .text-block { margin-bottom: 24px; font-size: 16px; color: #475569; }
        .details-box { background-color: #f1f5f9; border-radius: 12px; padding: 30px; margin: 35px 0; border: 1px solid #e2e8f0; }
        .details-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #c29d59; margin-bottom: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px; }
        .detail-row { margin-bottom: 15px; font-size: 15px; display: table; width: 100%; }
        .detail-label { display: table-cell; width: 140px; font-weight: 600; color: #64748b; }
        .detail-value { display: table-cell; color: #0f172a; font-weight: 500; }
        .next-steps { background-color: #fffaf0; border-left: 4px solid #c29d59; padding: 25px; margin-bottom: 35px; border-radius: 0 8px 8px 0; }
        .next-steps h3 { margin: 0 0 15px 0; font-size: 17px; color: #854d0e; font-weight: 700; }
        .next-steps ul { margin: 0; padding-left: 20px; color: #475569; font-size: 14px; }
        .next-steps li { margin-bottom: 10px; }
        .footer { background-color: #0f172a; padding: 40px; text-align: center; color: #94a3b8; font-size: 13px; }
        .footer-brand { color: #ffffff; font-weight: 600; font-size: 15px; margin-bottom: 12px; display: block; }
        .footer-links { margin-top: 20px; }
        .footer-links a { color: #c29d59; text-decoration: none; margin: 0 10px; }
        .cta-button { display: inline-block; padding: 14px 30px; background-color: #c29d59; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="main">
          <div class="header">
            <h1 class="logo-text">Ahmed Kapadia</h1>
            <span class="logo-sub">Private Real Estate Office</span>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${name},</div>
            
            <p class="text-block">Thank you for reaching out to the Private Office of Ahmed Kapadia. We have received your inquiry regarding premium real estate opportunities in Dubai and have assigned it to our senior brokerage team.</p>
            
            <p class="text-block">Our office specializes in representing high-net-worth individuals and institutional investors. We understand the discretion and detail required for such acquisitions.</p>
            
            <div class="details-box">
              <div class="details-title">Inquiry Receipt</div>
              <div class="detail-row">
                <span class="detail-label">Reference Name:</span>
                <span class="detail-value">${formData.name || name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email Address:</span>
                <span class="detail-value">${formData.email || 'N/A'}</span>
              </div>
              ${formData.phone ? `
              <div class="detail-row">
                <span class="detail-label">Contact No:</span>
                <span class="detail-value">${formData.phone}</span>
              </div>` : ''}
              ${formData.property_interest || formData.propertyInterest ? `
              <div class="detail-row">
                <span class="detail-label">Interest:</span>
                <span class="detail-value">${formData.property_interest || formData.propertyInterest}</span>
              </div>` : ''}
            </div>

            <div class="next-steps">
              <h3>What to Expect Next</h3>
              <ul>
                <li><strong>Verification:</strong> A dedicated advisor will review your requirements.</li>
                <li><strong>Consultation:</strong> We will reach out within 12-24 hours to schedule a confidential briefing.</li>
                <li><strong>Exclusive Access:</strong> You will gain access to our off-market portfolio matching your criteria.</li>
              </ul>
            </div>
            
            <p class="text-block">If your request is urgent, please feel free to reply directly to this email or contact us via our website.</p>
            
            <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 30px;">
              <p style="margin: 0; font-weight: 700; color: #0f172a;">Best Regards,</p>
              <p style="margin: 5px 0 0 0; color: #c29d59; font-weight: 600;">The Ahmed Kapadia Private Office Team</p>
            </div>
          </div>
          
          <div class="footer">
            <span class="footer-brand">Ahmed Kapadia Private Office</span>
            <div>Dubai International Financial Centre (DIFC)</div>
            <div>Dubai, United Arab Emirates</div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #1e293b;">
              &copy; ${currentYear} Ahmed Kapadia. All rights reserved.
            </div>
            <div class="footer-links">
              <a href="https://ahmedkapadia.com">Official Website</a>
              <a href="https://ahmedkapadia.com/contact">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
