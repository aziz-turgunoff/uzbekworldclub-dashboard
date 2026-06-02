"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Button } from "@/components/ui/button";

// ============================================
// LIVE TELEGRAM STATS
// ============================================
interface ChannelStat {
  chatId: string;
  title: string;
  memberCount: number | null;
  error: string | null;
}

function useTelegramStats() {
  const [stats, setStats] = useState<ChannelStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/telegram");
      const data = await res.json();
      if (data.channels) {
        setStats(data.channels);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch {
      // silently fail — will show "—" for stats
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 60_000); // refresh every 60s
    return () => clearInterval(id);
  }, [fetchStats]);

  return { stats, loading, lastUpdated, refresh: fetchStats };
}

function LiveKPIs() {
  const { stats, loading, lastUpdated, refresh } = useTelegramStats();

  const mainChannel = stats.find((s) => s.chatId === "@UzbekWorldClub");
  const testChannel = stats.find((s) => s.chatId === "@uzbekworld_test");

  const kpis = [
    {
      label: "Telegram Members",
      value: mainChannel?.memberCount ?? "—",
      target: "10,000",
      icon: "💬",
      live: true,
    },
    {
      label: "Test Channel",
      value: testChannel?.memberCount ?? "—",
      target: "—",
      icon: "🧪",
      live: true,
    },
    {
      label: "Registered Fans",
      value: "849",
      target: "5,000",
      icon: "🇺🇿",
      live: false,
      note: "from uzbekworldclub.com",
    },
    {
      label: "Countries",
      value: "40",
      target: "50+",
      icon: "🌍",
      live: false,
    },
    {
      label: "Traveling to WC",
      value: "353",
      target: "1,000",
      icon: "✈️",
      live: false,
    },
    {
      label: "Stadium Seats Marked",
      value: "173",
      target: "500",
      icon: "🏟️",
      live: false,
      note: "86 Azteca + 52 NRG + 35 MB",
    },
  ];

  return (
    <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-green-900 dark:text-green-100">📊 Live KPIs</CardTitle>
            <CardDescription className="text-base text-green-700 dark:text-green-300">
              {loading ? "Loading..." : `Last updated: ${lastUpdated}`}
              {!loading && " · auto-refreshes every 60s"}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300"
          >
            🔄 Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="text-center rounded-2xl border border-green-200 dark:border-green-800 p-5 bg-white dark:bg-green-950/30"
            >
              <div className="text-3xl mb-2">{k.icon}</div>
              <div className="text-2xl font-extrabold tabular-nums">
                {loading && k.live ? (
                  <span className="animate-pulse text-muted-foreground">...</span>
                ) : (
                  typeof k.value === "number" ? k.value.toLocaleString() : k.value
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{k.label}</div>
              <div className="text-xs text-green-600 dark:text-green-500 mt-1">
                {k.live ? "🟢 live" : "📌 manual"} · target: {k.target}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

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
        <div key={u.l} className="rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-5">
          <div className="text-4xl font-extrabold tabular-nums text-green-700 dark:text-green-400">
            {String(u.v).padStart(2, "0")}
          </div>
          <div className="text-sm text-green-600 dark:text-green-500 mt-1 font-medium">{u.l}</div>
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
      { name: "Telegram bot is live and posting automatically", done: true },
      { name: "Match schedule updated (Portugal, Colombia, DR Congo)", done: true },
      { name: "New members get a welcome message when they join", done: true },
      { name: "30-day content plan created", done: true },
      { name: "50 conversation starters ready for the community", done: true },
      { name: "All private data secured properly", done: true },
      { name: "Project plan mapped visually (see graph below)", done: true },
      { name: "Pin welcome message in Telegram (waiting for admin access)", done: false },
      { name: "Post community rules in Telegram", done: false },
      { name: "Confirm 3+ moderators for the group", done: false },
    ],
  },
  {
    name: "Phase 2 — Growth", dates: "Jun 2 – Jun 5", status: "active" as const, progress: 10, owner: "Community Lead + Content Lead",
    tasks: [
      { name: "Reach out to 100 influencers per day", done: false },
      { name: "Share in 100+ Uzbek Telegram groups", done: false },
      { name: "Recruit City Captains in key cities", done: false },
      { name: "Start onboarding watch party hosts", done: false },
      { name: "Create city subgroups (Houston, Atlanta, Mexico City)", done: false },
      { name: "Goal: 3,000 Telegram members", done: false },
    ],
  },
  {
    name: "Phase 3 — Community & Founders", dates: "Jun 6 – Jun 10", status: "upcoming" as const, progress: 0, owner: "Sardor + Volunteer Lead",
    tasks: [
      { name: "Invite business leaders to Founders Davra", done: false },
      { name: "Reach out to Uzbek media and press", done: false },
      { name: "Coordinate fan seating sections at stadiums", done: false },
      { name: "Confirm 50+ city watch parties", done: false },
      { name: "Goal: 5,000–7,000 members", done: false },
    ],
  },
  {
    name: "Phase 4 — Final Countdown", dates: "Jun 11 – Jun 15", status: "upcoming" as const, progress: 0, owner: "Full Team",
    tasks: [
      { name: "Daily countdown content across all channels", done: false },
      { name: "Share matchday logistics (where to go, what to do)", done: false },
      { name: "Ask every member to invite 3 friends", done: false },
      { name: "Live coordination for fans at the stadium", done: false },
      { name: "Goal: 10,000+ members by kickoff", done: false },
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
    category: "🤖 Telegram Bot",
    items: [
      "Bot is live and auto-posting to our test channel",
      "Correct match schedule: Portugal → Colombia → DR Congo",
      "Posts every 30 minutes with different types of content",
      "Automatically finds and shares real football news",
      "Avoids posting the same content twice",
      "Greets new members with a welcome message",
      "Includes polls and questions to engage the community",
      "Admins can control the bot via Telegram commands",
    ],
  },
  {
    category: "📝 Content",
    items: [
      "30-day content calendar covering Jun 1 – Jun 30",
      "50 conversation starters in Uzbek and Russian",
      "Community rules document ready to post",
      "Welcome message with full match schedule",
    ],
  },
  {
    category: "🗺️ Planning",
    items: [
      "Visual map of the entire execution plan (interactive graph)",
      "All project phases, goals, and risks mapped out",
      "Clear view of what depends on what",
      "Everything organized in one place",
    ],
  },
];

function StatusBadge({ status }: { status: string }) {
  const variant = status === "completed" ? "default" : status === "active" ? "secondary" : "outline";
  const label = status === "completed" ? "✅ Done" : status === "active" ? "🔵 In Progress" : "⏳ Coming Up";
  return <Badge variant={variant} className="text-sm px-3 py-1">{label}</Badge>;
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl">🇺🇿</span>
                <h1 className="text-4xl font-extrabold tracking-tight">Uzbek World Club</h1>
              </div>
              <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">
                Building the largest Uzbek fan community for FIFA World Cup 2026 — the first time Uzbekistan plays on the world stage.
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <Badge className="bg-green-600 text-white text-base px-4 py-2">🟢 Live</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Countdown + Match Schedule */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">⏰ Time Until First Match</CardTitle>
              <CardDescription className="text-base">🇺🇿 Uzbekistan vs 🇵🇹 Portugal — Houston, June 17</CardDescription>
            </CardHeader>
            <CardContent>
              <Countdown />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">⚽ Our Matches</CardTitle>
              <CardDescription className="text-base">Group K — three games, three cities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {matches.map((m) => (
                <div key={m.date} className="flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{m.flag}</span>
                    <div>
                      <div className="font-bold text-base">vs {m.opponent}</div>
                      <div className="text-sm text-muted-foreground">{m.stadium}, {m.city}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-base">{m.date}</div>
                    <div className="text-sm text-muted-foreground">{m.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Live KPIs */}
        <LiveKPIs />

        {/* Targets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🎯 Our Goals</CardTitle>
            <CardDescription className="text-base">What we want to achieve by June 17</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {targets.map((t) => (
                <div key={t.label} className="text-center rounded-2xl border p-5">
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <div className="text-2xl font-extrabold">{t.target}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phase Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">📅 Execution Roadmap</CardTitle>
            <CardDescription className="text-base">17 days, four phases — here&apos;s where we are</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {phases.map((phase) => (
              <div key={phase.name}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{phase.name}</h3>
                    <p className="text-sm text-muted-foreground">{phase.dates} · Lead: {phase.owner}</p>
                  </div>
                  <StatusBadge status={phase.status} />
                </div>
                <Progress value={phase.progress} className="h-2.5 mb-4" />
                <div className="grid sm:grid-cols-2 gap-2">
                  {phase.tasks.map((task) => (
                    <div key={task.name} className="flex items-center gap-2.5 text-base py-1.5">
                      <span className="text-lg">{task.done ? "✅" : "⬜"}</span>
                      <span>{task.name}</span>
                    </div>
                  ))}
                </div>
                <Separator className="mt-6" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* What Was Completed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">✅ What We&apos;ve Done So Far</CardTitle>
            <CardDescription className="text-base">Everything completed in Phase 1</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              {completedWork.map((section) => (
                <div key={section.category}>
                  <h4 className="font-bold text-base mb-4">{section.category}</h4>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-base leading-relaxed">
                        <span className="text-green-600 mt-0.5 text-lg">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Map */}
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-xl text-blue-900 dark:text-blue-100">📊 Project Map</CardTitle>
            <CardDescription className="text-base text-blue-700 dark:text-blue-300">
              A visual overview of everything in our plan — how phases, goals, risks, and deliverables connect to each other.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-base text-blue-800 dark:text-blue-200 space-y-3">
            <p>
              We mapped out the entire project as an interactive diagram. You can click on any item to see
              what it connects to — which phase it belongs to, what it depends on, and who&apos;s responsible.
            </p>
            <p>
              This helps us stay organized and plan ahead for the next phases.
            </p>
            <a href="/graph.html" target="_blank" className="inline-flex items-center gap-2 mt-3 rounded-lg bg-blue-700 dark:bg-blue-600 text-white px-5 py-3 text-base font-semibold hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors no-underline">
              📊 Open Project Map →
            </a>
          </CardContent>
        </Card>

        {/* What Needs Attention */}
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 dark:text-amber-100">⚠️ What Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-base text-amber-900 dark:text-amber-100 mb-3">To Finish Phase 1</h4>
                <ul className="space-y-3 text-base text-amber-800 dark:text-amber-200">
                  <li>🔴 We need admin access to the Telegram channel to pin the welcome message</li>
                  <li>🔴 Community rules need to be posted for members to see</li>
                  <li>🔴 We need at least 3 moderators confirmed and active</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-base text-amber-900 dark:text-amber-100 mb-3">Starting Phase 2 (Today)</h4>
                <ul className="space-y-3 text-base text-amber-800 dark:text-amber-200">
                  <li>🟡 Write and share the City Captain recruitment post</li>
                  <li>🟡 Build list of 100 Uzbek Telegram groups to reach out to</li>
                  <li>🟡 Build list of 100+ influencers to contact</li>
                  <li>🟡 Switch the bot to the main channel when we&apos;re ready</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backend Access Request */}
        <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-900">
          <CardHeader>
            <CardTitle className="text-xl text-purple-900 dark:text-purple-100">🔐 Backend / Database Access Needed</CardTitle>
            <CardDescription className="text-base text-purple-700 dark:text-purple-300">
              To make this dashboard fully live, we need access to the uzbekworldclub.com database (Supabase).
            </CardDescription>
          </CardHeader>
          <CardContent className="text-base text-purple-800 dark:text-purple-200 space-y-4">
            <p>
              Right now, the numbers for &quot;Registered Fans&quot;, &quot;Countries&quot;, &quot;Traveling&quot;, and &quot;Stadium Seats&quot; are
              manually copied from the website. To make them <strong>update automatically</strong>, we need:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/30 p-4">
                <h4 className="font-bold mb-2">1. Supabase Project URL</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Open your Lovable project → Settings → Supabase → copy the Project URL
                </p>
                <code className="block mt-2 text-xs bg-purple-100 dark:bg-purple-900 rounded p-2 break-all">
                  https://xxxxx.supabase.co
                </code>
              </div>
              <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/30 p-4">
                <h4 className="font-bold mb-2">2. Supabase Anon Key</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Same place → API Settings → copy the &quot;anon / public&quot; key
                </p>
                <code className="block mt-2 text-xs bg-purple-100 dark:bg-purple-900 rounded p-2 break-all">
                  eyJhbGciOiJIUzI1NiIs...
                </code>
              </div>
            </div>
            <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-purple-950/30 p-4">
              <h4 className="font-bold mb-2">How to find it in Lovable:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-purple-600 dark:text-purple-400">
                <li>Go to <a href="https://lovable.dev" target="_blank" className="underline font-medium">lovable.dev</a> → open your project</li>
                <li>Click the <strong>Supabase</strong> icon in the left sidebar (green database icon)</li>
                <li>You&apos;ll see your Project URL and can access the Supabase dashboard</li>
                <li>In Supabase dashboard → Settings → API → copy <strong>Project URL</strong> + <strong>anon key</strong></li>
                <li>Add both to Vercel: Settings → Environment Variables</li>
              </ol>
            </div>
            <div className="rounded-xl border border-dashed border-purple-300 dark:border-purple-700 p-4 text-center">
              <p className="text-sm text-purple-500 dark:text-purple-400 mb-2">Add these to your Vercel project as environment variables:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <code className="text-xs bg-purple-100 dark:bg-purple-900 rounded px-3 py-1">NEXT_PUBLIC_SUPABASE_URL</code>
                <code className="text-xs bg-purple-100 dark:bg-purple-900 rounded px-3 py-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              </div>
              <p className="text-xs text-purple-400 dark:text-purple-500 mt-2">
                ✅ BOT_TOKEN is already configured — Telegram stats are live
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-base text-muted-foreground py-10 space-y-2">
          <p className="font-semibold">Uzbek World Club — Progress Dashboard</p>
          <p>Last updated: June 3, 2026</p>
          <div className="flex flex-wrap justify-center gap-4 mt-3">
            <a href="https://uzbekworldclub.com" className="underline hover:text-foreground" target="_blank">Website</a>
            <a href="https://t.me/UzbekWorldClub" className="underline hover:text-foreground" target="_blank">Telegram Community</a>
            <a href="https://t.me/uzbekworld_test" className="underline hover:text-foreground" target="_blank">Test Channel</a>
            <a href="https://t.me/UzbekWorldClub_Bot" className="underline hover:text-foreground" target="_blank">Bot</a>
          </div>
        </div>
      </main>
    </div>
  );
}
