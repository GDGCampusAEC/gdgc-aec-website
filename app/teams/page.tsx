// Notice we removed Navbar and Footer since they are in layout.tsx now!
import TeamTrainSection from "@/app/components/TeamTrainSection";

export default function TeamsPage() {
  return (
    <main className="relative min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* We no longer need pt-32 because the train handles its own centering */}
      <div className="flex-grow">
        <TeamTrainSection />
      </div>
    </main>
  );
}