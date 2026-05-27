// Supabase Edge Function: Telegram Notification
// Listen to 'listings' table INSERT and UPDATE events via Webhook

import { serve } from "https://deno.land/std@0.220.1/http/server.ts"

const TELEGRAM_BOT_TOKEN = "8533260639:AAGG808iuSgKU5wYEQVByNmTFAyPezvkUK0"
const TELEGRAM_CHAT_ID = "-8276882723"
const SITE_URL =  'https://atdar.uz'

function escapeHtml(v: string) {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ru-RU").format(amount) + " so'm";
}

serve(async (req) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error("Telegram configuration is missing in environment variables")
    }

    const payload = await req.json()
    const { record, old_record, type } = payload

    let text = ""
    const listingId = record.id
    const listingUrl = `${SITE_URL}/products/${listingId}`
    const checkerUrl = `${SITE_URL}/moderator/${listingId}`

    if (type === 'INSERT') {
      text = [
        "🆕 <b>Yangi e'lon joylandi!</b>",
        "",
        `Nomi: <b>${escapeHtml(record.name)}</b>`,
        `Narxi: <b>${formatCurrency(record.price)}</b>`,
        `Kategoriya: <b>${escapeHtml(record.category || '-')}</b>`,
        `Manzil: <b>${escapeHtml(record.location || '-')}</b>`,
        "",
        `🔗 <a href="${checkerUrl}">Checker panelda ko'rish</a>`,
      ].join("\n")
    } else if (type === 'UPDATE') {
      // Check if status changed
      if (record.status !== old_record.status) {
        const statusEmoji = record.status === 'approved' ? '✅' : (record.status === 'rejected' ? '❌' : '⏳');
        const statusText = record.status === 'approved' ? 'Tasdiqlandi' : (record.status === 'rejected' ? 'Rad etildi' : 'Kutilmoqda');
        
        text = [
          `${statusEmoji} <b>E'lon holati o'zgardi</b>`,
          "",
          `Nomi: <b>${escapeHtml(record.name)}</b>`,
          `Yangi holat: <b>${statusText}</b>`,
          record.rejection_reason ? `Sabab: <i>${escapeHtml(record.rejection_reason)}</i>` : "",
          "",
          `🔗 <a href="${listingUrl}">Saytda ko'rish</a>`,
        ].filter(line => line !== "").join("\n")
      } else {
        // Other updates, skip notification or handle differently
        return new Response(JSON.stringify({ message: "No relevant changes" }), { status: 200 })
      }
    }

    if (text) {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      })

      const result = await response.json()
      if (!result.ok) {
        console.error("Telegram API error:", result)
        throw new Error(`Telegram error: ${result.description}`)
      }
    }

    return new Response(JSON.stringify({ ok: true }), { 
      headers: { "Content-Type": "application/json" },
      status: 200 
    })
  } catch (error) {
    console.error("Function error:", error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      headers: { "Content-Type": "application/json" },
      status: 400 
    })
  }
})
