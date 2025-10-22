import nodemailer from "nodemailer";
import { ENV } from "@/config/env.config";

export const TRANSPORTER = nodemailer.createTransport({
    service: "gmail",
    auth   : {
        user: ENV.mail_user,
        pass: ENV.mail_pass,
    },
});
