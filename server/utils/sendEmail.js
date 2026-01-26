const axios = require('axios');

const sendEmail = async (options) => {
    // Check for API Key
    if (!process.env.BREVO_API_KEY) {
        console.error('[EMAIL ERROR] Missing BREVO_API_KEY in environment variables.');
        throw new Error('BREVO_API_KEY is missing. Check Render environment variables.');
    }

    // Brevo API Endpoint
    const url = 'https://api.brevo.com/v3/smtp/email';

    // Prepare Payload
    const data = {
        sender: {
            name: process.env.FROM_NAME || 'Yenepoya Student Hub',
            email: process.env.FROM_EMAIL || 'noreply@yenepoya.edu.in'
        },
        to: [
            {
                email: options.to
            }
        ],
        subject: options.subject,
        htmlContent: options.html
    };

    // Prepare Config
    const config = {
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json'
        }
    };

    console.log(`[EMAIL SERVICE] Sending via Brevo API to: ${options.to}`);

    try {
        const response = await axios.post(url, data, config);
        console.log('[EMAIL SERVICE] Email sent successfully. MessageId:', response.data.messageId);
        return response.data;
    } catch (error) {
        console.error('[EMAIL ERROR] Brevo API Failed:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Email sending failed');
    }
};

module.exports = sendEmail;
