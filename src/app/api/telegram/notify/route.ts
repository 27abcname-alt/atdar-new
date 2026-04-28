import { NextResponse } from "next/server";

type Body = {
  name?: string;
  price?: number;
  category?: string;
  location?: string;
  phone?: string;
};

function escapeHtml(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json(
        { ok: false, error: "Telegram env sozlanmagan." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Body;
    const name = body.name?.trim() || "Nomsiz mahsulot";
    const price = Number(body.price ?? 0);
    const category = body.category?.trim() || "-";
    const location = body.location?.trim() || "-";
    const phone = body.phone?.trim() || "-";
    const priceText = `${new Intl.NumberFormat("ru-RU").format(price)} so'm`;
    const adminUrl = "http://localhost:3000/admin-panel-atdar";
    const text = [
      "🟢 <b>Yangi e'lon!</b>",
      `Nomi: <b>${escapeHtml(name)}</b>`,
      `Narxi: <b>${escapeHtml(priceText)}</b>`,
      `Kategoriya: <b>${escapeHtml(category)}</b>`,
      `Manzil: <b>${escapeHtml(location)}</b>`,
      `Tel: <b>${escapeHtml(phone)}</b>`,
      `Admin panelga havola: <a href="${adminUrl}">${adminUrl}</a>`,
      "",
      "Iltimos, tekshirib tasdiqlang",
    ].join("\n");

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ ok: false, error: errText }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
