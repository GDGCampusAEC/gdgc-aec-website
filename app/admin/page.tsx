"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, LogOut, LayoutDashboard, Users, CalendarDays, Server, CheckCircle2, Loader2, Pencil, Camera, Upload } from "lucide-react";
import { robustParseDate } from "@/lib/dateUtils";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "team" | "gallery">("events");

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
    img: "/assets/default-avatar.svg",
    github: "",
    linkedin: "",
    globe: "",
    showOnTrain: false
  });
  const [gallery, setGallery] = useState<any[]>([]);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    src: "",
    eventSlug: "",
    size: "col-span-1"
  });
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

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
      const [eventsRes, teamRes, galleryRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/team"),
        fetch("/api/gallery")
      ]);
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (teamRes.ok) setTeam(await teamRes.json());
      if (galleryRes.ok) setGallery(await galleryRes.json());
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

  // ImageKit Client-side Upload Handler targeting explicit nested folders
  const uploadToImageKit = async (file: File): Promise<string> => {
    const authRes = await fetch("/api/imagekit-auth");
    if (!authRes.ok) throw new Error("Failed to secure ImageKit upload parameters.");
    const authData = await authRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "");
    formData.append("signature", authData.signature);
    formData.append("expire", authData.expire);
    formData.append("token", authData.token);
    formData.append("useUniqueFileName", "true");

    // Explicitly targeting the gdgc-aec folder structures you created
    const destinationFolder = activeTab === "events"
      ? "gdgc-aec/events"
      : activeTab === "team"
        ? "gdgc-aec/team"
        : "gdgc-aec/gallery";

    formData.append("folder", destinationFolder);

    const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      const errData = await uploadRes.json();
      throw new Error(errData.message || "Failed to push object into ImageKit storage vault.");
    }

    const result = await uploadRes.json();
    return result.url;
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

  const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const url = editingMemberId ? `/api/team/member/${editingMemberId}` : "/api/team";
      const method = editingMemberId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ ...newMember, year: parseInt(newMember.year) }),
      });
      if (!res.ok) throw new Error(`Failed to ${editingMemberId ? 'update' : 'add'} member`);
      const savedMember = await res.json();

      if (editingMemberId) {
        let updatedTeam = team.map((m) => ((m._id || m.id) === editingMemberId ? savedMember : m));
        if (savedMember.showOnTrain) {
          updatedTeam = updatedTeam.map((m) => {
            if ((m._id || m.id) !== editingMemberId && parseInt(m.year) === parseInt(savedMember.year)) {
              return { ...m, showOnTrain: false };
            }
            return m;
          });
        }
        setTeam(updatedTeam);
        showSuccess("Member profile updated.");
      } else {
        let updatedTeam = [savedMember, ...team];
        if (savedMember.showOnTrain) {
          updatedTeam = updatedTeam.map((m) => {
            if ((m._id || m.id) !== savedMember.id && (m._id || m.id) !== savedMember._id && parseInt(m.year) === parseInt(savedMember.year)) {
              return { ...m, showOnTrain: false };
            }
            return m;
          });
        }
        setTeam(updatedTeam);
        showSuccess("Team member boarded.");
      }

      cancelEditMember();
    } catch (err: any) { setError(err.message); }
  };

  const startEditMember = (member: any) => {
    setNewMember({
      name: member.name || "",
      role: member.role || "",
      year: member.year ? String(member.year) : "2026",
      img: member.img || "/assets/team-1.jpg",
      github: member.github || "",
      linkedin: member.linkedin || "",
      globe: member.globe || "",
      showOnTrain: member.showOnTrain === true
    });
    setIsEditing(true);
    setEditingMemberId(member._id || member.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditMember = () => {
    setNewMember({
      name: "",
      role: "",
      year: "2026",
      img: "/assets/default-avatar.svg",
      github: "",
      linkedin: "",
      globe: "",
      showOnTrain: false
    });
    setIsEditing(false);
    setEditingMemberId(null);
  };

  const handleSubmitGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const url = editingGalleryId ? `/api/gallery/${editingGalleryId}` : "/api/gallery";
      const method = editingGalleryId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(newGalleryItem),
      });
      if (!res.ok) throw new Error(`Failed to ${editingGalleryId ? 'update' : 'add'} gallery photo`);
      const savedItem = await res.json();

      if (editingGalleryId) {
        setGallery(gallery.map((g) => (g.id === editingGalleryId ? savedItem : g)));
        showSuccess("Gallery photo updated.");
      } else {
        setGallery([savedItem, ...gallery]);
        showSuccess("Gallery photo uploaded.");
      }

      cancelEditGallery();
    } catch (err: any) { setError(err.message); }
  };

  const startEditGallery = (item: any) => {
    setNewGalleryItem({
      title: item.title || "",
      src: item.src || "",
      eventSlug: item.eventSlug || "",
      size: item.size || "col-span-1"
    });
    setIsEditing(true);
    setEditingGalleryId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditGallery = () => {
    setNewGalleryItem({
      title: "",
      src: "",
      eventSlug: "",
      size: "col-span-1"
    });
    setIsEditing(false);
    setEditingGalleryId(null);
  };

  const deleteGallery = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      if (!res.ok) throw new Error("Failed to delete gallery photo");
      setGallery(gallery.filter((g) => g.id !== id));
      showSuccess("Gallery photo removed.");
    } catch (err: any) { setError(err.message); }
  };

  useEffect(() => {
    cancelEdit();
    cancelEditMember();
    cancelEditGallery();
  }, [activeTab]);

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
              <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 ${secret ? 'text-xs top-2 text-[#4285f4]' : 'text-base top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#4285f4]'}`}>Enter Password</label>
            </div>
            <div className="flex justify-center mt-8">
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
            {(["events", "team", "gallery"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab ? "bg-[#d3e3fd] text-blue-900 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  }`}
              >
                {tab === "events" ? <CalendarDays size={16} /> : tab === "team" ? <Users size={16} /> : <Camera size={16} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <h2 className="text-xl font-normal text-gray-800 mb-6 flex items-center gap-2">
              <Server size={20} className="text-[#4285f4]" /> Active {activeTab === "events" ? "Schedules" : activeTab === "team" ? "Roster" : "Vault Images"}
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
                        <img src={member.img && member.img.trim() !== "" && !member.img.startsWith("/assets/team-") ? member.img : "/assets/default-avatar.svg"} alt={member.name} className="w-14 h-14 rounded-full object-cover border border-gray-100" />
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{member.name}</h3>
                          <p className="text-sm text-[#0f9d58] font-medium mb-1.5">{member.role} <span className="text-gray-400 ml-2">Class of {member.year}</span></p>
                          <div className="flex flex-wrap gap-1.5">
                            {member.showOnTrain && <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-1.5 py-0.5 rounded font-bold tracking-wide flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Featured Cover</span>}
                            {member.github && <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold tracking-wide">GitHub</span>}
                            {member.linkedin && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-semibold tracking-wide">LinkedIn</span>}
                            {member.globe && <span className="text-[9px] bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded font-semibold tracking-wide">Website</span>}
                            {!member.github && !member.linkedin && !member.globe && <span className="text-[9px] bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded font-semibold tracking-wide">No Socials (Using Fallback)</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEditMember(member)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0f9d58] hover:bg-green-50 transition-colors" title="Edit Member">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => deleteMember(member._id || member.id)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#db4437] hover:bg-[#fce8e6] transition-colors" title="Delete Member">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {activeTab === "gallery" && gallery.map((item, index) => {
                    const linkedEvent = events.find(e => e.slug === item.eventSlug);
                    return (
                      <motion.div key={item.id || index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ delay: index * 0.05 }} className="group bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <img src={item.src} alt={item.title} className="w-14 h-14 rounded-2xl object-cover border border-gray-100" />
                          <div>
                            <h3 className="text-base font-medium text-gray-900">{item.title}</h3>
                            <p className="text-xs text-[#0f9d58] font-semibold uppercase tracking-wider mb-1">
                              Size: <span className="text-gray-500 font-medium normal-case">
                                {item.size === "col-span-1" ? "Standard (1x1)" :
                                  item.size === "md:col-span-2" ? "Wide (2x1)" :
                                    item.size === "md:col-span-2 md:row-span-2" ? "Large Feature (2x2)" :
                                      item.size === "col-span-1 md:row-span-2" ? "Tall (1x2)" :
                                        item.size === "md:col-span-3" ? "Landscape Medium (3x1)" :
                                          item.size === "md:col-span-3 md:row-span-2" ? "Landscape 16:9 (3x2)" :
                                            item.size === "md:col-span-4" ? "Panoramic Wide (4x1)" :
                                              item.size === "md:col-span-4 md:row-span-2" ? "Panoramic Feature (4x2)" : "Custom Size"}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              Linked Event: {linkedEvent ? (
                                <span className="text-blue-600 font-semibold">{linkedEvent.title} ({linkedEvent.date})</span>
                              ) : (
                                <span className="text-gray-400 font-normal italic">None (Stand-alone Photo)</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEditGallery(item)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0f9d58] hover:bg-green-50 transition-colors" title="Edit Photo">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => deleteGallery(item.id)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-[#db4437] hover:bg-[#fce8e6] transition-colors" title="Delete Photo">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-5 xl:col-span-4 sticky top-28">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-normal text-gray-800 mb-6 flex items-center gap-2">
                <LayoutDashboard size={20} className="text-[#f4b400]" /> {isEditing ? (activeTab === "events" ? "Edit Event" : activeTab === "team" ? "Edit Profile" : "Edit Photo") : `Create ${activeTab === "events" ? "Event" : activeTab === "team" ? "Profile" : "Vault Item"}`}
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

                    {/* Integrated ImageKit File Picker for Hero Image */}
                    <div className="bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] px-4 py-3 flex flex-col justify-center">
                      <span className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Upload size={12} /> Hero Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={loading}
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              setLoading(true);
                              setError(null);
                              const url = await uploadToImageKit(e.target.files[0]);
                              setNewEvent({ ...newEvent, image: url });
                              showSuccess("Hero banner pushed to imagekit repository.");
                            } catch (err: any) {
                              setError(err.message);
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 cursor-pointer"
                      />
                      {newEvent.image && <p className="text-[10px] text-green-600 font-medium mt-1 truncate">CDN URL: {newEvent.image}</p>}
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs text-gray-500 font-bold uppercase tracking-widest px-1">Gallery Images (Optional URL fallbacks)</label>
                      {newEvent.gallery.map((url, index) => (
                        <div key={index} className="bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#4285f4] px-4 py-3 flex flex-col justify-center gap-1.5 relative transition-colors">
                          <div className="flex justify-between items-center w-full">
                            <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                              <Upload size={12} /> Gallery Image {index + 1}
                            </span>
                            {newEvent.gallery.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newGallery = newEvent.gallery.filter((_, i) => i !== index);
                                  if (newGallery.length === 0) newGallery.push("");
                                  setNewEvent({ ...newEvent, gallery: newGallery });
                                }}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-all duration-200"
                                title="Remove Image"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            disabled={loading}
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                try {
                                  setLoading(true);
                                  setError(null);
                                  const uploadedUrl = await uploadToImageKit(e.target.files[0]);
                                  
                                  const newGallery = [...newEvent.gallery];
                                  newGallery[index] = uploadedUrl;
                                  if (index === newGallery.length - 1) {
                                    newGallery.push("");
                                  }
                                  setNewEvent({ ...newEvent, gallery: newGallery });
                                  showSuccess(`Gallery image ${index + 1} hosted successfully.`);
                                } catch (err: any) {
                                  setError(err.message);
                                } finally {
                                  setLoading(false);
                                }
                              }
                            }}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 cursor-pointer"
                          />

                          <div className="relative w-full mt-1">
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
                              placeholder="Or paste an image URL here..."
                              className="w-full bg-transparent outline-none text-xs text-gray-700 border-b border-gray-200 pb-1 focus:border-[#4285f4] transition-colors"
                            />
                          </div>

                          {url && <p className="text-[10px] text-green-600 font-medium mt-0.5 truncate">CDN URL: {url}</p>}
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
                      <button type="submit" disabled={loading} className={`${isEditing ? 'flex-[2]' : 'w-full'} bg-[#4285f4] text-white py-3.5 rounded-full font-medium hover:bg-[#3367d6] hover:shadow-md active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50`}>
                        {isEditing ? <CheckCircle2 size={18} /> : <Plus size={18} />} {isEditing ? "Update Event" : "Publish Event"}
                      </button>
                    </div>
                  </motion.form>
                ) : activeTab === "team" ? (
                  <motion.form key="team-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmitMember} className="space-y-5">

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

                      {/* Integrated ImageKit File Picker for Team Avatars */}
                      <div className="bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] px-4 py-2 flex flex-col justify-center">
                        <span className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Upload size={12} /> Avatar Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={loading}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              try {
                                setLoading(true);
                                setError(null);
                                const url = await uploadToImageKit(e.target.files[0]);
                                setNewMember({ ...newMember, img: url });
                                showSuccess("Member avatar hosted successfully.");
                              } catch (err: any) {
                                setError(err.message);
                              } finally {
                                setLoading(false);
                              }
                            }
                          }}
                          className="w-full text-xs text-gray-500 file:mr-2 file:py-0.5 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50 cursor-pointer"
                        />
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

                    {/* Premium Animated Toggle Switch for showOnTrain */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200/80 transition-all">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-gray-800">Featured on Train Cover</span>
                        <span className="text-[11px] text-gray-500 font-medium">Display this member's card on the collapsed train car cover.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewMember(prev => ({ ...prev, showOnTrain: !prev.showOnTrain }))}
                        className={`relative w-12 h-7 rounded-full transition-colors duration-300 flex items-center px-1 shrink-0 ${newMember.showOnTrain ? 'bg-[#0f9d58]' : 'bg-gray-300'}`}
                      >
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{ x: newMember.showOnTrain ? 20 : 0 }}
                        />
                      </button>
                    </div>

                    <div className="flex gap-3 mt-4">
                      {editingMemberId && (
                        <button type="button" onClick={cancelEditMember} className="flex-grow bg-gray-100 text-gray-600 py-3.5 rounded-full font-medium hover:bg-gray-200 transition-all">
                          Cancel
                        </button>
                      )}
                      <button type="submit" disabled={loading} className={`${editingMemberId ? 'flex-[2]' : 'w-full'} bg-[#0f9d58] text-white py-3.5 rounded-full font-medium hover:bg-[#0b703e] hover:shadow-md active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50`}>
                        {editingMemberId ? <CheckCircle2 size={18} /> : <Plus size={18} />} {editingMemberId ? "Update Member" : "Register Member"}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form key="gallery-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmitGallery} className="space-y-5">
                    <div className="relative bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] transition-colors px-4 pt-6 pb-2">
                      <input type="text" required value={newGalleryItem.title} onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })} className="w-full bg-transparent outline-none peer text-gray-900" />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 font-medium ${newGalleryItem.title ? 'text-xs top-2 text-[#0f9d58]' : 'text-sm top-4 peer-focus:text-xs peer-focus:top-2 peer-focus:text-[#0f9d58]'}`}>Photo Title</label>
                    </div>

                    {/* Integrated ImageKit File Picker for Media Library/Gallery */}
                    <div className="bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] px-4 py-3 flex flex-col justify-center">
                      <span className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Upload size={12} /> Select Vault Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={loading}
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              setLoading(true);
                              setError(null);
                              const url = await uploadToImageKit(e.target.files[0]);
                              setNewGalleryItem({ ...newGalleryItem, src: url });
                              showSuccess("Image locked into cloud media library.");
                            } catch (err: any) {
                              setError(err.message);
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50 cursor-pointer"
                      />
                      {newGalleryItem.src && <p className="text-[10px] text-green-600 font-medium mt-1 truncate">CDN URL: {newGalleryItem.src}</p>}
                    </div>

                    <div className="bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] px-4 py-2 flex flex-col justify-end">
                      <span className="text-xs text-gray-500 font-medium mb-1">Link to Event</span>
                      <select value={newGalleryItem.eventSlug} onChange={(e) => setNewGalleryItem({ ...newGalleryItem, eventSlug: e.target.value })} className="w-full bg-transparent outline-none font-medium text-gray-900">
                        <option value="">-- No Linked Event (Stand-alone) --</option>
                        {events.map((ev) => (
                          <option key={ev.id || ev.slug} value={ev.slug}>{ev.title} ({ev.date})</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-gray-50 rounded-t-xl border-b-2 border-gray-300 focus-within:border-[#0f9d58] px-4 py-2 flex flex-col justify-end">
                      <span className="text-xs text-gray-500 font-medium mb-1">Display Size (Grid Span)</span>
                      <select value={newGalleryItem.size} onChange={(e) => setNewGalleryItem({ ...newGalleryItem, size: e.target.value })} className="w-full bg-transparent outline-none font-medium text-gray-900">
                        <option value="col-span-1">Standard (1x1)</option>
                        <option value="md:col-span-2">Wide (2x1)</option>
                        <option value="md:col-span-2 md:row-span-2">Large Feature (2x2)</option>
                        <option value="col-span-1 md:row-span-2">Tall (1x2)</option>
                        <option value="md:col-span-3">Landscape Medium (3x1)</option>
                        <option value="md:col-span-3 md:row-span-2">Landscape 16:9 (3x2)</option>
                        <option value="md:col-span-4">Panoramic Wide (4x1)</option>
                        <option value="md:col-span-4 md:row-span-2">Panoramic Feature (4x2)</option>
                      </select>
                    </div>

                    <div className="flex gap-3 mt-4">
                      {editingGalleryId && (
                        <button type="button" onClick={cancelEditGallery} className="flex-grow bg-gray-100 text-gray-600 py-3.5 rounded-full font-medium hover:bg-gray-200 transition-all">
                          Cancel
                        </button>
                      )}
                      <button type="submit" disabled={loading} className={`${editingGalleryId ? 'flex-[2]' : 'w-full'} bg-[#0f9d58] text-white py-3.5 rounded-full font-medium hover:bg-[#0b703e] hover:shadow-md active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-50`}>
                        {editingGalleryId ? <CheckCircle2 size={18} /> : <Plus size={18} />} {editingGalleryId ? "Update Photo" : "Upload Photo"}
                      </button>
                    </div>
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