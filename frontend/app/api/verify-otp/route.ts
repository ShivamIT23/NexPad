import { NextRequest, NextResponse } from "next/server";
import { otpVerification } from "@/app/lib/actions/helper";

export async function POST(req: NextRequest) {
  try {
    console.log("hii");
    const { email , enteredOtp } = await req.json();
    console.log("hii");
    const response = await otpVerification(email , enteredOtp);
    console.log("hii");
    return NextResponse.json({ success: true, message: response });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to verify otp.", error: error },
      { status: 500 }
    );
  }
}
