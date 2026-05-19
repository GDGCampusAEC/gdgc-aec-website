"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, LogOut, LayoutDashboard, Users, CalendarDays, Server, CheckCircle2, Loader2 } from "lucide-react";
import { robustParseDate } from "@/lib/dateUtils";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "team">("events");

  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    slug: "",
    date: "",
    time: "",
    location: "",
    tag: "",
    tagColor: "bg-[#4285f4]",
    desc: "",
    longDescription: "",
    image: "",
    gallery: [""]
  });
  const [team, setTeam] = useState<any[]>([]);
  const [newMember, setNewMember] = useState({ 
    name: "", 
    role: "", 
    year: "2026", 
    img: "/assets/team-1.jpg",
    github: "",
    linkedin: "",
    globe: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    async function verifySession() {
      const savedSecret = localStorage.getItem("gdgc_admin_secret");
      if (savedSecret) {
        try {
          const decodedSecret = atob(savedSecret);
          const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ secret: decodedSecret }),
          });

          if (res.ok) {
            setSecret(decodedSecret);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("gdgc_admin_secret");
          }
        } catch (e) {
          localStorage.removeItem("gdgc_admin_secret");
        }
      }
    }
    verifySession();
  }, []);

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, teamRes] = await Promise.all([fetch("/api/events"), fetch("/api/team")]);
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (teamRes.ok) setTeam(await teamRes.json());
    } catch (err) {
      setError("API Offline. Showing local cache.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("gdgc_admin_secret", btoa(secret));
      } else {
        const data = await res.json();
        setError(data.error || "Invalid Secret Key");
        setSecret("");
      }
    } catch (err) {
      setError("Failed to connect to authentication server.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSecret("");
    localStorage.removeItem("gdgc_admin_secret");
  };

  const handleDateChange = (dateVal: string) => {
    const parsedDate = robustParseDate(dateVal);
    let updatedTag = newEvent.tag;
    
    if (dateVal && parsedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsedDate.getTime() >= today.getTime()) {
        updatedTag = "Yet to Happen";
      } else {
        updatedTag = "Completed";
      }
    }
    
    setNewEvent(prev => ({
      ...prev,
      date: dateVal,
      tag: updatedTag
    }));
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      let finalTag = newEvent.tag.trim();
      const parsedDate = robustParseDate(newEvent.date);
      const isFuture = (() => {
        if (!newEvent.date) return false;
        if (!parsedDate) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return parsedDate.getTime() >= today.getTime();
      })();

      if (isFuture) {
        finalTag = "Yet to Happen";
      } else if (!finalTag) {
        finalTag = "Completed";
      }

      const eventToSave = {
        ...newEvent,
        tag: finalTag,
        gallery: newEvent.gallery.filter(url => url.trim() !== "")
      };

      const url = isEditing ? `/api/events/${editingSlug}` : "/api/events";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(eventToSave),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} event`);
      }

      const savedEvent = await res.json();

      if (isEditing) {
        setEvents(events.map(ev => ev.slug === editingSlug ? savedEvent : ev));
        showSuccess("Event updated successfully.");
      } else {
        setEvents([savedEvent, ...events]);
        showSuccess("Event published to the network.");
      }

      cancelEdit();
    } catch (err: any) { setError(err.message); }
  };

  const startEdit = (event: any) => {
    setNewEvent({
      title: event.title || "",
      slug: event.slug || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      tag: event.tag || "",
      tagColor: event.tagColor || "bg-[#4285f4]",
      desc: event.desc || event.description || "",
      longDescription: event.longDescription || "",
      image: event.image || "",
      gallery: event.gallery && event.gallery.length > 0 ? [...event.gallery, ""] : [""]
    });
    setIsEditing(true);
    setEditingSlug(event.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setNewEvent({
      title: "",
      slug: "",
      date: "",
      time: "",
      location: "",
      tag: "",
      tagColor: "bg-[#4285f4]",
      desc: "",
      longDescription: "",
      image: "",
      gallery: [""]
    });
    setIsEditing(false);
    setEditingSlug(null);
  };

  const deleteEvent = async (slug: string) => {
    try {
      const res = await fetch(`/api/events/${slug}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events.filter((ev) => ev.slug !== slug));
      showSuccess("Event archived successfully.");
    } catch (err: any) { setError(err.message); }
  };

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ ...newMember, year: parseInt(newMember.year) }),
      });
      if (!res.ok) throw new Error("Failed to add member");
      const savedMember = await res.json();
      setTeam([savedMember, ...team]);
      setNewMember({ 
        name: "", 
        role: "", 
        year: "2026", 
        img: "/assets/team-1.jpg",
        github: "",
        linkedin: "",
        globe: ""
      });
      showSuccess("Team member boarded.");
    } catch (err: any) { setError(err.message); }
  };

  const deleteMember = async (id: string) => {
    try {
      const res = await fetch(`/api/team/member/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      if (!res.ok) throw new Error("Failed to delete member");
      setTeam(team.filter((m) => (m._id || m.id) !== id));
      showSuccess("Member removed from registry.");
    } catch (err: any) { setError(err.message); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[2.5rem] shadow-sm w-full max-w-md border border-gray-100 flex flex-col items-center">
          <div className="flex gap-1 mb-8">
            <div className="w-3 h-3 rounded-full bg-[#4285f4]" />
            <div className="w-3 h-3 rounded-full bg-[#db4437]" />
            <div className="w-3 h-3 rounded-full bg-[#f4b400]" />
            <div className="w-3 h-3 rounded-full bg-[#0f9d58]" />
          </div>
          <h1 className="text-3xl font-normal text-gray-900 mb-2 font-sans tracking-tight">Admin Sign in</h1>
          <p className="text-gray-600 mb-6 font-medium">Continue to GDGC Workspace</p>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[#db4437] text-sm font-medium mb-4 bg-[#fce8e6] px-4 py-2 rounded-lg w-full text-center">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="w-full">
            <div className="relative mb-6">
              <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} className="w-full px-4 pt-6 pb-2 border-2 border-gray-200 rounded-xl focus:border-[#4285f4] focus:ring-0 outline-none peer transition-colors bg-transparent" required disabled={isAuthenticating} />
              <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 ${secret ? 'text-xs top-2 text-[#4285f4]' : 'text-base top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Authorization Key</label>
            </div>
            <div className="flex justify-end mt-8">
              <button type="submit" disabled={isAuthenticating} className="bg-[#4285f4] text-white px-8 py-2.5 rounded-full font-medium hover:bg-[#3367d6] hover:shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2">
                {isAuthenticating ? <Loader2 size={18} className="animate-spin" /> : "Verify & Login"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8 flex justify-between items-end border-b border-gray-200 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex grid-cols-2 gap-0.5 w-5 h-5">
              <div className="w-full h-full bg-[#4285f4] rounded-tl-sm" />
              <div className="w-full h-full bg-[#db4437] rounded-tr-sm" />
              <div className="w-full h-full bg-[#f4b400] rounded-bl-sm" />
              <div className="w-full h-full bg-[#0f9d58] rounded-br-sm" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Admin Console</span>
          </div>
          <h1 className="text-4xl font-normal tracking-tight">GDGC Workspace</h1>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition-colors flex items-center gap-2 font-medium text-sm">
          <LogOut size={16} /> Disconnect
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

         <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#e6f4ea] border border-[#ceead6] text-[#137333] px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-medium text-sm">
              <CheckCircle2 size={18} /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-100/80 p-1 rounded-full flex shadow-inner">
            {(["events", "team"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab ? "bg-[#d3e3fd] text-blue-900 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  }`}
              >
                {tab === "events" ? <CalendarDays size={16} /> : <Users size={16} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <h2 className="text-xl font-normal text-gray-800 mb-6 flex items-center gap-2">
              <Server size={20} className="text-[#4285f4]" /> Active {activeTab === "events" ? "Schedules" : "Roster"}
            </h2>

            {loading ? (
              <div className="animate-pulse flex flex-col gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl" />)}
              </div>
            ) : (
              <motion.div layout className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {activeTab === "events" && events.map((event, index) => {
                    const isUpcoming = (() => {
                      if (event.tag) {
                        const cleanTag = event.tag.trim().toLowerCase();
                        if (cleanTag === "yet to happen") return true;
                        if (cleanTag === "completed") return false;
                      }
                      if (!event.date) return true;
                      const parsedDate = robustParseDate(event.date);
                      if (!parsedDate) return true;
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return parsedDate.getTime() >= today.getTime();
                    })();
                    
                    return (
                      <motion.div key={event._id || event.slug || index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }} className="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center">
                        <div className="flex items-center gap-5">
                          <div className={`w-3 h-12 rounded-full ${event.tagColor ? event.tagColor : 'bg-[#4285f4]'}`} />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1 font-medium">
                              <span>{event.date}</span> • 
                              <span className="uppercase tracking-wider text-[10px] bg-gray-100 px-2 py-0.5 rounded-md">{event.tag || 'EVENT'}</span> • 
                              {isUpcoming ? (
                                <span className="uppercase tracking-wider text-[9px] font-bold bg-green-50 text-green-700 border border-green-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Yet to Happen
                                </span>
                              ) : (
                                <span className="uppercase tracking-wider text-[9px] font-bold bg-red-50 text-red-600 border border-red-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(event)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#4285f4] hover:bg-blue-50 transition-colors">
                            <Plus className="rotate-45" size={18} />
                          </button>
                          <button onClick={() => deleteEvent(event.slug)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#db4437] hover:bg-[#fce8e6] transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {activeTab === "team" && team.map((member, index) => (
                    <motion.div key={member._id || member.id || index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ delay: index * 0.05 }} className="group bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img src={member.img} alt={member.name} className="w-14 h-14 rounded-full object-cover border border-gray-100" />
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{member.name}</h3>
                          <p className="text-sm text-[#0f9d58] font-medium mb-1.5">{member.role} <span className="text-gray-400 ml-2">Class of {member.year}</span></p>
                          <div className="flex flex-wrap gap-1.5">
                            {member.github && <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold tracking-wide">GitHub</span>}
                            {member.linkedin && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-semibold tracking-wide">LinkedIn</span>}
                            {member.globe && <span className="text-[9px] bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded font-semibold tracking-wide">Website</span>}
                            {!member.github && !member.linkedin && !member.globe && <span className="text-[9px] bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded font-semibold tracking-wide">No Socials (Using Fallback)</span>}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteMember(member._id || member.id)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#db4437] hover:bg-[#fce8e6] transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-5 xl:col-span-4 sticky top-28">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-normal text-gray-800 mb-6 flex items-center gap-2">
                <LayoutDashboard size={20} className="text-[#f4b400]" /> {isEditing ? "Edit Event" : `Create ${activeTab === "events" ? "Event" : "Profile"}`}
              </h2>

              <AnimatePresence mode="wait">
                {activeTab === "events" ? (
                  <motion.form key="events-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmitEvent} className="space-y-5">
                    <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] transition-colors px-4 pt-6 pb-2">
                      <input type="text" required value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newEvent.title ? 'text-xs top-2 text-[#4285f4]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Event Title</label>
                    </div>

                    <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] transition-colors px-4 pt-6 pb-2">
                      <input type="text" required value={newEvent.slug} onChange={(e) => setNewEvent({ ...newEvent, slug: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newEvent.slug ? 'text-xs top-2 text-[#4285f4]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Slug (e.g. cloud-jam-26)</label>
                    </div>

                    <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] transition-colors px-4 pt-6 pb-2">
                      <input type="text" required value={newEvent.date} onChange={(e) => handleDateChange(e.target.value)} className="w-full bg-transparent outline-none peer text-gray-900" />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newEvent.date ? 'text-xs top-2 text-[#4285f4]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Date (e.g. March 10, 2026)</label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] transition-colors px-4 pt-6 pb-2">
                        <input type="text" required value={newEvent.tag} onChange={(e) => setNewEvent({ ...newEvent, tag: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                        <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newEvent.tag ? 'text-xs top-2 text-[#4285f4]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Tag</label>
                      </div>
                      <div className="bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] px-4 py-2 flex flex-col justify-end">
                        <span className="text-xs text-gray-500 font-medium mb-1">Color</span>
                        <select value={newEvent.tagColor} onChange={(e) => setNewEvent({ ...newEvent, tagColor: e.target.value })} className="w-full bg-transparent outline-none font-medium text-gray-900">
                          <option value="bg-[#4285f4]">Google Blue</option>
                          <option value="bg-[#0f9d58]">Google Green</option>
                          <option value="bg-[#f4b400]">Google Yellow</option>
                          <option value="bg-[#db4437]">Google Red</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] transition-colors px-4 pt-6 pb-2">
                        <input type="text" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                        <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newEvent.time ? 'text-xs top-2 text-[#4285f4]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Time (e.g. 10 AM - 2 PM)</label>
                      </div>
                      <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] transition-colors px-4 pt-6 pb-2">
                        <input type="text" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                        <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newEvent.location ? 'text-xs top-2 text-[#4285f4]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Location</label>
                      </div>
                    </div>

                    <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] transition-colors px-4 pt-6 pb-2">
                      <input type="text" value={newEvent.image} onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newEvent.image ? 'text-xs top-2 text-[#4285f4]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Hero Image URL</label>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs text-gray-500 font-bold uppercase tracking-widest px-1">Gallery Images</label>
                      {newEvent.gallery.map((url, index) => (
                        <div key={index} className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] transition-colors px-4 pt-6 pb-2 flex gap-2">
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => {
                              const newGallery = [...newEvent.gallery];
                              newGallery[index] = e.target.value;
                              if (index === newGallery.length - 1 && e.target.value.trim() !== "") {
                                newGallery.push("");
                              }
                              setNewEvent({ ...newEvent, gallery: newGallery });
                            }}
                            className="w-full bg-transparent outline-none peer text-gray-900"
                          />
                          <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${url ? 'text-xs top-2 text-[#4285f4]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Image URL {index + 1}</label>

                          {newEvent.gallery.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newGallery = newEvent.gallery.filter((_, i) => i !== index);
                                if (newGallery.length === 0) newGallery.push("");
                                setNewEvent({ ...newEvent, gallery: newGallery });
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] transition-colors px-4 pt-6 pb-2">
                      <textarea required value={newEvent.desc} onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900 resize-none h-20" />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newEvent.desc ? 'text-xs top-2 text-[#4285f4]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Short Description</label>
                    </div>

                    <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] transition-colors px-4 pt-6 pb-2">
                      <textarea value={newEvent.longDescription} onChange={(e) => setNewEvent({ ...newEvent, longDescription: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900 resize-none h-32" />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newEvent.longDescription ? 'text-xs top-2 text-[#4285f4]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Full Event Content</label>
                    </div>

                    <div className="flex gap-3 mt-4">
                      {isEditing && (
                        <button type="button" onClick={cancelEdit} className="flex-grow bg-gray-100 text-gray-600 py-3.5 rounded-full font-medium hover:bg-gray-200 transition-all">
                          Cancel
                        </button>
                      )}
                      <button type="submit" className={`${isEditing ? 'flex-[2]' : 'w-full'} bg-[#4285f4] text-white py-3.5 rounded-full font-medium hover:bg-[#3367d6] hover:shadow-md active:scale-[0.98] transition-all flex justify-center items-center gap-2`}>
                        {isEditing ? <CheckCircle2 size={18} /> : <Plus size={18} />} {isEditing ? "Update Event" : "Publish Event"}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form key="team-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={addMember} className="space-y-5">

                    <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] transition-colors px-4 pt-6 pb-2">
                      <input type="text" required value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newMember.name ? 'text-xs top-2 text-[#0f9d58]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#0f9d58]'}`}>Full Name</label>
                    </div>

                    <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] transition-colors px-4 pt-6 pb-2">
                      <input type="text" required value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newMember.role ? 'text-xs top-2 text-[#0f9d58]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#0f9d58]'}`}>Chapter Role</label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] transition-colors px-4 pt-6 pb-2">
                        <input type="number" required value={newMember.year} onChange={(e) => setNewMember({ ...newMember, year: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                        <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newMember.year ? 'text-xs top-2 text-[#0f9d58]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#0f9d58]'}`}>Class Year</label>
                      </div>
                      <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] transition-colors px-4 pt-6 pb-2">
                        <input type="text" required value={newMember.img} onChange={(e) => setNewMember({ ...newMember, img: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                        <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newMember.img ? 'text-xs top-2 text-[#0f9d58]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#0f9d58]'}`}>Avatar Path</label>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] transition-colors px-3 pt-6 pb-2">
                        <input type="text" value={newMember.github || ""} onChange={(e) => setNewMember({ ...newMember, github: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900 text-xs" />
                        <label className={`absolute left-3 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newMember.github ? 'text-[10px] top-1.5 text-[#0f9d58]' : 'text-xs top-4 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-[#0f9d58]'}`}>GitHub Link</label>
                      </div>
                      <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] transition-colors px-3 pt-6 pb-2">
                        <input type="text" value={newMember.linkedin || ""} onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900 text-xs" />
                        <label className={`absolute left-3 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newMember.linkedin ? 'text-[10px] top-1.5 text-[#0f9d58]' : 'text-xs top-4 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-[#0f9d58]'}`}>LinkedIn Link</label>
                      </div>
                      <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] transition-colors px-3 pt-6 pb-2">
                        <input type="text" value={newMember.globe || ""} onChange={(e) => setNewMember({ ...newMember, globe: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900 text-xs" />
                        <label className={`absolute left-3 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newMember.globe ? 'text-[10px] top-1.5 text-[#0f9d58]' : 'text-xs top-4 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-[#0f9d58]'}`}>Portfolio Link</label>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-[#0f9d58] text-white py-3.5 rounded-full font-medium hover:bg-[#0b703e] hover:shadow-md active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-4">
                      <Plus size={18} /> Register Member
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}