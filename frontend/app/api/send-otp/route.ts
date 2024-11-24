import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/app/lib/helper';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    const response = await sendMail(email, otp);
    return NextResponse.json({ success: true, message: response });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to send email.", error: error },
      { status: 500 }
    );
  }
}
