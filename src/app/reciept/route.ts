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
  issuedBy?: string;
  status?: "APPROVED" | "DECLINED";
  transactionNo?: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: ReceiptData = await req.json();

    const {
      studentName,
      instructorName,
      section,
      items = [],
      email,
      remarks,
      issuedBy,
      status,
      transactionNo,
    } = data;

    const isDeclined = status === "DECLINED";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: "Email credentials not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: isDeclined
        ? "Borrow Request Declined"
        : "Central Supply Borrow Receipt",

      html: `
<div style="font-family:Segoe UI,Arial,sans-serif;background:#f1f5f9;padding:30px;">
  <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,0.08);">

    <!-- HEADER (UNCHANGED DESIGN) -->
    <div style="background:linear-gradient(135deg,${
      isDeclined ? "#991b1b,#ef4444" : "#166534,#22c55e"
    });color:white;padding:25px;text-align:center;">
      
      <h2 style="margin:0;font-size:20px;">
        ${isDeclined ? "Borrow Request Declined" : "Central Supply Office"}
      </h2>

      <p style="margin:6px 0 0 0;font-size:13px;">
        ${isDeclined ? "Request not approved" : "Borrowing Receipt Confirmation"}
      </p>

      <!-- TRANSACTION NUMBER -->
      <p style="margin-top:10px;font-size:13px;opacity:0.9;">
        Transaction #: <strong>${transactionNo || "N/A"}</strong>
      </p>
    </div>

    <!-- BODY -->
    <div style="padding:25px;">

      <!-- DECLINE REASON -->
      ${
        isDeclined && remarks
          ? `
        <div style="margin-bottom:20px;padding:16px;border:1px solid #fecaca;border-radius:10px;background:#fef2f2;">
          <div style="font-size:12px;color:#991b1b;margin-bottom:6px;">
            REASON FOR DECLINE
          </div>
          <div style="font-size:14px;color:#7f1d1d;font-weight:600;">
            ${remarks}
          </div>
        </div>
      `
          : ""
      }

      <!-- INFO TABLE -->
      <table style="width:100%;font-size:14px;border-spacing:0 10px;">

        <tr>
          <td style="width:140px;color:#6b7280;">Student</td>
          <td style="font-weight:600;">${studentName}</td>
        </tr>

        <tr>
          <td style="color:#6b7280;">Instructor</td>
          <td style="font-weight:600;">${instructorName}</td>
        </tr>

        <tr>
          <td style="color:#6b7280;">Section</td>
          <td style="font-weight:600;">${section}</td>
        </tr>

        <tr>
          <td style="color:#6b7280;">Processed By</td>
          <td>
            <span style="background:#eef2ff;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">
              ${issuedBy || "N/A"}
            </span>
          </td>
        </tr>

        <tr>
          <td style="color:#6b7280;">Date</td>
          <td>${new Date().toLocaleDateString()}</td>
        </tr>

        <tr>
          <td style="color:#6b7280;">Time</td>
          <td>${new Date().toLocaleTimeString()}</td>
        </tr>

      </table>

      <!-- ITEMS ONLY IF APPROVED -->
      ${
        !isDeclined
          ? `
        <div style="margin-top:25px;">
          <h3 style="margin-bottom:10px;font-size:16px;">
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
                  <td style="padding:12px;border-bottom:1px solid #f1f5f9;">
                    ${i.name}
                  </td>
                  <td style="padding:12px;text-align:center;font-weight:600;border-bottom:1px solid #f1f5f9;">
                    ${i.qty}
                  </td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>

          <div style="margin-top:20px;padding:12px;background:#f9fafb;border-radius:10px;">
            <strong>Total Items:</strong> ${totalItems}
          </div>

          <div style="margin-top:20px;padding:16px;background:#fff7ed;border-left:5px solid #f97316;border-radius:10px;">
            <h4 style="margin:0 0 6px 0;color:#ea580c;">⚠ Return Reminder</h4>
            <p style="margin:0;font-size:13px;">
              Please return all borrowed supplies before 9:00 PM today.
            </p>
          </div>
        </div>
      `
          : `
        <div style="margin-top:20px;padding:16px;background:#fef2f2;border-left:5px solid #ef4444;border-radius:10px;">
          <h4 style="margin:0 0 6px 0;color:#b91c1c;">Request Not Approved</h4>
          <p style="margin:0;font-size:13px;">
            Please contact the office if you have concerns.
          </p>
        </div>
      `
      }

    </div>

    <!-- FOOTER -->
    <div style="background:#f9fafb;padding:18px;text-align:center;font-size:12px;color:#6b7280;">
      Electronic Central Supplies System
    </div>

  </div>
</div>
`,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: isDeclined ? "Decline email sent" : "Receipt email sent",
      info: info.response,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}