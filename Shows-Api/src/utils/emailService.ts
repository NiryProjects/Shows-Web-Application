import nodeMailer from "nodemailer";

export const sendMail = async (
  userEmail: string,
  username: string,
  newPassword: string
): Promise<number> => {
  const appEmail = process.env.AppEmail;
  const passwordAppEmail = process.env.AppEmailPassword;

  if (!appEmail || !passwordAppEmail) {
    console.error("Missing AppEmail or AppEmailPassword environment variables!");
    return 0;
  }

  const html = `
    <h1>Hello, ${appEmail} => ${username}</h1>
    <p>New Password : ${newPassword}</p>
    `;

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: appEmail,
      pass: passwordAppEmail,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `Nir.y mails <${appEmail}>`,
      to: userEmail,
      subject: "Shows Web App , New Password (forgot password)",
      html: html,
    });

    console.log("Message sent: " + info.messageId);
    console.log("V ", info.accepted);
    console.log("X ", info.rejected);
    console.log();

    // info.accepted is an array of strings or addresses, so return length
    if (Array.isArray(info.accepted)) {
      return info.accepted.length;
    }
    return 0;
  } catch (error) {
    console.error("Error sending email:", error);
    return 0;
  }
};
