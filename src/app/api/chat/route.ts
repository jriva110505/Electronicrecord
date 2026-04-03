import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ reply: ["No message provided."] }, { status: 400 });
    }

    const autoReply = 
  "Hello! 👋\n" +
  "Thank you for reaching out.\n" +
  "We're reviewing your message...\n" +
  "📩 Your message has been received. Please wait for admin response.";

    return NextResponse.json({ reply: autoReply }, { status: 200 });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ reply: ["Server error. Please try again later."] }, { status: 500 });
  }
}