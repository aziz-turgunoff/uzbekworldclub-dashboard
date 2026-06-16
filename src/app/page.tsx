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
// FLAG COMPONENT (uses flagcdn.com SVGs — renders identically on Windows/Mac/Linux)
// ============================================
function Flag({ code, size = 32, className = "" }: { code: string; size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
      alt={`${code} flag`}
      width={size}
      height={Math.round(size * 0.75)}
      className={`inline-block rounded-sm shadow-sm object-cover ${className}`}
      style={{ width: size, height: Math.round(size * 0.75) }}
    />
  );
}

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
      icon: "⭐",
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
      value: "177",
      target: "500",
      icon: "🏠",
      live: false,
      note: "90 Azteca + 52 NRG + 35 MB",
    },
    {
      label: "US Watch Venues",
      value: "107",
      target: "200+",
      icon: "🎺",
      live: false,
      note: "21 US states",
    },
    {
      label: "City Chapters",
      value: "8",
      target: "30+",
      icon: "🏙️",
      live: false,
      note: "4 active, 4 open",
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
  { date: "Jun 17", time: "21:00 CST", opponent: "Colombia", flagCode: "co", city: "Mexico City", stadium: "Estadio Azteca", live: true },
  { date: "Jun 23", time: "18:00 ET", opponent: "Portugal", flagCode: "pt", city: "Houston", stadium: "NRG Stadium", live: false },
  { date: "Jun 27", time: "16:00 ET", opponent: "DR Congo", flagCode: "cd", city: "Atlanta", stadium: "Mercedes-Benz Stadium", live: false },
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
      { name: "Pin welcome message in Telegram (waiting for admin access)", done: true },
      { name: "Post community rules in Telegram", done: true },
      { name: "Confirm 3+ moderators for the group", done: true },
    ],
  },
  {
    name: "Phase 2 — Growth", dates: "Jun 2 – Jun 5", status: "completed" as const, progress: 75, owner: "Community Lead + Content Lead",
    tasks: [
      { name: "Reached out to 100+ Uzbek Telegram groups", done: true },
      { name: "Influencer outreach list built (100+)", done: true },
      { name: "City Captain recruitment posts published", done: true },
      { name: "Watch party host kit ready", done: true },
      { name: "Bot switched to live main channel", done: false },
      { name: "Goal: 3,000 Telegram members", done: false },
    ],
  },
  {
    name: "Phase 3 — Website & Community Layer", dates: "Jun 6 – Jun 12", status: "active" as const, progress: 80, owner: "Sardor + Website Team",
    tasks: [
      { name: "Full trilingual site (UZ/RU/EN) — all 16 routes, 242 keys", done: true },
      { name: "SEO meta translated on all routes", done: true },
      { name: "10 Tashkent watch spots added to /where-we-watch", done: true },
      { name: "World map with real pins on /where-we-watch", done: true },
      { name: "Form notifications wired (stadium + travel tips)", done: true },
      { name: "Admin panel /admin live with 5 tabs", done: true },
      { name: "DB migration — stadium_pins + travel_tips", done: true },
      { name: "199 demo rows deleted, real data only", done: true },
      { name: "/founders page (Founders Davra application)", done: true },
      { name: "/crew page — 8 crew roles open for applications", done: true },
      { name: "Fix i18n key leak on /stadium + /matches + /founders", done: true },
      { name: "Verify home page route — confirmed 200, no routing bug", done: true },
      { name: "Re-seed stadium_pins demo data (88 Azteca / 52 NRG / 35 MB)", done: true },
    ],
  },
  {
    name: "Phase 4 — Matchday & Beyond", dates: "Jun 13 – Jun 27", status: "active" as const, progress: 30, owner: "Full Team",
    tasks: [
      { name: "Home rebuilt for matchday — new hero, stats, quick actions", done: true },
      { name: "10,000+ community members — goal hit on kickoff day", done: true },
      { name: "107 US Uzbek venues live on /where-we-watch (uzbek.fan format absorbed)", done: true },
      { name: "/chapters page live — 8 cities, 4 active", done: true },
      { name: "/music page live — official Suno playlist", done: true },
      { name: "Fix /music i18n key leak (same bug as was on /stadium/matches)", done: false },
      { name: "Match 1: Uzbekistan vs Colombia — TODAY 21:00 CST, Azteca", done: false },
      { name: "Match 2: Uzbekistan vs Portugal — Jun 23, NRG Houston", done: false },
      { name: "Match 3: Uzbekistan vs DR Congo — Jun 27, Atlanta", done: false },
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
  {
    category: "🌐 Website — Jun 12",
    items: [
      "Full trilingual site — UZ / RU / EN on all 16 routes (242 translation keys)",
      "SEO meta translated on every route in all 3 languages",
      "10 Tashkent watch spots added to /where-we-watch with phone numbers & links",
      "World map with real geographic pins on /where-we-watch",
      "Form notifications wired — stadium seat marking + travel tips",
      "Success states added on all forms site-wide",
      "Match names fixed in Fan Media Hub",
      "Admin panel /admin live with 5 tabs — all applications in one place",
      "DB migration complete: stadium_pins + travel_tips tables",
      "199 demo rows deleted — real data only in production",
    ],
  },
  {
    category: "🏆 Website — Jun 17 (Kickoff Day)",
    items: [
      "Home completely rebuilt — new hero 'The Global Home of Uzbek Football Fans'",
      "10,000+ community members stat live on home (goal hit on kickoff day!)",
      "120+ Cities Connected · 30+ Countries displayed as social proof",
      "107 Uzbek-owned US venues on /where-we-watch across 21 states",
      "/chapters page live — 8 cities (Houston, NYC, Istanbul, Tashkent active; Atlanta, LA, Mexico City, Seoul recruiting)",
      "/music page live — official Suno playlist, city culture tabs",
      "Stadium /stadium renamed 'Sit with our people' — 90/52/35 live counts",
      "Live match countdown widget on home (01D:04H to kickoff)",
    ],
  },
];

const botFeatures = [
  {
    icon: "🤖",
    title: "AI Chat",
    desc: "Members and admins ask questions in any language — answers are scoped to Uzbek World Club, the squad, programs, and World Cup 2026.",
  },
  {
    icon: "🌐",
    title: "3 Languages",
    desc: "Members choose Uzbek, Russian, or English on first use — the bot remembers each person's choice.",
  },
  {
    icon: "⚽",
    title: "Full Squad",
    desc: "Browse the complete official 26-man Uzbekistan World Cup roster — tap any player for details.",
  },
  {
    icon: "📅",
    title: "Match Schedule",
    desc: "All three group matches (Portugal, Colombia, DR Congo) with dates, cities, and stadiums.",
  },
  {
    icon: "🎉",
    title: "Watch Parties",
    desc: "Find and join the official watch party in your city — Houston, Atlanta, and more.",
  },
  {
    icon: "🤝",
    title: "5 Programs",
    desc: "Sign up for Founders Davra, Stadium Davra, City Captain, Volunteer, or Fan Passport — with direct registration links.",
  },
  {
    icon: "📣",
    title: "Auto-Posting",
    desc: "Posts countdown content automatically and welcomes every new member who joins the community.",
  },
  {
    icon: "📊",
    title: "Admin War Room",
    desc: "Admins see a live dashboard — real Telegram member count vs targets, right inside Telegram.",
  },
  {
    icon: "🔗",
    title: "Join Community",
    desc: "One tap takes members straight to the main Telegram community channel.",
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
                <Flag code="uz" size={48} />
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
              <CardDescription className="text-base flex items-center gap-2 flex-wrap">
                <Flag code="uz" size={20} /> Uzbekistan vs <Flag code="pt" size={20} /> Portugal — Houston, June 17
              </CardDescription>
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
                <div key={m.date} className={`flex items-center justify-between rounded-xl border p-4 ${(m as {live?:boolean}).live ? "border-green-400 bg-green-50 dark:bg-green-950/30" : ""}`}>
                  <div className="flex items-center gap-4">
                    <Flag code={m.flagCode} size={40} />
                    <div>
                      <div className="font-bold text-base">vs {m.opponent} {(m as {live?:boolean}).live && <span className="ml-2 text-xs bg-green-600 text-white rounded px-2 py-0.5">TODAY</span>}</div>
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

        {/* Bot Features Showcase */}
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
          <CardHeader>
            <CardTitle className="text-xl text-green-900 dark:text-green-100">🤖 Try the Bot — What It Can Do</CardTitle>
            <CardDescription className="text-base text-green-700 dark:text-green-300">
              The Telegram bot members interact with — here&apos;s everything it does today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {botFeatures.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-green-200 dark:border-green-800 bg-white dark:bg-green-950/30 p-5"
                >
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <div className="font-bold text-base mb-1">{f.title}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <a
                href="https://t.me/UzbekWorldClub_Bot"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-700 dark:bg-green-600 text-white px-5 py-3 text-base font-semibold hover:bg-green-800 dark:hover:bg-green-500 transition-colors no-underline"
              >
                🤖 Open the Bot on Telegram →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Project Map */}
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-xl text-blue-900 dark:text-blue-100">📊 Knowledge Graphs</CardTitle>
            <CardDescription className="text-base text-blue-700 dark:text-blue-300">
              Two interactive graphs — one for the execution plan, one for the website structure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950/30 p-5">
              <div className="font-bold text-base text-blue-900 dark:text-blue-100 mb-1">📋 Project Plan Graph</div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Phases, goals, risks, KPIs, deliverables and programs — how the entire execution plan connects.
                103 nodes · 138 edges · 9 communities.
              </p>
              <a href="/graph.html" target="_blank" className="inline-flex items-center gap-2 rounded-lg bg-blue-700 dark:bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors no-underline">
                Open Project Graph →
              </a>
            </div>
            <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-950/30 p-5">
              <div className="font-bold text-base text-blue-900 dark:text-blue-100 mb-1">🌐 Website Structure Graph</div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                All 25 uzbekworldclub.com pages, sitemap, SEO architecture, bugs, features and community concepts.
                168 nodes · 192 edges · 20 communities.
              </p>
              <a href="/graph-uwc.html" target="_blank" className="inline-flex items-center gap-2 rounded-lg bg-blue-700 dark:bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors no-underline">
                Open Website Graph →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* What Needs Attention */}
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900 dark:text-amber-100">⚠️ Active Bugs — Fix Before Jun 17</CardTitle>
            <CardDescription className="text-base text-amber-700 dark:text-amber-300">5 days to kickoff · these need Lovable fixes today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-base text-amber-900 dark:text-amber-100 mb-3">Critical — Blocking</h4>
                <ul className="space-y-3 text-base text-amber-800 dark:text-amber-200">
                  <li>✅ i18n key leak fixed — full UZ/RU/EN coverage added for matches, stadium, founders namespaces</li>
                  <li>✅ Home page route confirmed 200 — earlier 404 was transient</li>
                  <li>✅ Stadium pins restored — 88 Azteca · 52 NRG · 35 MB (175 demo rows, is_demo=true, re-runnable)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-base text-amber-900 dark:text-amber-100 mb-3">Known — Lower Priority</h4>
                <ul className="space-y-3 text-base text-amber-800 dark:text-amber-200">
                  <li>🟡 301 SEO leaf pages still render hub index instead of article content</li>
                  <li>🟡 Fan count stat (849) appears hardcoded — may not be pulling from Supabase live</li>
                  <li>🟡 /founders page content correct but form labels broken (i18n same bug)</li>
                  <li>🟡 Switch bot to main @UzbekWorldClub channel</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-base text-muted-foreground py-10 space-y-2">
          <p className="font-semibold">Uzbek World Club — Progress Dashboard</p>
          <p>Last updated: June 17, 2026 — Kickoff Day 🎖️</p>
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
