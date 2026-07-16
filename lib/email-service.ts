import nodemailer from "nodemailer";
import { RequestCreateInput } from "./validation";
import prisma from "./prisma";
import { decrypt } from "./cripto";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

export type MailConfig = {
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
  email: string;
  name: string;
  appName: string;
}

export async function getConfig(userId: number): Promise<MailConfig | null> {
  try {
    const config = await prisma.config.findUnique({
      where: { uid: userId },
      select: {
        email: true,
        name: true,
        siteName: true,
        emailSettings: {
          select: {
            smtpUser: true,
            smtpPasswordEncrypted: true,
          },
        },
      },
    });

    if (!config || !config.emailSettings) {
      return null;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.emailSettings.smtpUser,
        pass: decrypt(config.emailSettings.smtpPasswordEncrypted),
      },
    });

    return {
      transporter,
      email: config.email,
      appName: config.siteName,
      name: config.name,
    };
  } catch (error) {
    console.error("lib/email-service > getConfig:", error);
    return null;
  }
}

/**
 * Send an email
 * In development, logs to console instead of sending
 */
async function sendEmail(
  options: {
    to: string;
    subject: string;
    html: string;
    replyTo?: string | { name: string; address: string };
  },
  config: MailConfig
): Promise<void> {
  const { transporter, email } = config;

  await transporter.sendMail({
    from: email,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  });
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(
  config: MailConfig,
  token: string,
): Promise<void> {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}&email=${config.email}`;

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #081425; color: #eff3fc; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #152031; border-radius: 16px; padding: 40px; }
        .header { text-align: center; font-size: 24px; font-weight: bold; color: #eff3fc; }
        .content { margin-top: 24px; line-height: 1.8; }
        .button { display: inline-block; background: #2563eb; color: #eff3fc; padding: 12px 32px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
        .footer { margin-top: 32px; font-size: 14px; color: #eff3fc; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">${config.appName}</div>
        <div class="content">
          <h2>مرحباً ${config.name}،</h2>
          <p>شكراً لتسجيلك في ${config.appName}. يرجى تأكيد بريدك الإلكتروني بالضغط على الرابط أدناه:</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">تأكيد البريد الإلكتروني</a>
          </p>
          <p>إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد.</p>
          <p>هذا الرابط صالح لمدة 24 ساعة.</p>
        </div>
        <div class="footer">
          ${config.appName} - جميع الحقوق محفوظة
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: config.email,
    subject: `تأكيد البريد الإلكتروني - ${config.appName}`,
    html,
  }, config);
}

/**
 * Send password reset link
 */
export async function sendPasswordResetEmail(
  config: MailConfig,
  token: string, 
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
        <div class="header">${config.appName}</div>
        <div class="content">
          <h2>مرحباً ${config.name}،</h2>
          <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. انقر على الرابط أدناه لإنشاء كلمة مرور جديدة:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">إعادة تعيين كلمة المرور</a>
          </p>
          <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد.</p>
          <p>هذا الرابط صالح لمدة ساعة واحدة.</p>
        </div>
        <div class="footer">
          ${config.appName} - جميع الحقوق محفوظة
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: config.email,
    subject: `إعادة تعيين كلمة المرور - ${config.appName}`,
    html,
  }, config);
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail(config: MailConfig): Promise<void> {
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
        <div class="header">${config.appName}</div>
        <div class="content">
          <h2>مرحباً ${config.name}،</h2>
          <p>تم تأكيد بريدك الإلكتروني بنجاح! 🎉</p>
          <p>يمكنك الآن تسجيل الدخول إلى لوحة التحكم والبدء في إدارة مشاريعك.</p>
          <p>نتمنى لك تجربة ممتعة!</p>
        </div>
        <div class="footer">
          ${config.appName} - جميع الحقوق محفوظة
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: config.email,
    subject: `أهلاً بك في ${config.appName}`,
    html,
  }, config);
}

/**
 * Send request email
 */

export async function sendRequestEmail(content: RequestCreateInput, config: MailConfig) {
  const projectTypeMap = {
    COMMERCIAL: "إعلان تجاري",
    DOCUMENTARY: "فيلم وثائقي",
    MOTION_GRAPHICS: "موشن جرافيك",
    MUSIC_VIDEO: "فيديو كليب",
    OTHER: "أخرى",
  };

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">

<style>
body{
    font-family:Arial,sans-serif;
    background:#081425;
    color:#d8e3fb;
    padding:20px;
}

.container{
    max-width:650px;
    margin:auto;
    background:#152031;
    border-radius:16px;
    padding:40px;
}

.header{
    text-align:center;
    font-size:26px;
    font-weight:bold;
    color:#b4c5ff;
}

.content{
    margin-top:30px;
}

.card{
    background:#1b2a40;
    border-radius:10px;
    padding:20px;
    margin-top:20px;
}

.row{
    margin-bottom:14px;
}

.label{
    color:#8fb3ff;
    font-weight:bold;
}

.details{
    white-space:pre-wrap;
    line-height:1.8;
    margin-top:8px;
}

.footer{
    margin-top:30px;
    text-align:center;
    font-size:13px;
    color:#9ca3af;
}
</style>

</head>

<body>

<div class="container">

<div class="header">
طلب مشروع جديد
</div>

<div class="content">

<p>
تم إرسال طلب مشروع جديد عبر موقع
<strong>${config.appName}</strong>.
</p>

<div class="card">

<div class="row">
<span class="label">الاسم:</span>
${content.name}
</div>

<div class="row">
<span class="label">البريد الإلكتروني:</span>
${content.email}
</div>

<div class="row">
<span class="label">نوع المشروع:</span>
${projectTypeMap[content.type]}
</div>

${content.budget
      ? `
<div class="row">
<span class="label">الميزانية:</span>
${content.budget}
</div>
`
      : ""
    }

${content.location
      ? `
<div class="row">
<span class="label">الموقع:</span>
${content.location}
</div>
`
      : ""
    }

${content.deadline
      ? `
<div class="row">
<span class="label">الموعد المطلوب:</span>
${content.deadline}
</div>
`
      : ""
    }

<div class="row">
<span class="label">تفاصيل المشروع:</span>

<div class="details">
${content.details}
</div>

</div>

</div>

</div>

<div class="footer">

تم إرسال هذه الرسالة تلقائيًا من موقع
${config.appName}.

</div>

</div>

</body>

</html>
`;

  await sendEmail({
    to: config.email,
    subject: "طلب مشروع جديد",
    html,
    replyTo: { name: content.name, address: content.email },
  }, config);
}

