import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';


//Updating a member
export async function PATCH(req, { params }) {
  try {
    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await req.json();

    const docRef=db.collection('members').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    await docRef.update({
      ...body,
      createdAt: new Date().toISOString(),
    })

    const updatedDoc=await docRef.get();
    
    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Deleting a member
export async function DELETE(req, { params }) {
  try {
    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const { id } = await params;

    const docRef=db.collection('members').doc(id);
    const docSnap=await docRef.get();

    if(!docSnap.exists){
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
