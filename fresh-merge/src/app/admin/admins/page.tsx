"use client";

import { useEffect, useState } from "react";

import { supabaseClient } from "@/lib/supabaseClient";

type Role = "buyer" | "agent" | "admin";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}

const ROLE_COLOURS: Record<Role, string> = {
  admin: "bg-purple-100 text-purple-700",
  agent: "bg-blue-100 text-blue-700",
  buyer: "bg-gray-100 text-gray-600",
};

export default function AdminAdminsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabaseClient
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false });
    setProfiles((data as Profile[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleRoleChange(profileId: string, newRole: Role) {
    setUpdating(profileId);
    await supabaseClient
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profileId);
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, role: newRole } : p))
    );
    setUpdating(null);
  }

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.email?.toLowerCase().includes(q) ||
      p.full_name?.toLowerCase().includes(q)
    );
  });

  const counts = {
    admin: profiles.filter((p) => p.role === "admin").length,
    agent: profiles.filter((p) => p.role === "agent").length,
    buyer: profiles.filter((p) => p.role === "buyer").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Users &amp; Roles</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage user roles: buyer, agent, or admin.
        </p>
      </div>

      {/* Role counts */}
      <div className="grid grid-cols-3 gap-4">
        {(["admin", "agent", "buyer"] as Role[]).map((role) => (
          <div key={role} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{role}s</p>
            {loading ? (
              <div className="mt-2 h-7 w-10 animate-pulse rounded-lg bg-gray-200" />
            ) : (
              <p className="mt-1.5 text-2xl font-semibold text-gray-900">{counts[role]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Search + table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full max-w-xs rounded-lg border border-gray-200 bg-gray-50 px-3.5 text-[13.5px] text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#08519A]/40 focus:bg-white"
          />
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse items-center justify-between px-5 py-4">
                <div className="space-y-2">
                  <div className="h-3.5 w-36 rounded-full bg-gray-200" />
                  <div className="h-3 w-24 rounded-full bg-gray-100" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-14 rounded-full bg-gray-100" />
                  <div className="h-8 w-20 rounded-lg bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-gray-400">No users found.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((profile) => (
              <li key={profile.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-gray-900">
                    {profile.full_name || <span className="text-gray-400 font-normal">No name</span>}
                  </p>
                  <p className="truncate text-[12px] text-gray-400">{profile.email}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${ROLE_COLOURS[profile.role]}`}>
                    {profile.role}
                  </span>

                  <select
                    value={profile.role}
                    disabled={updating === profile.id}
                    onChange={(e) => handleRoleChange(profile.id, e.target.value as Role)}
                    className="h-8 cursor-pointer rounded-lg border border-gray-200 bg-white px-2.5 text-[12.5px] font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 disabled:opacity-50"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