/**
 * Send confirmation email after a project request is submitted
 */
export async function sendRequestConfirmationEmail(
  user: { name: string; email: string },
  config: MailConfig
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #081425;
          color: #d8e3fb;
          padding: 20px;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #152031;
          border-radius: 16px;
          padding: 40px;
        }

        .header {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #b4c5ff;
        }

        .content {
          margin-top: 24px;
          line-height: 1.9;
        }

        .footer {
          margin-top: 32px;
          font-size: 14px;
          color: #c3c6d7;
          text-align: center;
        }
      </style>
    </head>

    <body>
      <div class="container">

        <div class="header">
          ${config.appName}
        </div>

        <div class="content">
          <h2>مرحبًا ${user.name}،</h2>

          <p>
            شكرًا لتواصلك معنا.
          </p>

          <p>
            تم استلام طلب مشروعك بنجاح، وسيقوم فريقنا بمراجعته في أقرب وقت ممكن.
          </p>

          <p>
            سنتواصل معك عبر هذا البريد الإلكتروني إذا احتجنا إلى أي معلومات إضافية، أو لإبلاغك بالخطوات التالية.
          </p>

          <p>
            نقدر ثقتك بنا، ونتطلع إلى العمل معك.
          </p>
        </div>

        <div class="footer">
          ${config.appName} - جميع الحقوق محفوظة
        </div>

      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: `تم استلام طلبك | ${config.appName}`,
    html,
  }, config);
}

/**
 * Send email verification link
 */
export async function sendChangePasswordVerificationEmail(
  config: MailConfig,
  token: string,
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background: #081425; color: #eff3fc; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #152031; border-radius: 16px; padding: 40px; }
        .header { text-align: center; font-size: 24px; font-weight: bold; color: #eff3fc; }
        .content { margin-top: 24px; line-height: 1.8; }
        .button { display: inline-block; background: #2563eb; color: #eff3fc; padding: 12px 32px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
        .footer { margin-top: 32px; font-size: 14px; color: #eff3fc; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">${config.appName}</div>
        <div class="content">
          <h2>يريد ${config.name}، تغيير كلمة المرور</h2>
          <p>
            هذا هو رمز التحقق لتغيير كلمة مرورك
          </p>
          <p>${token}</p>
          <p>إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد.</p>
          <p>هذا الرمز صالح لمدة ساعة.</p>
        </div>
        <div class="footer">
          ${config.appName} - جميع الحقوق محفوظة
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: config.email,
    subject: `رمز تغيير كلمة المرور - ${config.appName}`,
    html,
  }, config);
}