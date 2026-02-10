"use client";

import { useState } from "react";

interface EntryComposerProps {
  onSubmit: (text: string) => Promise<void>;
  prompts: string[];
}

export function EntryComposer({ onSubmit, prompts }: EntryComposerProps) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    await onSubmit(text);
    setText("");
    setSubmitting(false);
  };

  return (
    <section className="rounded-2xl border border-stroke bg-card p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setText((prev) => (prev ? `${prev}\n${prompt}` : prompt))}
            className="rounded-full border border-stroke px-3 py-1 text-xs text-slate-300 transition hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            aria-label={`Use prompt: ${prompt}`}
          >
            {prompt}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            void submit();
          }
        }}
        rows={5}
        placeholder="Write about your day, your feelings, or one thing on your mind..."
        className="w-full rounded-xl border border-stroke bg-ink px-3 py-2 text-sm text-slate-100 placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        aria-label="Journal entry"
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted">Cmd/Ctrl + Enter to send</span>
        <button
          type="button"
          onClick={() => void submit()}
          disabled={submitting || !text.trim()}
          className="rounded-lg border border-slate-500 bg-slate-700 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          aria-label="Send journal entry"
        >
          Send
        </button>
      </div>
    </section>
  );
}
