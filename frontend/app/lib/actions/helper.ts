import nodemailer from "nodemailer";
import client from "@/db"

const auth = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "physics.sir.shivam@gmail.com",
    pass: process.env.Email_Pass,
  },
});

export async function sendMail(email: string, otp: number) {
  try {
    let isRegistered = false;
    try{
      const user = await client.user.findFirst({
      where: {
          email : email
      }
  });
  isRegistered = !!user;

  }catch(err){
      console.log(err);
      return "Error While Checking User Registration";
  }
    const receiver = {
      from: "canvasSync@gmail.com",
      to: email,
      subject: "🌟 Welcome to CanvasSync! 🌟",
      text:  isRegistered
      ? `👋 Hello there!\n\nIt looks like you're already registered with us at CanvasSync. 🎉 If you’re experiencing any issues or believe this is an error, feel free to reach out to our support team at 📧 physics.sir.shivam@gmail.com.\n\nThank you for being a part of the CanvasSync family!\n\nCheers,  
      The CanvasSync Team`
      : `🎉 Welcome to CanvasSync!\n\nWe're thrilled to have you on board. To complete your registration, please use the following One-Time Password (OTP):\n\n🔑 **${otp}**\n\nIf you didn’t request this OTP, no worries! Simply reach out to us at 📧 physics.sir.shivam@gmail.com to report this activity.\n\nWe’re here to ensure your experience with us is seamless and secure. 🌟\n\nBest regards,  
      The CanvasSync Team`,
    };

    return new Promise((resolve, reject) => {
      auth.sendMail(receiver, (error, emailResponse) => {
        if (error) {
          console.error("Error:", error);
          reject("Failed to send email.");
        } else {
          console.log("Success!", emailResponse);
          resolve("Email sent successfully!");
        }
      });
    });
  } catch (err) {
    console.log(err);
    return "Server facing errors";
  }
}
