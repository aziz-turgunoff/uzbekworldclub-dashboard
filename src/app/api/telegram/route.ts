import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN;

// All channels/groups we want to track
const CHANNELS = [
  { id: "@UzbekWorldClub", label: "Uzbek World Club", type: "channel" },
  { id: "@uzbekworld_test", label: "Test Channel", type: "channel" },
];

async function getChatInfo(chatId: string) {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMemberCount?chat_id=${encodeURIComponent(chatId)}`,
      { next: { revalidate: 60 } } // cache 60s
    );
    const data = await res.json();

    const infoRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${encodeURIComponent(chatId)}`
    );
    const infoData = await infoRes.json();

    return {
      chatId,
      title: infoData.ok ? infoData.result.title : chatId,
      memberCount: data.ok ? data.result : null,
      error: data.ok ? null : data.description,
    };
  } catch (e) {
    return {
      chatId,
      title: chatId,
      memberCount: null,
      error: (e as Error).message,
    };
  }
}

export async function GET() {
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { error: "BOT_TOKEN not configured" },
      { status: 500 }
    );
  }

  const results = await Promise.all(CHANNELS.map((ch) => getChatInfo(ch.id)));

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    channels: results,
  });
}
