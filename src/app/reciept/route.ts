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
<div style="font-family:Segoe UI,Arial,sans-serif;background:#f1f5f9;padding:30px;">
  <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,0.08);">

    <!-- HEADER -->
    <div style="background:linear-gradient(135deg,#166534,#22c55e);color:white;padding:25px;text-align:center;">
      <h2 style="margin:0;font-size:20px;letter-spacing:0.5px;">
        Central Supply Office
      </h2>
      <p style="margin:6px 0 0 0;font-size:13px;opacity:0.9;">
        Borrowing Receipt Confirmation
      </p>
    </div>

    <!-- BODY -->
    <div style="padding:25px;">

      <!-- REMARKS (FORMAL STYLE) -->
      ${remarks ? `
      <div style="margin-bottom:20px;padding:14px;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa;">
        <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">
          REMARKS
        </div>
        <div style="font-size:14px;color:#111827;font-weight:500;">
          ${remarks}
        </div>
      </div>` : ""}

      <!-- FORMAL INFO TABLE -->
      <table style="width:100%;font-size:14px;border-collapse:separate;border-spacing:0 10px;">

        <tr>
          <td style="width:140px;color:#6b7280;">Student</td>
          <td style="font-weight:600;color:#111827;">${studentName}</td>
        </tr>

        <tr>
          <td style="width:140px;color:#6b7280;">Instructor</td>
          <td style="font-weight:600;color:#111827;">${instructorName}</td>
        </tr>

        <tr>
          <td style="width:140px;color:#6b7280;">Section</td>
          <td>
            <span style="font-weight:600;color:#111827;">
              ${section}
            </span>
          </td>
        </tr>

        <tr>
          <td style="width:140px;color:#6b7280;">Issued By</td>
          <td>
            <span style="display:inline-block;padding:4px 10px;border-radius:6px;background:#eef2ff;color:#3730a3;font-size:12px;font-weight:600;">
              ${issuedBy || "N/A"}
            </span>
          </td>
        </tr>

        <tr>
          <td style="width:140px;color:#6b7280;">Date</td>
          <td style="color:#111827;">${new Date().toLocaleDateString()}</td>
        </tr>

        <tr>
          <td style="width:140px;color:#6b7280;">Time</td>
          <td style="color:#111827;">${new Date().toLocaleTimeString()}</td>
        </tr>

      </table>

      <!-- ITEMS SECTION -->
      <div style="margin-top:25px;">
        <h3 style="margin-bottom:10px;color:#111827;font-size:16px;">
          Borrowed Items
        </h3>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:12px;text-align:left;border-bottom:2px solid #e5e7eb;">Item</th>
              <th style="padding:12px;text-align:center;border-bottom:2px solid #e5e7eb;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (i) => `
                <tr>
                  <td style="padding:12px;border-bottom:1px solid #f1f5f9;color:#111827;">
                    ${i.name}
                  </td>
                  <td style="padding:12px;text-align:center;border-bottom:1px solid #f1f5f9;font-weight:600;">
                    ${i.qty}
                  </td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <!-- SUMMARY -->
      <div style="margin-top:20px;padding:12px;background:#f9fafb;border-radius:10px;font-size:14px;">
        <strong>Total Items:</strong>
        ${items.reduce((sum, i) => sum + i.qty, 0)}
      </div>

    </div>

    <!-- REMINDER -->
    <div style="margin:0 25px 25px 25px;padding:16px;background:#fff7ed;border-left:5px solid #f97316;border-radius:10px;">
      <h4 style="margin:0 0 6px 0;color:#ea580c;">⚠ Return Reminder</h4>
      <p style="margin:0;font-size:13px;color:#444;">
        Please return all borrowed supplies <strong>before 9:00 PM today</strong>.
      </p>
      <p style="margin:6px 0 0 0;font-size:12px;color:#666;">
        Late returns may trigger automatic notifications.
      </p>
    </div>

    <!-- FOOTER -->
    <div style="background:#f9fafb;padding:18px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-weight:500;">
        Electronic Central Supplies Record System
      </p>
      <p style="margin:4px 0 0 0;">
        This is a system-generated receipt. No signature required.
      </p>
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