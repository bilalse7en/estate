import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendThankYouEmail(to, name, formData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Ahmed Kapadia Private Office <noreply@yourdomain.com>',
      to: [to],
      subject: 'Thank You for Your Inquiry - Dubai Real Estate',
      html: getThankYouEmailTemplate(name, formData),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

function getThankYouEmailTemplate(name, formData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Inquiry</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1f2328;
          background-color: #f6f8fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #b87333 0%, #a3612b 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 28px;
          font-weight: bold;
          letter-spacing: -0.5px;
        }
        .header p {
          color: rgba(255, 255, 255, 0.9);
          margin: 10px 0 0;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 20px;
          font-weight: 600;
          color: #1f2328;
          margin-bottom: 20px;
        }
        .message {
          color: #636c76;
          margin-bottom: 30px;
          line-height: 1.8;
        }
        .info-box {
          background: #f6f8fa;
          border-left: 4px solid #b87333;
          padding: 20px;
          margin: 30px 0;
          border-radius: 8px;
        }
        .info-box h3 {
          margin: 0 0 15px;
          color: #1f2328;
          font-size: 16px;
        }
        .info-row {
          margin-bottom: 10px;
          font-size: 14px;
        }
        .info-label {
          font-weight: 600;
          color: #1f2328;
        }
        .info-value {
          color: #636c76;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #b87333 0%, #a3612b 100%);
          color: white;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          margin: 20px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .footer {
          background: #f6f8fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e1e4e8;
        }
        .footer p {
          margin: 5px 0;
          font-size: 13px;
          color: #636c76;
        }
        .footer a {
          color: #b87333;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AHMED KAPADIA</h1>
          <p>Private Real Estate Office</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Dear ${name},
          </div>
          
          <div class="message">
            <p>Thank you for reaching out to Ahmed Kapadia Private Office. We have successfully received your inquiry regarding luxury real estate in Dubai.</p>
            
            <p>Your interest in Dubai's premium property market is valued, and our team of expert advisors will review your requirements carefully. We specialize in curating bespoke investment portfolios and providing strategic market intelligence to discerning clients.</p>
          </div>

          <div class="info-box">
            <h3>Your Inquiry Details</h3>
            <div class="info-row">
              <span class="info-label">Name:</span> 
              <span class="info-value">${formData.name || name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span> 
              <span class="info-value">${formData.email || 'N/A'}</span>
            </div>
            ${formData.phone ? `
            <div class="info-row">
              <span class="info-label">Phone:</span> 
              <span class="info-value">${formData.phone}</span>
            </div>
            ` : ''}
            ${formData.property_interest ? `
            <div class="info-row">
              <span class="info-label">Property Interest:</span> 
              <span class="info-value">${formData.property_interest}</span>
            </div>
            ` : ''}
          </div>

          <div class="message">
            <p><strong>What happens next?</strong></p>
            <ol style="color: #636c76; padding-left: 20px;">
              <li style="margin-bottom: 10px;">A senior advisor will review your inquiry within 24-48 business hours.</li>
              <li style="margin-bottom: 10px;">We will contact you directly to discuss your requirements in detail.</li>
              <li style="margin-bottom: 10px;">You'll receive a personalized market briefing and property recommendations.</li>
            </ol>
          </div>
        </div>

        <div class="footer">
          <p style="font-weight: 600; color: #1f2328; margin-bottom: 15px;">Ahmed Kapadia Private Office</p>
          <p>Dubai, United Arab Emirates</p>
          <p style="margin-top: 20px; font-size: 12px;">
            © ${new Date().getFullYear()} Ahmed Kapadia. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
