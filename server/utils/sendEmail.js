const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // For development, we'll use a test account if no env vars are present
    // or just log it if we can't connect.
    console.log(`[EMAIL SERVICE] Attempting to send email to: ${options.to}`);

    let transporter;

    // Debugging: Check what the server sees
    console.log('[DEBUG] SMTP Config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        email: process.env.SMTP_EMAIL,
        hasPassword: !!process.env.SMTP_PASSWORD
    });

    if (process.env.SMTP_HOST) {
        const isGmail = process.env.SMTP_HOST.includes('gmail');
        const isSSL = process.env.SMTP_PORT == 465;

        transporter = nodemailer.createTransport({
            ...(isGmail ? { service: 'gmail' } : {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: isSSL // true for 465, false for other ports
            }),
            pool: true, // Reuse connections
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            },
            debug: true,
            logger: true,
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 45000
        });
    } else {
        // Fallback for Dev: Log to console + Ethereal (optional)
        console.log("No SMTP credentials found. Using console log for email content.");
        console.log("---------------------------------------------------");
        console.log(`Subject: ${options.subject}`);
        console.log(`To: ${options.to}`);
        console.log(`HTML: ${options.html}`);
        console.log("---------------------------------------------------");
        return;
    }

    const message = {
        from: `"Yenepoya Student Hub" <${process.env.SMTP_EMAIL || 'palakurimanoj1@gmail.com'}>`,
        to: options.to,
        subject: options.subject,
        html: options.html
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (err) {
        console.error('[EMAIL ERROR] SMTP Send Failed:', err);
        throw err; // Re-throw so the route catch block can handle it
    }
};

module.exports = sendEmail;
