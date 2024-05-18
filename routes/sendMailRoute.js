import express from "express";
import nodemailer from "nodemailer";
import User from "../models/UserModel.js";

const router = express.Router();

router.post("/lists/:listId/send-email", async (req, res) => {
  const { subject, body, email, password } = req.body;
  const listId = req.params.listId;

  try {
    const users = await User.find({ list: listId });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });

    const domain = `localhost:${process.env.PORT}`;

    const sendMailPromises = users.map((user) => {
      const unsubscribeLink = `http://${domain}/unsubscribe/${user._id}`;
      const personalizedBody = `${body}
        <p>To unsubscribe, <a href="${unsubscribeLink}">click here</a>.</p>
      `
        .replace(/\[name\]/g, user.name)
        .replace(/\[email\]/g, user.email)
        .replace(/\[city\]/g, user.city);

      const mailOptions = {
        from: email,
        to: user.email,
        subject,
        html: personalizedBody,
      };

      return transporter
        .sendMail(mailOptions)
        .then((info) =>
          console.log(`Email sent to ${user.email}:`, info.response)
        )
        .catch((error) =>
          console.log(`Error sending email to ${user.email}:`, error)
        );
    });

    await Promise.all(sendMailPromises);
    res.send({ message: "Emails sent" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send({ error: "Error sending emails" });
  }
});

export default router;
