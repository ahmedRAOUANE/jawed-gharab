// lib/email-service.ts
import nodemailer from "nodemailer";

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const APP_NAME = process.env.APP_NAME || "Jawed Gharab";
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@jawedgharab.com";

// Use mock email in development if no credentials are set
const isDevelopment = process.env.NODE_ENV === "development";
const useMockEmail = !process.env.EMAIL_HOST || isDevelopment;

// Create transporter only if not using mock
const transporter = !useMockEmail
    ? nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    })
    : null;

/**
 * Send an email
 * In development, logs to console instead of sending
 */
async function sendEmail(options: {
    to: string;
    subject: string;
    html: string;
}): Promise<void> {
    if (useMockEmail) {
        console.log("\n📧 [MOCK EMAIL] ================================");
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log("Body:");
        console.log(options.html);
        console.log("============================================\n");
        return;
    }

    if (!transporter) {
        throw new Error("Email transporter not configured");
    }

    await transporter.sendMail({
        from: EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(
    user: { name: string; email: string },
    token: string
): Promise<void> {
    const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #081425; color: #d8e3fb; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #152031; border-radius: 16px; padding: 40px; }
        .header { text-align: center; font-size: 24px; font-weight: bold; color: #b4c5ff; }
        .content { margin-top: 24px; line-height: 1.8; }
        .button { display: inline-block; background: #2563eb; color: #eeefff; padding: 12px 32px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
        .footer { margin-top: 32px; font-size: 14px; color: #c3c6d7; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">${APP_NAME}</div>
        <div class="content">
          <h2>مرحباً ${user.name}،</h2>
          <p>شكراً لتسجيلك في ${APP_NAME}. يرجى تأكيد بريدك الإلكتروني بالضغط على الرابط أدناه:</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">تأكيد البريد الإلكتروني</a>
          </p>
          <p>إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد.</p>
          <p>هذا الرابط صالح لمدة 24 ساعة.</p>
        </div>
        <div class="footer">
          ${APP_NAME} - جميع الحقوق محفوظة
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail({
        to: user.email,
        subject: `تأكيد البريد الإلكتروني - ${APP_NAME}`,
        html,
    });
}

/**
 * Send password reset link
 */
export async function sendPasswordResetEmail(
    user: { name: string; email: string },
    token: string
): Promise<void> {
    const resetUrl = `${APP_URL}/reset-password?token=${token}`;

    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #081425; color: #d8e3fb; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #152031; border-radius: 16px; padding: 40px; }
        .header { text-align: center; font-size: 24px; font-weight: bold; color: #b4c5ff; }
        .content { margin-top: 24px; line-height: 1.8; }
        .button { display: inline-block; background: #2563eb; color: #eeefff; padding: 12px 32px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
        .footer { margin-top: 32px; font-size: 14px; color: #c3c6d7; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">${APP_NAME}</div>
        <div class="content">
          <h2>مرحباً ${user.name}،</h2>
          <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. انقر على الرابط أدناه لإنشاء كلمة مرور جديدة:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">إعادة تعيين كلمة المرور</a>
          </p>
          <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد.</p>
          <p>هذا الرابط صالح لمدة ساعة واحدة.</p>
        </div>
        <div class="footer">
          ${APP_NAME} - جميع الحقوق محفوظة
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail({
        to: user.email,
        subject: `إعادة تعيين كلمة المرور - ${APP_NAME}`,
        html,
    });
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail(user: { name: string; email: string }): Promise<void> {
    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #081425; color: #d8e3fb; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #152031; border-radius: 16px; padding: 40px; }
        .header { text-align: center; font-size: 24px; font-weight: bold; color: #b4c5ff; }
        .content { margin-top: 24px; line-height: 1.8; }
        .footer { margin-top: 32px; font-size: 14px; color: #c3c6d7; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">${APP_NAME}</div>
        <div class="content">
          <h2>مرحباً ${user.name}،</h2>
          <p>تم تأكيد بريدك الإلكتروني بنجاح! 🎉</p>
          <p>يمكنك الآن تسجيل الدخول إلى لوحة التحكم والبدء في إدارة مشاريعك.</p>
          <p>نتمنى لك تجربة ممتعة!</p>
        </div>
        <div class="footer">
          ${APP_NAME} - جميع الحقوق محفوظة
        </div>
      </div>
    </body>
    </html>
  `;

    await sendEmail({
        to: user.email,
        subject: `أهلاً بك في ${APP_NAME}`,
        html,
    });
}