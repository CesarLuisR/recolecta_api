import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
   host: config.SMTP.host,
   port: 587,
   secure: false, // use false for STARTTLS; true for SSL on port 465
   auth: {
       user: config.SMTP.user,
       pass: config.SMTP.pass 
   }
});

export default transporter;