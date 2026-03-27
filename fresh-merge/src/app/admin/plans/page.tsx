"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

interface PlanLimit {
  plan: string;
  label: string;
  max_properties: number;
}

const PLAN_COLOURS: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  paid: "bg-amber-100 text-amber-700",
};

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [edited, setEdited] = useState<Record<string, number>>({});

  async function load() {
    setLoading(true);
    const { data } = await supabaseClient.from("plan_limits").select("*").order("plan");
    setPlans((data as PlanLimit[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(plan: string) {
    setSaving(plan);
    await supabaseClient
      .from("plan_limits")
      .update({ max_properties: edited[plan], updated_at: new Date().toISOString() })
      .eq("plan", plan);
    setPlans((prev) => prev.map((p) => p.plan === plan ? { ...p, max_properties: edited[plan] } : p));
    setEdited((prev) => { const n = { ...prev }; delete n[plan]; return n; });
    setSaving(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Plans &amp; Limits</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure how many properties each plan tier can publish at once.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <p className="text-sm font-semibold text-gray-900">Property limits per plan</p>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {plans.map((plan) => {
              const currentVal = edited[plan.plan] ?? plan.max_properties;
              const isDirty = edited[plan.plan] !== undefined;
              return (
                <li key={plan.plan} className="flex items-center justify-between gap-6 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-wide ${PLAN_COLOURS[plan.plan] ?? "bg-blue-100 text-blue-700"}`}>
                      {plan.label}
                    </span>
                    <p className="text-[13.5px] text-gray-500">Max published properties</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={9999}
                      value={currentVal}
                      onChange={(e) => setEdited((prev) => ({ ...prev, [plan.plan]: parseInt(e.target.value) || 1 }))}
                      className="h-9 w-24 rounded-lg border border-gray-200 bg-gray-50 px-3 text-center text-[14px] font-semibold text-gray-900 outline-none focus:border-[#08519A]/40 focus:bg-white"
                    />
                    <button
                      onClick={() => save(plan.plan)}
                      disabled={!isDirty || saving === plan.plan}
                      className="h-9 rounded-lg bg-[#08519A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#063d75] disabled:opacity-40"
                    >
                      {saving === plan.plan ? "Saving…" : "Save"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-[13px] text-gray-500 space-y-1">
        <p className="font-semibold text-gray-700">How limits work</p>
        <p>Each agency is assigned a plan (Free or Paid). They can only have up to their plan&apos;s limit of <strong>published</strong> listings at any one time. Draft listings don&apos;t count toward the limit.</p>
        <p>You can upgrade or downgrade an agency&apos;s plan from the <a href="/admin/agencies" className="text-[#08519A] underline">Agencies</a> page.</p>
      </div>
    </div>
  );
}
