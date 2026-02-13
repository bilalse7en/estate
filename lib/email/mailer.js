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
    const mailOptions = {
      from: `"Ahmed Kapadia Private Office" <${process.env.GMAIL_USER || 'bilalghaffar46@gmail.com'}>`,
      to: to,
      subject: 'Confirmation: Your Inquiry with Ahmed Kapadia Private Office',
      html: getThankYouEmailTemplate(name, formData),
      replyTo: process.env.GMAIL_USER || 'bilalghaffar46@gmail.com',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, data: info };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
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
