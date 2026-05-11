// lib/getEvents.js
import { db } from "./firebaseAdmin";

export async function getEvents() {
  const snapshot = await db.collection("events").get();

  const events = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return events;
}