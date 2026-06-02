"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

function Countdown() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    const target = new Date("2026-06-17T21:00:00-05:00").getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setDays(Math.floor(diff / 86400000));
      setHours(Math.floor((diff % 86400000) / 3600000));
      setMins(Math.floor((diff % 3600000) / 60000));
      setSecs(Math.floor((diff % 60000) / 1000));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-3 text-center">
      {[
        { v: days, l: "Days" },
        { v: hours, l: "Hours" },
        { v: mins, l: "Minutes" },
        { v: secs, l: "Seconds" },
      ].map((u) => (
        <div key={u.l} className="rounded-xl bg-primary/5 p-4">
          <div className="text-3xl font-bold tabular-nums text-primary">
            {String(u.v).padStart(2, "0")}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{u.l}</div>
        </div>
      ))}
    </div>
  );
}

const matches = [
  { date: "Jun 17", time: "21:00", opponent: "Portugal", flag: "🇵🇹", city: "Houston", stadium: "NRG Stadium" },
  { date: "Jun 21", time: "18:00", opponent: "Colombia", flag: "🇨🇴", city: "Atlanta", stadium: "Mercedes-Benz Stadium" },
  { date: "Jun 25", time: "15:00", opponent: "DR Congo", flag: "🇨🇩", city: "Mexico City", stadium: "Estadio Azteca" },
];

const phases = [
  {
    name: "Phase 1 — Foundation", dates: "May 29 – Jun 1", status: "completed" as const, progress: 100, owner: "Community Lead",
    tasks: [
      { name: "Telegram bot live (@UzbekWorldClub_Bot)", done: true },
      { name: "Correct Group K match schedule wired", done: true },
      { name: "Welcome flow for new members", done: true },
      { name: "30-day content calendar generated", done: true },
      { name: "50 engagement prompts added to bot", done: true },
      { name: "Sensitive data moved to .env", done: true },
      { name: "Graphify knowledge graph analysis", done: true },
      { name: "Pinned welcome message (needs admin)", done: false },
      { name: "Community rules posted", done: false },
      { name: "3+ moderators confirmed", done: false },
    ],
  },
  {
    name: "Phase 2 — Growth Activation", dates: "Jun 2 – Jun 5", status: "active" as const, progress: 10, owner: "Community Lead + Content Lead",
    tasks: [
      { name: "Influencer outreach (100/day)", done: false },
      { name: "100+ Uzbek Telegram groups seeding", done: false },
      { name: "City Captain recruitment", done: false },
      { name: "Watch party onboarding", done: false },
      { name: "City subgroups (Houston, Atlanta, Mexico)", done: false },
      { name: "Target: 3,000 Telegram members", done: false },
    ],
  },
  {
    name: "Phase 3 — Community & Founder Layer", dates: "Jun 6 – Jun 10", status: "upcoming" as const, progress: 0, owner: "Sardor + Volunteer Lead",
    tasks: [
      { name: "Founders Davra outreach", done: false },
      { name: "Press outreach (Uzbek media)", done: false },
      { name: "Stadium Davra activation", done: false },
      { name: "50+ city watch party confirmations", done: false },
      { name: "Target: 5,000–7,000 members", done: false },
    ],
  },
  {
    name: "Phase 4 — Countdown Mode", dates: "Jun 11 – Jun 15", status: "upcoming" as const, progress: 0, owner: "Full Team",
    tasks: [
      { name: "Full countdown content blitz", done: false },
      { name: "Matchday logistics posts", done: false },
      { name: "Every member invites 3 people", done: false },
      { name: "Stadium Davra live coordination", done: false },
      { name: "Target: 10,000+ members at kickoff", done: false },
    ],
  },
];

const targets = [
  { label: "Telegram Members", target: "10K", icon: "💬" },
  { label: "Watch Parties", target: "100+", icon: "🎉" },
  { label: "City Captains", target: "50", icon: "🏙️" },
  { label: "Founders Davra", target: "100", icon: "🤝" },
  { label: "Website Visitors", target: "50K+", icon: "🌐" },
  { label: "Volunteers", target: "20", icon: "🙋" },
];

const completedWork = [
  {
    category: "Telegram Bot",
    items: [
      "Auto-posting bot live on @uzbekworld_test",
      "Correct Group K schedule: Portugal, Colombia, DR Congo",
      "30-min post interval with weighted content categories",
      "Google News RSS parsing for real football news",
      "Semantic duplicate detection (Jaccard similarity)",
      "New member welcome handler with match info",
      "10 engagement prompts (polls, questions, CTAs)",
      "Admin panel with /status, /tags, /topic commands",
      "All secrets in .env — zero hardcoded tokens",
    ],
  },
  {
    category: "Content",
    items: [
      "30-day content calendar (Jun 1 – Jun 30)",
      "50 engagement prompts in Uzbek + Russian",
      "Community rules document drafted",
      "Welcome message with match schedule",
    ],
  },
  {
    category: "Infrastructure",
    items: [
      "Graphify knowledge graph of entire execution plan",
      "31 nodes, 31 connections, 10 communities detected",
      "Local HTTP server for graphify visualization",
      "All outputs consolidated in graphify/ folder",
      "Legacy bot files cleaned (7 → 1 production file)",
    ],
  },
];

