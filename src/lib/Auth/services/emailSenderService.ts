import nodemailer from "nodemailer";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import config from "../../../config";

export async function sendWithNodemailer(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      	host: config.SMTP.host,
      	port: 587,
      	secure: false,
      	auth: { user: config.SMTP.user, pass: config.SMTP.pass }
  	});

  	await transporter.sendMail({
    	from: '"RECOLECTA RD" <no-reply@recolectard.com>',
    	to,
    	subject,
    	html
  	});
}

export async function sendWithSES(to: string, subject: string, html: string) {
  	const ses = new SESClient({ region: "us-east-1" });

  	const command = new SendEmailCommand({
    	Source: "no-reply@recolectard.com",
    	Destination: { ToAddresses: [to] },
    	Message: {
      	Subject: { Data: subject },
      	Body: { Html: { Data: html } }
    	}
  	});

  	await ses.send(command);
}