import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

//Get all members
export async function GET() {
  try {
    const snapshot = await db.collection('members').get();
    
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error("Firebase Team GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Creating a new member
export async function POST(req) {
  try {
    const adminSecret = req.headers.get('x-admin-secret');
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.name || !body.role || !body.year) {
      return NextResponse.json({ error: 'Name, role, and year are required fields' }, { status: 400 });
    }
  
    const docRef= await db.collection('members').add({
      ...body,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ id: docRef.id, ...body}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}