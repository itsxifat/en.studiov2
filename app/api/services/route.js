import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect'; // Adjust path
import Service from '../../models/service'; // Adjust path

export async function GET() {
  await dbConnect();
  try {
    const services = await Service.find({}).sort({ createdAt: 'asc' }).lean();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("API_PUBLIC_SERVICES_GET_ERROR:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch services.' }, { status: 500 });
  }
}