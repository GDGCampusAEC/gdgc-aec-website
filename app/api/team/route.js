import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

//Get all members
export async function GET() {
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  }
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
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  }
  try {
    const adminSecret = req.headers.get('x-admin-secret');
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.name || !body.role || !body.year) {
      return NextResponse.json({ error: 'Name, role, and year are required fields' }, { status: 400 });
    }
  
    const memberData = {
      ...body,
      year: parseInt(body.year),
      showOnTrain: body.showOnTrain === true,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('members').add(memberData);

    if (memberData.showOnTrain) {
      const year = memberData.year;
      const snapshot = await db.collection('members').where('year', '==', year).get();
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        if (doc.id !== docRef.id) {
          batch.update(doc.ref, { showOnTrain: false });
        }
      });
      await batch.commit();
    }

    return NextResponse.json({ id: docRef.id, ...memberData }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}