function StatusBadge({ status }: { status: string }) {
  const variant = status === "completed" ? "default" : status === "active" ? "secondary" : "outline";
  const label = status === "completed" ? "✅ Complete" : status === "active" ? "🔵 Active" : "⏳ Upcoming";
  return <Badge variant={variant}>{label}</Badge>;
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🇺🇿</span>
                <h1 className="text-3xl font-bold tracking-tight">Uzbek World Club</h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-xl">
                Build the largest organized Uzbek fan community on Earth around FIFA World Cup 2026 — Uzbekistan&apos;s first ever.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge className="bg-green-600 text-white text-sm px-3 py-1">🟢 Live</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Countdown + Match Schedule */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">⏰ Countdown to First Match</CardTitle>
              <CardDescription>🇺🇿 Uzbekistan vs 🇵🇹 Portugal — Houston, Jun 17</CardDescription>
            </CardHeader>
            <CardContent>
              <Countdown />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">⚽ Group K — Match Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {matches.map((m) => (
                <div key={m.date} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.flag}</span>
                    <div>
                      <div className="font-semibold">vs {m.opponent}</div>
                      <div className="text-sm text-muted-foreground">{m.stadium}, {m.city}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{m.date}</div>
                    <div className="text-sm text-muted-foreground">{m.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Targets */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Key Targets</CardTitle>
            <CardDescription>What success looks like on June 17 at kickoff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {targets.map((t) => (
                <div key={t.label} className="text-center rounded-xl border p-4">
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-xl font-bold">{t.target}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phase Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>📅 17-Day Execution Plan</CardTitle>
            <CardDescription>Four phases from infrastructure to matchday</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {phases.map((phase) => (
              <div key={phase.name}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{phase.name}</h3>
                    <p className="text-sm text-muted-foreground">{phase.dates} · Owner: {phase.owner}</p>
                  </div>
                  <StatusBadge status={phase.status} />
                </div>
                <Progress value={phase.progress} className="h-2 mb-3" />
                <div className="grid sm:grid-cols-2 gap-1">
                  {phase.tasks.map((task) => (
                    <div key={task.name} className="flex items-center gap-2 text-sm py-1">
                      <span>{task.done ? "✅" : "⬜"}</span>
                      <span>{task.name}</span>
                    </div>
                  ))}
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* What Was Completed */}
        <Card>
          <CardHeader>
            <CardTitle>🛠️ Work Completed</CardTitle>
            <CardDescription>Everything built and shipped in Phase 1</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {completedWork.map((section) => (
                <div key={section.category}>
                  <h4 className="font-semibold mb-3">{section.category}</h4>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Graphify Note */}
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">📊 Graphify — Internal Planning Tool</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>
              Graphify is our internal knowledge graph analysis tool. It maps the entire execution plan into a
              navigable graph with 31 nodes, 31 connections, and 10 detected communities.
            </p>
            <p>
              We use it to identify dependencies between phases, track deliverables, and plan future phases
              (Growth, Founders Davra, Stadium Davra). It is not a customer-facing tool — it&apos;s our operational
              backbone for Phases 2–4.
            </p>
            <a href="/graph.html" target="_blank" className="inline-flex items-center gap-2 mt-3 rounded-md bg-blue-700 dark:bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors no-underline">
              📊 Open Interactive Knowledge Graph →
            </a>
          </CardContent>
        </Card>

        {/* Blockers */}
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardHeader>
            <CardTitle className="text-amber-900 dark:text-amber-100">⚠️ Blockers &amp; Next Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Blocking Phase 1 Completion</h4>
                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                  <li>🔴 Telegram admin rights needed for pinned message</li>
                  <li>🔴 Community rules need to be posted</li>
                  <li>🔴 3+ moderators need confirmation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Phase 2 Immediate Actions (Today)</h4>
                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                  <li>🟡 City Captain SOP + recruitment post</li>
                  <li>🟡 100 Telegram groups outreach list</li>
                  <li>🟡 Influencer outreach list (100+)</li>
                  <li>🟡 Switch bot to @uzbekworldcup when ready</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>Uzbek World Club — Execution Dashboard · Built June 2, 2026</p>
          <p className="mt-1">
            <a href="https://uzbekworldclub.tiiny.site" className="underline hover:text-foreground" target="_blank">uzbekworldclub.tiiny.site</a>
            {" · "}
            <a href="https://t.me/UzbekWorldClub" className="underline hover:text-foreground" target="_blank">t.me/UzbekWorldClub</a>
          </p>
        </div>
      </main>
    </div>
  );
}
