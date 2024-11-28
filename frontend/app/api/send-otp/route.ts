import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/app/lib/actions/helper';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const response = await sendMail(email);
    return NextResponse.json({ success: true, message: response });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to send email.", error: error },
      { status: 500 }
    );
  }
}
