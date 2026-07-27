import { NextResponse } from "next/server";

const notImplemented = () =>
  NextResponse.json({ message: "Not implemented" }, { status: 501 });

export async function GET() {
  return notImplemented();
}

export async function POST() {
  return notImplemented();
}