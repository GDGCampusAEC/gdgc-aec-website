import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';


//Updating a member
export async function PATCH(req, { params }) {
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  }
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

    const updateData = { ...body };
    if (updateData.year !== undefined && updateData.year !== null) {
      updateData.year = parseInt(updateData.year);
    }
    if (updateData.showOnTrain !== undefined) {
      updateData.showOnTrain = updateData.showOnTrain === true;
    }

    await docRef.update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    })

    if (updateData.showOnTrain === true) {
      const year = updateData.year !== undefined ? updateData.year : docSnap.data().year;
      const snapshot = await db.collection('members').where('year', '==', year).get();
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        if (doc.id !== id) {
          batch.update(doc.ref, { showOnTrain: false });
        }
      });
      await batch.commit();
    }

    const updatedDoc=await docRef.get();
    
    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Deleting a member
export async function DELETE(req, { params }) {
  if (!db) {
    return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  }
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
