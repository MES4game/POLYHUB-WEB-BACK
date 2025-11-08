import nodemailer from "nodemailer";
import { ENV } from "@/config/env.config";

export const TRANSPORTER = nodemailer.createTransport({
    host  : ENV.smtp_host, 
    port  : ENV.smtp_port, 
    secure: ENV.smtp_port == 465,
    auth  : {
        user: ENV.smtp_user,
        pass: ENV.smtp_pass,
    },
});
