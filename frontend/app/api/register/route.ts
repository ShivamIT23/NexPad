import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ message: 'Hello from the Register Route!' });
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
