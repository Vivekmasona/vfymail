const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

// Replace with your database connection
const emails = []; // Placeholder for email storage, replace with a database in production

app.use(bodyParser.json());

// Nodemailer configuration for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Sender's email
        pass: 'your-email-password'    // Sender's password or app-specific password
    }
});

// Endpoint to send an email
app.post('/send-email', async (req, res) => {
    const { recipientEmail, senderName, message } = req.body;

    try {
        await transporter.sendMail({
            from: 'your-email@gmail.com',
            to: recipientEmail,
            subject: `Message from ${senderName}`,
            text: message
        });

        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// Webhook endpoint to receive incoming emails
app.post('/receive-email', (req, res) => {
    const { from, subject, text } = req.body;

    // Add received email to local storage or database
    emails.push({
        sender: from,
        subject,
        message: text,
        date: new Date()
    });

    res.status(200).send('Email received');
});

// Endpoint to fetch received emails
app.get('/inbox', (req, res) => {
    res.json(emails); // In production, replace with a database query
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
