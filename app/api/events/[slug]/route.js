import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

//Getting event
export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    const { slug } = await params;
    console.log("Next.js extracted this slug:", slug);
    
    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Updating events
export async function PATCH(req, { params }) {
  try {
    const adminSecret = req.headers.get('x-admin-secret');
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Secret' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    const body = await req.json();

    const updatedEvent = await Event.findOneAndUpdate({ slug }, body,{ returnDocument: 'after' });

    if (!updatedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Deleting event
export async function DELETE(req, { params }) {
  try {
    const adminSecret = req.headers.get('x-admin-secret');
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Secret' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    
    const deletedEvent = await Event.findOneAndDelete({ slug });

    if (!deletedEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event successfully deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}