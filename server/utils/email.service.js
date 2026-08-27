const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOverdueEmail = async (user, book, days) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: '⏰ Book Overdue Notification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #dc3545;">📚 Book Overdue!</h2>
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>Your borrowed book is overdue:</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Book:</strong> ${book.title}</p>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Overdue by:</strong> ${days} day${days > 1 ? 's' : ''}</p>
          <p><strong>Fine:</strong> $${days * 10}</p>
        </div>
        <p>Please return the book as soon as possible to avoid additional fines.</p>
        <p>Thank you for your cooperation!</p>
        <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #6c757d; font-size: 12px;">Library Management System</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};