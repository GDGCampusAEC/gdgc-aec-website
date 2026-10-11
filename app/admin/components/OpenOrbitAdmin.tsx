"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  RefreshCw,
  Sliders,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Pencil,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Calendar,
  Globe,
  Loader2,
} from "lucide-react";
import { CompetitionConfig, ManualLeaderboardEntry, SyncResult } from "@/lib/openOrbit/types";

interface OpenOrbitAdminProps {
  secret: string;
  showSuccess: (msg: string) => void;
  setError: (msg: string | null) => void;
}

export default function OpenOrbitAdmin({
  secret,
  showSuccess,
  setError,
}: OpenOrbitAdminProps) {
  const [config, setConfig] = useState<CompetitionConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);

  // Sync state
  const [syncing, setSyncing] = useState<"latest" | "everything" | null>(null);
  const [syncSummary, setSyncSummary] = useState<SyncResult | null>(null);

  // Manual leaderboard state
  const [manualEntries, setManualEntries] = useState<ManualLeaderboardEntry[]>([]);
  const [loadingManual, setLoadingManual] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ManualLeaderboardEntry | null>(null);
  const [manualForm, setManualForm] = useState<{
    rank: number;
    githubUsername: string;
    githubUrl: string;
    totalPoints: number | string;
  }>({
    rank: 1,
    githubUsername: "",
    githubUrl: "",
    totalPoints: "",
  });

  // Helpers for datetime-local input to avoid browser local timezone shifts
  const formatIsoForDatetimeInput = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  const parseDatetimeInputToIso = (inputValue: string) => {
    if (!inputValue) return "";
    return inputValue.includes("Z") ? inputValue : `${inputValue}:00.000Z`;
  };

  const headers = {
    "Content-Type": "application/json",
    "x-admin-secret": secret,
  };

  // Load config & manual entries
  const fetchConfig = async () => {
    try {
      setLoadingConfig(true);
      const res = await fetch("/api/open-orbit/config", { headers });
      if (!res.ok) throw new Error("Failed to fetch Open Orbit configuration");
      const data = await res.json();
      setConfig(data);
    } catch (err: any) {
      setError(err.message || "Failed to load competition config");
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchManualEntries = async () => {
    try {
      setLoadingManual(true);
      const res = await fetch("/api/open-orbit/manual", { headers });
      if (res.ok) {
        const data = await res.json();
        setManualEntries(data);
      }
    } catch {
      // Optional load
    } finally {
      setLoadingManual(false);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchManualEntries();
  }, []);

  // Save config updates
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    try {
      setSavingConfig(true);
      const res = await fetch("/api/open-orbit/config", {
        method: "PUT",
        headers,
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update configuration");

      setConfig(data.config);
      showSuccess("Competition settings updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to save configuration");
    } finally {
      setSavingConfig(false);
    }
  };

  // Toggle Visibility
  const toggleVisibility = async () => {
    if (!config) return;
    const nextVal = !config.leaderboardEnabled;
    try {
      const res = await fetch("/api/open-orbit/config", {
        method: "PUT",
        headers,
        body: JSON.stringify({ leaderboardEnabled: nextVal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update visibility");
      setConfig(data.config);
      showSuccess(nextVal ? "Public Leaderboard is now VISIBLE." : "Public Leaderboard is now HIDDEN.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Toggle Mode
  const toggleMode = async (mode: "automatic" | "manual") => {
    if (!config || config.leaderboardMode === mode) return;
    try {
      const res = await fetch("/api/open-orbit/config", {
        method: "PUT",
        headers,
        body: JSON.stringify({ leaderboardMode: mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update mode");
      setConfig(data.config);
      showSuccess(`Switched to ${mode.toUpperCase()} leaderboard mode.`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Run Sync
  const handleSync = async (mode: "latest" | "everything") => {
    try {
      setSyncing(mode);
      setSyncSummary(null);
      const res = await fetch("/api/open-orbit/sync", {
        method: "POST",
        headers,
        body: JSON.stringify({ mode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync request failed");

      setSyncSummary(data);
      showSuccess(`Sync ${mode === "latest" ? "Latest" : "Everything"} completed!`);
      fetchConfig();
    } catch (err: any) {
      setError(err.message || "Sync failed");
    } finally {
      setSyncing(null);
    }
  };

  // Manual Leaderboard Actions
  const handleSaveManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingEntry);
      const url = "/api/open-orbit/manual";
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit
        ? { id: editingEntry!.id, ...manualForm, totalPoints: Number(manualForm.totalPoints) || 0 }
        : { ...manualForm, totalPoints: Number(manualForm.totalPoints) || 0 };

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save entry");

      showSuccess(isEdit ? "Participant updated." : "Participant added to manual leaderboard.");
      setShowManualModal(false);
      setEditingEntry(null);
      const nextRank = manualEntries.length > 0
        ? Math.max(...manualEntries.map((e) => Number(e.rank) || 0)) + 1
        : 1;
      setManualForm({ rank: nextRank, githubUsername: "", githubUrl: "", totalPoints: "" });
      fetchManualEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteManualEntry = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove '${name}' from the manual leaderboard?`)) return;
    try {
      const res = await fetch(`/api/open-orbit/manual?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete entry");
      showSuccess("Participant removed.");
      fetchManualEntries();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loadingConfig || !config) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#4285f4] mb-3" />
        <p className="text-sm font-medium text-gray-500">Loading Open Orbit competition parameters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header Banner ── */}
      <div className="rounded-[2rem] bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">
            <Trophy className="w-4 h-4 text-yellow-400" /> Open Source Competition Engine
          </div>
          <h2 className="text-3xl font-black tracking-tight">{config.name}</h2>
          <p className="text-sm text-gray-300 mt-1 max-w-xl">
            Configure scoring rules, synchronize PRs from GitHub, manage manual standings, and toggle public visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Direct Link to Public Leaderboard */}
          <Link
            href="/leaderboard"
            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border border-white/20 shadow-sm"
          >
            <ExternalLink size={15} />
            <span>View Public Page</span>
          </Link>

          {/* Public Visibility Toggle */}
          <button
            type="button"
            onClick={toggleVisibility}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              config.leaderboardEnabled
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {config.leaderboardEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
            {config.leaderboardEnabled ? "Leaderboard: Public" : "Leaderboard: Hidden"}
          </button>

          {/* Mode Switcher */}
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-full flex items-center border border-white/20">
            <button
              type="button"
              onClick={() => toggleMode("automatic")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                config.leaderboardMode === "automatic"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Automatic Mode
            </button>
            <button
              type="button"
              onClick={() => toggleMode("manual")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                config.leaderboardMode === "manual"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Manual Mode
            </button>
          </div>
        </div>
      </div>

      {/* ── Sync Control Deck ── */}
      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#4285f4]" /> GitHub Synchronization
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Target repository:{" "}
              <a
                href={config.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#4285f4] hover:underline inline-flex items-center gap-1"
              >
                {config.repositoryUrl} <ExternalLink size={12} />
              </a>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={syncing !== null}
              onClick={() => handleSync("latest")}
              className="px-5 py-2.5 rounded-full bg-[#4285f4] hover:bg-[#3367d6] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all disabled:opacity-60 active:scale-95"
            >
              {syncing === "latest" ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Sync Latest
            </button>

            <button
              type="button"
              disabled={syncing !== null}
              onClick={() => handleSync("everything")}
              className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all disabled:opacity-60 active:scale-95"
            >
              {syncing === "everything" ? <Loader2 size={16} className="animate-spin" /> : <Layers size={16} />}
              Sync Everything
            </button>
          </div>
        </div>

        {/* Sync Status Feedback */}
        <div className="pt-4 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-3">
            <span>Status:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                config.lastSyncStatus === "success"
                  ? "bg-emerald-100 text-emerald-800"
                  : config.lastSyncStatus === "failed"
                  ? "bg-red-100 text-red-800"
                  : config.lastSyncStatus === "in_progress"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {config.lastSyncStatus}
            </span>
            {config.lastSuccessfulSyncAt && (
              <span>Last Sync: {new Date(config.lastSuccessfulSyncAt).toLocaleString()}</span>
            )}
          </div>

          {config.lastSyncError && (
            <p className="text-red-600 font-medium flex items-center gap-1">
              <AlertCircle size={14} /> {config.lastSyncError}
            </p>
          )}
        </div>

        {/* Sync Summary Result Box */}
        <AnimatePresence>
          {syncSummary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 size={16} className="text-blue-600" />
                {syncSummary.mode === "everything" ? "Sync Everything Completed" : "Sync Latest Completed"}
              </div>
              <div className="flex flex-wrap gap-4 font-medium">
                <span>PRs Scanned: <strong>{syncSummary.prsScanned}</strong></span>
                <span>New Counted: <strong className="text-emerald-700">+{syncSummary.newCounted}</strong></span>
                <span>Reconciled: <strong>{syncSummary.reconciled}</strong></span>
                <span>Skipped: <strong>{syncSummary.skipped}</strong></span>
                <span>Ineligible: <strong>{syncSummary.ineligible}</strong></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Workspace Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveConfig} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#f4b400]" /> Competition Settings
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Competition Name
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#4285f4] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={config.repositoryUrl}
                onChange={(e) => setConfig({ ...config, repositoryUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#4285f4] outline-none font-mono"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Format: <code>https://github.com/OWNER/REPO</code> (Editable anytime by admin)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Start Date & Time (UTC)
                </label>
                <input
                  type="datetime-local"
                  value={formatIsoForDatetimeInput(config.startAt)}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      startAt: parseDatetimeInputToIso(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#4285f4] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  End Date & Time (UTC)
                </label>
                <input
                  type="datetime-local"
                  value={formatIsoForDatetimeInput(config.endAt)}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      endAt: parseDatetimeInputToIso(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#4285f4] outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Competition Status
              </label>
              <select
                value={config.status}
                onChange={(e) => setConfig({ ...config, status: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#4285f4] outline-none bg-white"
              >
                <option value="active">Active (Scoring & Sync allowed)</option>
                <option value="paused">Paused (No new points awarded)</option>
                <option value="completed">Completed (Competition concluded)</option>
              </select>
            </div>

            {/* Dynamic Scoring Rules */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Point Weights by Difficulty Label
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#e6f4ea] p-3 rounded-xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
                    difficulty:level_1
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={config.scoringRules.easy}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        scoringRules: { ...config.scoringRules, easy: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-emerald-300 text-sm font-bold text-emerald-900 outline-none"
                  />
                </div>

                <div className="bg-[#e8f0fe] p-3 rounded-xl border border-blue-200">
                  <span className="text-xs font-bold text-blue-800 uppercase block mb-1">
                    difficulty:level_2
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={config.scoringRules.medium}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        scoringRules: { ...config.scoringRules, medium: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-blue-300 text-sm font-bold text-blue-900 outline-none"
                  />
                </div>

                <div className="bg-[#fce8e6] p-3 rounded-xl border border-red-200">
                  <span className="text-xs font-bold text-red-800 uppercase block mb-1">
                    difficulty:level_3
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={config.scoringRules.hard}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        scoringRules: { ...config.scoringRules, hard: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-white px-3 py-1.5 rounded-lg border border-red-300 text-sm font-bold text-red-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={savingConfig}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all disabled:opacity-60 active:scale-95"
              >
                {savingConfig ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Competition Settings
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Manual Leaderboard Management */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> Manual Leaderboard
                </h3>
                <p className="text-xs text-gray-500">
                  {config.leaderboardMode === "manual" ? "Currently active for visitors" : "Inactive (Automatic active)"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingEntry(null);
                  const nextRank = manualEntries.length > 0
                    ? Math.max(...manualEntries.map((e) => Number(e.rank) || 0)) + 1
                    : 1;
                  setManualForm({
                    rank: nextRank,
                    githubUsername: "",
                    githubUrl: "",
                    totalPoints: "",
                  });
                  setShowManualModal(true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-blue-50 text-[#4285f4] hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> Add Entry
              </button>
            </div>

            {loadingManual ? (
              <div className="py-8 text-center text-xs text-gray-400">Loading manual entries...</div>
            ) : manualEntries.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                No manual entries added yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {manualEntries.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-[#fdfbf7] hover:bg-white transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                        #{item.rank}
                      </span>
                      <div>
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-gray-900 hover:text-[#4285f4] flex items-center gap-1"
                        >
                          @{item.githubUsername} <ExternalLink size={10} />
                        </a>
                        <span className="text-[11px] font-medium text-emerald-700">
                          {item.totalPoints} points
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEntry(item);
                          setManualForm({
                            rank: item.rank,
                            githubUsername: item.githubUsername,
                            githubUrl: item.githubUrl,
                            totalPoints: item.totalPoints,
                          });
                          setShowManualModal(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteManualEntry(item.id, item.githubUsername)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Manual Entry Modal ── */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <h3 className="text-base font-bold text-gray-900">
                {editingEntry ? "Edit Participant Entry" : "Add Participant to Manual Leaderboard"}
              </h3>

              <form onSubmit={handleSaveManualEntry} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Rank</label>
                    <input
                      type="number"
                      min="1"
                      value={manualForm.rank}
                      onChange={(e) => setManualForm({ ...manualForm, rank: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#4285f4]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Total Points</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={manualForm.totalPoints}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          totalPoints: e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                      onFocus={() => {
                        if (manualForm.totalPoints === 0 || manualForm.totalPoints === "0") {
                          setManualForm({ ...manualForm, totalPoints: "" });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#4285f4]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">GitHub Username</label>
                  <input
                    type="text"
                    placeholder="e.g. torvalds"
                    value={manualForm.githubUsername}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        githubUsername: e.target.value,
                        githubUrl: `https://github.com/${e.target.value.trim().replace(/^@/, "")}`,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#4285f4]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={manualForm.githubUrl}
                    onChange={(e) => setManualForm({ ...manualForm, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#4285f4] font-mono text-xs"
                    required
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#4285f4] hover:bg-blue-600 text-white text-xs font-bold"
                  >
                    {editingEntry ? "Update Entry" : "Save Entry"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
