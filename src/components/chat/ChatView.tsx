"use client";

import { useCallback, useRef, useState } from "react";
import { Companion } from "@/components/companion/Companion";
import { getDictionary, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type Tone = "listen" | "reflect" | "challenge" | "practical";
interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function ChatView({ locale = "en" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const [tone, setTone] = useState<Tone>("listen");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [safetyFlag, setSafetyFlag] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async () => {
    const msg = input.trim();
    if (!msg || streaming) return;
    setInput("");
    setHistory((h) => [...h, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history,
          locale,
          tone,
          plan: "free",
          messagesSentToday: history.filter((m) => m.role === "user").length,
        }),
        signal: controller.signal,
      });
      if (!resp.body) throw new Error("no body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const evt of events) {
          const lines = evt.split("\n");
          const eLine = lines.find((l) => l.startsWith("event:"));
          const dLine = lines.find((l) => l.startsWith("data:"));
          if (!eLine || !dLine) continue;
          const name = eLine.slice(6).trim();
          const data = JSON.parse(dLine.slice(5).trim());
          if (name === "safety") {
            setSafetyFlag(Boolean(data.flagged));
          } else if (name === "token") {
            setHistory((h) => {
              const next = [...h];
              const last = next[next.length - 1];
              if (last && last.role === "assistant") {
                next[next.length - 1] = { ...last, content: last.content + data.text };
              }
              return next;
            });
          } else if (name === "error") {
            setHistory((h) => {
              const next = [...h];
              const last = next[next.length - 1];
              if (last && last.role === "assistant") {
                next[next.length - 1] = { ...last, content: "Something went wrong reaching Mira. Please try again." };
              }
              return next;
            });
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        // surface error in last assistant bubble
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, streaming, history, locale, tone]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col min-h-[calc(100vh-64px)]">
      {safetyFlag && (
        <div className="rounded-xl bg-amber/15 border border-amber/40 text-ink/85 px-4 py-3 text-sm">
          {t.chat.safety_banner}{" "}
          <a href="/safety" className="underline">{t.nav.safety}</a>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {history.length === 0 && (
          <div className="flex flex-col items-center text-center pt-16">
            <Companion size={120} />
            <p className="mt-6 text-ink/70">{t.chat.placeholder}</p>
          </div>
        )}
        {history.map((m, i) => (
          <div
            key={i}
            className={cn(
              "rounded-2xl px-4 py-3 max-w-[85%] whitespace-pre-wrap leading-relaxed",
              m.role === "user"
                ? "bg-ink text-paper ml-auto"
                : "bg-sage/15 mr-auto",
            )}
          >
            {m.content || (m.role === "assistant" && streaming ? t.chat.thinking : "")}
          </div>
        ))}
      </div>

      <div className="border-t border-ink/10 pt-3">
        <div className="flex gap-2 text-xs mb-2 flex-wrap">
          {(["listen", "reflect", "challenge", "practical"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setTone(opt)}
              className={cn(
                "rounded-full px-3 py-1 border transition",
                tone === opt ? "bg-ink text-paper border-ink" : "border-ink/20",
              )}
            >
              {t.tones[opt]}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="flex gap-2 items-end"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder={t.chat.placeholder}
            className="flex-1 resize-none rounded-2xl border border-ink/15 px-4 py-3 bg-paper focus:outline-none focus:border-ink/40"
            rows={2}
            disabled={streaming}
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="rounded-full bg-ink text-paper px-5 py-3 disabled:opacity-40"
          >
            {t.chat.send}
          </button>
        </form>
      </div>
    </div>
  );
}
