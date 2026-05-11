// app/components/Events.tsx

import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description: string;
};

export default function Events({ events }: { events: Event[] }) {
  return (
    <section className="p-10 text-white">
      <h2 className="text-4xl font-bold mb-6">Our Past Events</h2>

      <div className="grid grid-cols-2 gap-6">
        {events?.map((event) => (
          <Link href={`/events/${event.id}`} key={event.id}>
            <div className="border p-4 rounded-xl cursor-pointer hover:scale-105 hover:border-white/40 transition-all duration-300">
              <h3 className="font-bold">{event.title}</h3>
              <p className="text-gray-400">{event.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}