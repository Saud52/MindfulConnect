const nodemailer = require('nodemailer');

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send an email when an appointment is booked
const sendAppointmentEmail = async (student, counsellor, appointment) => {
  const appointmentDate = new Date(appointment.date).toLocaleDateString();
  const appointmentTime = appointment.time.split('-')[0];

  const emailTemplate = (recipientName, message) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #A188ED 0%, #8E75C0 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">MindfulConnect</h1>
      </div>
      <div style="padding: 30px; background: #fdfdfd;">
        <h2 style="color: #333;">Hi ${recipientName},</h2>
        <p style="color: #555;">${message}</p>
        <div style="background: #f0edf6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #8E75C0;">Appointment Details:</h3>
          <p><strong>Counsellor:</strong> ${counsellor.username}</p>
          <p><strong>Student:</strong> ${student.username}</p>
          <p><strong>Date:</strong> ${appointmentDate}</p>
          <p><strong>Time:</strong> ${appointmentTime}</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/login" style="background-color: #80CBC4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">
            View Dashboard
          </a>
        </div>
      </div>
    </div>
  `;

  // 1. Email to the Student
  const studentMailOptions = {
    from: `"MindfulConnect" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: 'Your Appointment has been Confirmed!',
    html: emailTemplate(student.username, `Your appointment with ${counsellor.username} has been successfully booked.`)
  };

  // 2. Email to the Counsellor
  const counsellorMailOptions = {
    from: `"MindfulConnect" <${process.env.EMAIL_USER}>`,
    to: counsellor.email,
    subject: `New Appointment with ${student.username}`,
    html: emailTemplate(counsellor.username, `You have a new appointment scheduled with ${student.username}. Please check your dashboard for details.`)
  };

  try {
    // Send both emails
    await transporter.sendMail(studentMailOptions);
    await transporter.sendMail(counsellorMailOptions);
    console.log('Appointment confirmation emails sent successfully.');
  } catch (error) {
    console.error('Failed to send appointment emails:', error);
  }
};


// NEW: Function to send a proactive outreach email from a counsellor
const sendProactiveOutreachEmail = async (counsellor, student) => {
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #A188ED 0%, #8E75C0 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">MindfulConnect</h1>
      </div>
      <div style="padding: 30px; background: #fdfdfd;">
        <h2 style="color: #333;">A Message from Your Counsellor</h2>
        <p style="color: #555;">Hi ${student.username},</p>
        <p style="color: #555;">My name is ${counsellor.username}, and I'm a counsellor with MindfulConnect. I'm reaching out to offer support and let you know that I'm available to talk if you need guidance or just someone to listen.</p>
        <p style="color: #555;">Booking a session is confidential and easy. If you're interested, you can schedule a time that works for you through the platform.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/find-professional" style="background-color: #80CBC4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px;">
            Book a Session
          </a>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"MindfulConnect" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: `A message from MindfulConnect Counsellor, ${counsellor.username}`,
    html: emailTemplate
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Proactive outreach email sent to ${student.email}`);
  } catch (error) {
    console.error(`Failed to send outreach email to ${student.email}:`, error);
  }
};

module.exports = { sendAppointmentEmail, sendProactiveOutreachEmail };