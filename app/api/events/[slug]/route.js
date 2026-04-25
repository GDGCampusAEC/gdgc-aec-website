import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

//Getting event by slug helper function
async function getEventBySlug(slug) {
  const snapshot = await db.collection('events').where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ref: doc.ref, data: doc.data() };
}

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ id: event.id, ...event.data });
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

    const { slug } = await params;
    const body = await req.json();
    const event=await getEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await event.ref.update({
      ...body,
      updatedAt: new Date().toISOString()
    });

    const updatedDoc = await event.ref.get();
    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Deleting event
export async function DELETE(req, { params }) {
  try {
    const adminSecret = req.headers.get('x-admin-secret');
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    
    const event = await getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Delete the document
    await event.ref.delete();

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}