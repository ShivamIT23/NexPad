import nodemailer from "nodemailer";

const auth = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "physics.sir.shivam@gmail.com",
    pass: "hzpucdiirdmajfjb",
  },
});

export async function sendMail(email: string, otp: number) {
  try {
    const receiver = {
      from: "canvasSync@gmail.com",
      to: email,
      subject: "From CanvasSync (*-*)",
      text: `Hello New User , If U are regitering to our website then your OTP is : ${otp}, If it is not u please send a mail to our email physics.sir.shivam@gmail.com to report this froud.!!!`,
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
