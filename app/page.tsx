import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatWeDo from "./components/WhatWeDo";
import Events from "./components/Events";
import Team from "./components/Team";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

import { getEvents } from "@/lib/getEvents"; // 👈 IMPORTANT

// export default async function Home() {
//   const events = await getEvents(); // 👈 REAL DATA

// //   return (
// //     <div className="bg-black min-h-screen">
// //       <Navbar />
// //       <Hero />
// //       <WhatWeDo />
// //       <Events events={events} /> {/* 👈 no more dummy */}
// //       <Team />
// //       <FAQ />
// //       <Footer />
// //     </div>
// //   );
// // }

export default async function Home() {
  const events = (await getEvents()) as {
    id: string;
    title: string;
    description: string;
  }[];

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <WhatWeDo />
      <Events events={events} />
      <Team />
      <FAQ />
      <Footer />
    </div>
  );
}