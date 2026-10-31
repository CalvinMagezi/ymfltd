"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { PROJECTS } from "@/lib/content/projects";
import { CONTACT } from "@/lib/content/site";

const INTERESTS = ["Investing or lending", "Healthcare", "Hospitality or sport", "Education", "Farming and food", "Conservation", "Family member", "Something else"];

export default function EnquiryForm() {
  const params = useSearchParams();
  const pre = params.get("project");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("company")) return; // honeypot
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      setState(res.ok ? "sent" : "error");
      if (res.ok) e.currentTarget?.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-xl border border-line bg-card p-6">
        <p className="text-lg font-semibold">Thank you. Your message has been sent.</p>
        <p className="mt-1 text-muted">Ada Mugenyi or a member of the family will reply by email.</p>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-line bg-card px-3 py-2.5 text-[16px] outline-none focus:border-gold-strong";
  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-[15px] font-semibold">Your name
          <input id="name" name="name" required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1.5 text-[15px] font-semibold">Email
          <input id="email" name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="grid gap-1.5 text-[15px] font-semibold">Phone <span className="font-normal text-muted">(optional)</span>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
        <label className="grid gap-1.5 text-[15px] font-semibold">Organisation <span className="font-normal text-muted">(optional)</span>
          <input id="organisation" name="organisation" autoComplete="organization" className={field} />
        </label>
        <label className="grid gap-1.5 text-[15px] font-semibold">I am interested in
          <select id="interest" name="interest" className={field} defaultValue={INTERESTS[0]}>
            {INTERESTS.map((i) => <option key={i}>{i}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-[15px] font-semibold">Project <span className="font-normal text-muted">(optional)</span>
          <select id="project" name="project" className={field} defaultValue={pre ?? ""}>
            <option value="">The whole town</option>
            {PROJECTS.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </label>
      </div>
      <label className="grid gap-1.5 text-[15px] font-semibold">Message
        <textarea id="message" name="message" required rows={5} className={field} />
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
        {state === "error" && (
          <p role="alert" className="text-[15px]">
            The message could not be sent. Please email <span className="select-all font-semibold">{CONTACT.email}</span> instead.
          </p>
        )}
      </div>
    </form>
  );
}
