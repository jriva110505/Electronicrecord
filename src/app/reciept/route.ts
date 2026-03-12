import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { studentName, instructorName, section, items, email } = data;

    if (!email) return new Response("Email is required", { status: 400 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create table rows
    const itemsHTML = items
      .map(
        (i: any) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${i.name}</td>
          <td style="padding:8px;text-align:center;border-bottom:1px solid #eee;">${i.qty}</td>
        </tr>
      `
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Central Supply Borrow Receipt",
      html: `
      <div style="font-family:Arial,sans-serif;background:#f3f4f6;padding:20px;">
        <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background:#16a34a;color:white;padding:20px;text-align:center;">
            <h2 style="margin:0;">Central Supply Borrow Receipt</h2>
          </div>

          <!-- Info -->
          <div style="padding:20px;">
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>Instructor:</strong> ${instructorName}</p>
            <p><strong>Section:</strong> ${section}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>

          <!-- Items -->
          <div style="padding:0 20px 20px 20px;">
            <h3>Borrowed Supplies</h3>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#e5e7eb;">
                  <th style="padding:10px;text-align:left;">Item</th>
                  <th style="padding:10px;text-align:center;">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div style="background:#f9fafb;padding:15px;text-align:center;font-size:12px;color:#666;">
            Electronic Central Supplies Record System
          </div>

        </div>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to send email", { status: 500 });
  }
}