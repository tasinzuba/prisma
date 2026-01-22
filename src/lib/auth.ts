import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS,
  },
});


export const auth = betterAuth({
  basePath: "/api/auth",
  debug: true,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },

      phone: {
        type: "string",
        required: false,
      },

      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },


  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
        const info = await transporter.sendMail({
    from: '"Prisma Blog" <prisma.blog@gmail.com>',
    to: "tasinahmed423@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?", // Plain-text version of the message
    html: "<b>Hello world?</b>", // HTML version of the message
  });

        console.log("Message sent: %s", info.messageId);
    }
    },
});


