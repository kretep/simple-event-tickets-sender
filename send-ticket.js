import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendEmail = (recipient, subject, content) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: recipient,
    cc: process.env.SENDER_EMAIL,
    subject: subject,
    text: content,
    html: `<p>${content}</p>`
  };
  // transporter.sendMail(mailOptions, function(error, info){
  //   if(error){
  //       return console.log(error);
  //   }
  //   console.log('Message sent: ' + info.response);
  // });
}
