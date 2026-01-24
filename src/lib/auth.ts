import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

/* -------------------- MAIL TRANSPORT -------------------- */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* -------------------- AUTH CONFIG -------------------- */
export const auth = betterAuth({
  basePath: "/api/auth",
  debug: true,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],

  /* -------------------- USER FIELDS -------------------- */
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

  /* -------------------- EMAIL + PASSWORD -------------------- */
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  /* -------------------- EMAIL VERIFICATION -------------------- */
  emailVerification: {
    sendOnSignUp: true,
autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        await transporter.sendMail({
          from: '"Prisma Blog" <biic.web1@gmail.com>',
          to: user.email,
          subject: "Please verify your email address",
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .header {
      background: #4f46e5;
      color: #ffffff;
      padding: 24px;
      text-align: center;
    }
    .content {
      padding: 32px;
      color: #333333;
      line-height: 1.6;
    }
    .button-wrapper {
      text-align: center;
      margin: 32px 0;
    }
    .verify-button {
      display: inline-block;
      padding: 14px 28px;
      background: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #777777;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Prisma Blog</h1>
    </div>

    <div class="content">
      <h2>Verify your email address</h2>
      <p>Hello ${user.email},</p>
      <p>
        Thanks for signing up for <strong>Prisma Blog</strong>.
        Please confirm your email address by clicking the button below.
      </p>

      <div class="button-wrapper">
        <a href="${verificationUrl}" class="verify-button">
          Verify Email
        </a>
      </div>

      <p>If the button doesn’t work, copy and paste this link:</p>
      <p style="word-break: break-all;">
        <a href="${verificationUrl}">${verificationUrl}</a>
      </p>

      <p>If you didn’t create an account, you can safely ignore this email.</p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
    </div>
  </div>
</body>
</html>`,
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    },
  },

  /* -------------------- SOCIAL LOGIN -------------------- */
  socialProviders: {
    google: {
       prompt: "select_account consent",
       accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
     
    },
  },
});
