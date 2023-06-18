import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import logger from "./logger";

export default class Mailer {
  private static _transporter: Transporter<SMTPTransport.SentMessageInfo>;

  public static async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string
  ) {
    await this._transporter.sendMail({
      from: process.env.EMAIL_SENDER,
      to,
      subject,
      text,
      html,
    });
  }

  public static async init() {
    this._transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    this._transporter
      .sendMail({
        from: "",
        to: "",
        subject: "",
        text: "",
      })
      .catch((error: Error) => {
        if (error.message.match("Invalid login"))
          logger.error("Bad connection to the mailer service");
        else logger.info("Successful connection to the mailer service");
      });
  }
}
