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
  remarks?: string;
  issuedBy?: string; // <-- added remarks field
}

export async function POST(req: NextRequest) {
  try {
    const data: ReceiptData = await req.json();
    const { studentName, instructorName, section, items, email, remarks, issuedBy } = data;

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
<div style="font-family:Segoe UI,Arial,sans-serif;background:#f3f4f6;padding:30px;">
  <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">

    <!-- HEADER -->
    <div style="background:linear-gradient(135deg,#16a34a,#22c55e);color:white;padding:25px;text-align:center;">
      <h2 style="margin:0;font-size:22px;">Central Supply Office</h2>
      <p style="margin:5px 0 0 0;font-size:13px;opacity:0.9;">
        Borrow Transaction Receipt
      </p>
    </div>

    <!-- INFO SECTION -->
    <div style="padding:25px;">
      
      ${remarks ? `
      <div style="margin-bottom:15px;padding:12px;background:#fef9c3;border-left:4px solid #eab308;border-radius:6px;">
        <strong>Remarks:</strong> ${remarks}
      </div>` : ""}

      <table style="width:100%;font-size:14px;">
        <tr>
          <td style="padding:6px 0;"><strong>Student:</strong></td>
          <td>${studentName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Instructor:</strong></td>
          <td>${instructorName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Section:</strong></td>
          <td>${section}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Date:</strong></td>
          <td>${new Date().toLocaleDateString()}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Time:</strong></td>
          <td>${new Date().toLocaleTimeString()}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Issued By:</strong></td>
          <td>
            <span style="
              background:#eef2ff;
              color:#3730a3;
              padding:4px 10px;
              border-radius:999px;
              font-size:12px;
              font-weight:600;
            ">
              ${issuedBy || "N/A"}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- ITEMS TABLE -->
    <div style="padding:0 25px 25px 25px;">
      <h3 style="margin-bottom:10px;color:#111827;">Borrowed Items</h3>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#f1f5f9;text-align:left;">
            <th style="padding:10px;border-bottom:2px solid #e5e7eb;">Item</th>
            <th style="padding:10px;text-align:center;border-bottom:2px solid #e5e7eb;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
    </div>

    <!-- REMINDER -->
    <div style="margin:0 25px 25px 25px;padding:15px;background:#fff7ed;border-left:5px solid #f97316;border-radius:8px;">
      <h4 style="margin:0 0 5px 0;color:#ea580c;">⚠ Return Reminder</h4>
      <p style="margin:0;font-size:13px;color:#444;">
        Please return all borrowed supplies <strong>before 9:00 PM today</strong>.
      </p>
      <p style="margin:5px 0 0 0;font-size:13px;color:#666;">
        Late returns may trigger automatic notifications.
      </p>
    </div>

    <!-- FOOTER -->
    <div style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
      <p style="margin:0;">Electronic Central Supplies Record System</p>
      <p style="margin:3px 0 0 0;">This is a system-generated receipt. No signature required.</p>
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