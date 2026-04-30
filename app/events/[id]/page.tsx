import { db } from "@/lib/firebaseAdmin";
import Image from "next/image";

type Event = {
  title: string;
  description: string;
  image?: string;
  date?: string;
  time?: string;
  location?: string;
  highlights?: string[];
};
export default async function EventPage({ params }: any)
 {
  const { id } = await params;

  console.log("PARAMS:", params); // 🔍 debug

  if (!id) {
    return <div className="text-white p-10">Invalid Event ID</div>;
  }

  const doc = await db.collection("events").doc(id).get();

  if (!doc.exists) {
    return <div className="text-white p-10">Event not found</div>;
  }

  const event = doc.data() as Event;

  return (
    <div className="text-white p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      
      {/* IMAGE */}
      <div className="rounded-xl overflow-hidden border border-white/10">
        <Image
          src={event.image || "/placeholder.png"}
          alt={event.title}
          width={800}
          height={600}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* CONTENT */}
      <div>
        <h1 className="text-5xl font-bold mb-4">{event.title}</h1>

        <p className="text-gray-400 mb-6">{event.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400">DATE</p>
            <p className="font-semibold">{event.date || "Coming Soon"}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400">TIME</p>
            <p className="font-semibold">{event.time || "TBA"}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400">LOCATION</p>
            <p className="font-semibold">{event.location || "TBA"}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Key Highlights</h2>

        <ul className="space-y-3">
          {(event.highlights || []).map((point, i) => (
            <li
              key={i}
              className="p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              • {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}