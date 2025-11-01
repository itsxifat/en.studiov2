import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Service from '../../../models/service';

// GET all services, sorted by displayOrder
export async function GET() {
  await dbConnect();
  try {
    const services = await Service.find({}).sort({ displayOrder: 'asc' });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch services.' }, { status: 500 });
  }
}

// POST a new service
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    // Validate required fields
    if (!body.title || !body.description || !body.icon || !body.startingPrice) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }
    const service = await Service.create(body);
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create service.' }, { status: 500 });
  }
}