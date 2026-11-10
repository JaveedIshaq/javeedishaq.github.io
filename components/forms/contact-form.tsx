"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";
import * as z from "zod";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

const formSchema = z.object({
  name: z.string().trim().min(2, { message: "Please enter your name." }),
  email: z.string().trim().email("Please enter a valid email."),
  message: z
    .string()
    .trim()
    .min(10, { message: "Please write a little more (at least 10 characters)." }),
});

type FormValues = z.infer<typeof formSchema>;
type Status = { kind: "idle" | "sending" | "sent" | "error"; text?: string };

const inputClass =
  "w-full rounded-[10px] border border-input bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-[#7D8796] focus:border-primary focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });
  const { errors } = form.formState;

  // Validate synchronously so window.open runs inside the click (avoids popup blockers).
  function sendViaWhatsApp() {
    FocusManagerBlur();
    const parsed = formSchema.safeParse(form.getValues());
    if (!parsed.success) {
      void form.trigger();
      return;
    }
    const { name, email, message } = parsed.data;
    const text = `Hi Javeed, I'm ${name} — found you via javeedishaq.com.\n\n${message}\n\nEmail: ${email}`;
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setStatus({
      kind: "sent",
      text: "WhatsApp opened with your message — just tap Send there.",
    });
  }

  async function sendByEmail(values: FormValues) {
    FocusManagerBlur();
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: siteConfig.web3formsKey,
          subject: `Portfolio contact from ${values.name}`,
          from_name: "javeedishaq.com",
          replyto: values.email,
          ...values,
          botcheck: (document.getElementById("botcheck") as HTMLInputElement | null)?.checked ?? false,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || `HTTP ${res.status}`);
      form.reset();
      setStatus({ kind: "sent", text: "Thanks! Your message is in my inbox — I usually reply within a day." });
    } catch {
      setStatus({
        kind: "error",
        text: `Sorry, that didn't go through. Please email me directly at ${siteConfig.email} or use WhatsApp.`,
      });
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(sendByEmail)}
      noValidate
      className="flex flex-col gap-5"
      aria-describedby="form-status"
    >
      {/* Honeypot for bots — hidden from people and screen readers */}
      <input type="checkbox" id="botcheck" name="botcheck" className="hidden" tabIndex={-1} aria-hidden="true" />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input id="name" autoComplete="name" placeholder="Your name" className={inputClass} {...form.register("name")} />
        {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className={inputClass}
          {...form.register("email")}
        />
        {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="A role, a project, or a question — a few lines is plenty."
          className={cn(inputClass, "resize-y")}
          {...form.register("message")}
        />
        {errors.message && <p className="text-sm text-red-400">{errors.message.message}</p>}
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="button"
          onClick={sendViaWhatsApp}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <FaWhatsapp className="h-5 w-5" aria-hidden="true" /> Send via WhatsApp
        </button>
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-input px-5 font-medium transition-colors hover:border-muted-foreground disabled:opacity-60"
        >
          {status.kind === "sending" ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Mail className="h-5 w-5" aria-hidden="true" />
          )}
          {status.kind === "sending" ? "Sending…" : "Send by email"}
        </button>
      </div>

      <p
        id="form-status"
        role="status"
        aria-live="polite"
        className={cn(
          "min-h-[1.5rem] text-[15px]",
          status.kind === "sent" && "text-primary",
          status.kind === "error" && "text-red-400"
        )}
      >
        {status.text}
      </p>
    </form>
  );
}

/** Close the soft keyboard on mobile before submitting. */
function FocusManagerBlur() {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
}
