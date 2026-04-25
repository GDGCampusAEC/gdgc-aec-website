import { NextResponse } from 'next/server';

import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";

//Getting all events
export async function GET() {
  try {
    await dbConnect();
    
    //{ date: -1 }puts the newest events first!
    const events = await Event.find({}).sort({ date: -1 });
    
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Creating new event
export async function POST(req) {
  try {
    const adminSecret = req.headers.get('x-admin-secret');
    
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Secret' }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();

    const newEvent = await Event.create(body);

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const adminSecret = req.headers.get('x-admin-secret');
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Secret' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = params;
    
    const deletedEvent = await Event.findOneAndDelete({ slug });

    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event successfully deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
