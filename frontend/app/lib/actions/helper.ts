import nodemailer from "nodemailer";
import client from "@/db";

const auth = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "physics.sir.shivam@gmail.com",
    pass: process.env.Email_Pass,
  },
});


async function storeOTP(email:string, otp:number) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

  await client.$transaction([
   client.oTP.deleteMany({
    where: {email}
  }),

   client.oTP.create({
    data: {
      email,
      otp,
      expiresAt,
    },
  })
])
}


let OTP = 0;

export async function sendMail(email: string) {
  try {
    let isRegistered = false;
    try {
      const user = await client.user.findFirst({
        where: {
          email: email,
        },
      });
      isRegistered = !!user;
    } catch (err) {
      console.log(err);
      throw new Error("Error While Checking User Registration");
    }
    OTP = Math.floor(1000 + Math.random() * 9000);

    try {
      await storeOTP(email, OTP);
      console.log('OTP stored successfully');
    } catch (err) {
      throw new Error(`Error storing OTP: ${err}`);
    }

    const receiver = {
      from: "canvasSync@gmail.com",
      to: email,
      subject: "🌟 Welcome to CanvasSync! 🌟",
      text: isRegistered
        ? `👋 Hello there!\n\nIt looks like you're already registered with us at CanvasSync. 🎉 If you’re experiencing any issues or believe this is an error, feel free to reach out to our support team at 📧 physics.sir.shivam@gmail.com.\n\nThank you for being a part of the CanvasSync family!\n\nCheers,  
      The CanvasSync Team`
        : `🎉 Welcome to CanvasSync!\n\nWe're thrilled to have you on board. To complete your registration, please use the following One-Time Password (OTP):\n\n🔑 **${OTP}**\n\nIf you didn’t request this OTP, no worries! Simply reach out to us at 📧 physics.sir.shivam@gmail.com to report this activity.\n\nWe’re here to ensure your experience with us is seamless and secure. 🌟\n\nBest regards,  
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
    throw new Error("Server facing errors");
  }
}

async function validateOTP(email:string, inputOtp:number) {
  const otpRecord = await client.oTP.findFirst({
    where: {
      email,
      otp: inputOtp,
      expiresAt: {
        gte: new Date(), // Ensure the OTP hasn't expired
      },
    },
  });

  if (!otpRecord) {
    throw new Error('Invalid or expired OTP');
  }

  // Optionally, delete the OTP after successful validation
  await client.oTP.delete({
    where: {
      id: otpRecord.id,
    },
  });

  return true;
}

export async function otpVerification(email : string ,inputOTP: string) {
  try {
    await validateOTP(email,parseInt(inputOTP));
    return true
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "OTP verification failed"
    );
  }
}
