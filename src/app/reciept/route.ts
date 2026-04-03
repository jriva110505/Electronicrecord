// /app/api/send-receipt/route.ts (or /pages/api/send-receipt.ts)
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

interface ReceiptItem {
  id: number;
  name: string;
  qty: number;
}

interface ReceiptData {
  studentName: string;
  instructorName: string;
  section: string;
  email: string;
  items: ReceiptItem[];
  remarks?: string; // <-- added remarks field
}

export async function POST(req: NextRequest) {
  try {
    const data: ReceiptData = await req.json();
    const { studentName, instructorName, section, items, email, remarks } = data;

    if (!email) {
      console.error("No email provided in request");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("EMAIL_USER or EMAIL_PASS not set in environment variables");
      return NextResponse.json({ error: "Email credentials not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Build items HTML table rows
    const itemsHTML = items
      .map(
        (i) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${i.name}</td>
          <td style="padding:8px;text-align:center;border-bottom:1px solid #eee;">${i.qty}</td>
        </tr>`
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Central Supply Borrow Receipt",
      html: `
      <div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:20px;">
        <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <div style="background:#16a34a;color:white;padding:20px;text-align:center;">
            <h2 style="margin:0;">Central Supply Borrow Receipt</h2>
          </div>
          <div style="padding:20px;">
            ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ""}
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>Instructor:</strong> ${instructorName}</p>
            <p><strong>Section:</strong> ${section}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>
          <div style="padding:0 20px 20px 20px;">
            <h3>Borrowed Supplies</h3>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#e5e7eb;">
                  <th style="padding:10px;text-align:left;">Item</th>
                  <th style="padding:10px;text-align:center;">Qty</th>
                </tr>
              </thead>
              <tbody>${itemsHTML}</tbody>
            </table>
          </div>
          <div style="background:#fff7ed;padding:15px;margin:20px;border-radius:8px;border-left:4px solid #f97316;">
            <h3 style="margin-top:0;color:#ea580c;">Return Reminder</h3>
            <p style="margin:0;font-size:14px;">
              All borrowed supplies must be returned <strong>before 9:00 PM today</strong>.
            </p>
            <p style="margin:5px 0 0 0;font-size:14px;">
              If the supplies are not returned before the deadline, a reminder email will be sent automatically.
            </p>
          </div>
          <div style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#666;">
            Electronic Central Supplies Record System
          </div>
        </div>
      </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);

    return NextResponse.json({ success: true, info: info.response });
  } catch (err) {
    console.error("Error sending receipt email:", err);
    return NextResponse.json({ error: "Failed to send email", details: err }, { status: 500 });
  }
}