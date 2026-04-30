// app/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur px-6 py-2 rounded-full flex gap-6 text-white border">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/events">Events</Link>
      <Link href="/team">Team</Link>
      <Link href="/faq">FAQ</Link>
    </nav>
  );
}