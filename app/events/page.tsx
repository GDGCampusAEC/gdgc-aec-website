
import EventsSection from "@/app/components/EventsSection";

export default function EventsPage() {
  return (
    <main className="relative min-h-screen bg-[#FDFBF7] flex flex-col">
      
      {/* We add pt-32 (padding-top) so the floating navbar doesn't cover the title */}
      <div className="flex-grow pt-32">
        <EventsSection />
      </div>
    </main>
  );
}