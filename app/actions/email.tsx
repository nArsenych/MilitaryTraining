'use server';

import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export async function sendConfirmationEmail(formData: FormData) {
  const purchaseId = formData.get('purchaseId') as string;
  
  try {
    const purchase = await db.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        student: true,
        course: true,
      }
    });

    if (!purchase) {
      throw new Error("Purchase not found");
    }

    const response = await fetch(`https://api.clerk.dev/v1/users/${purchase.student.user_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    });
    const user = await response.json();
    const userEmail = user.email_addresses?.[0]?.email_address;

    if (!userEmail) {
      throw new Error("User email not found");
    }

    // Create a type-safe transporter configuration
    const transportConfig: SMTPTransport.Options = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    };

    const transporter: Transporter = nodemailer.createTransport(transportConfig);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Запис на курс "${purchase.course.title}" підтверджено`,
      text: `Вітаємо! Ваш запис на курс "${purchase.course.title}" було підтверджено. Чекаємо на вас!`
    });

    return { success: true } as const;
  } catch (error) {
    console.error('Error sending confirmation:', error);
    return { success: false, error: 'Failed to send confirmation' } as const;
  }
}