import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquareText,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  Calculator,
  RefreshCw,
  HardHat,
} from "lucide-react";
import { api } from "../services/api";
import { Project } from "../types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const DailyAssistant: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("proj-1");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-welcome",
      role: "assistant",
      content: `### Welcome to the Daily Site Operations Intelligence Assistant

I am calibrated with your active project schedule, concrete mix parameters, and site safety specifications.

**How I can assist your field operations today:**
* **Concrete Quantity & Pour Calculations:** Exact formulas, cubic yard conversion, batch transit times, and test cylinder requirements.
* **Brickwork & Mortar Estimation:** Modular brick counts, cutting allowances, and sand/cement volumetric ratios.
* **Work Sequencing & Hold Points:** Structural rebar inspection sign-offs, formwork strip times, and MEP rough-in clearances.
* **Cold/Hot Weather Pour Protocols:** Thermal blanket insulation, evaporation retarders, and hydration monitoring.

Select a preset calculation below or type your field question directly!`,
      timestamp: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsSending(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.chatAssistant(history, selectedProjectId);
      if (res.success && res.data) {
        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: res.data,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        alert(res.error?.message || "Failed to get assistant response.");
      }
    } catch (err: any) {
      console.error("Chat assistant error:", err);
      alert("Error communicating with assistant: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedPrompts = [
    "Calculate concrete volume for a 120ft x 60ft slab of 8-inch depth with 7% waste factor.",
    "What is the required rebar tension lap splice length for #6 bars in 4000 PSI concrete?",
    "Generate a daily pre-pour quality control checklist for Level 28 elevated deck.",
    "What precautions are required for crane operations when wind gusts exceed 25 mph?",
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <MessageSquareText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">Daily Site Assistant &amp; Quantity Engineering</h1>
              <span className="rounded-md bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                MODULE 5
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Project-aware operational engineering assistant with step-by-step quantity surveying math and site checklists.
            </p>
          </div>
        </div>

        {/* Project Context Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400">Context:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 focus:border-amber-500 focus:outline-hidden"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Prompts Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase shrink-0 flex items-center gap-1">
          <Calculator className="h-3.5 w-3.5 text-amber-500" />
          <span>Quick Math:</span>
        </span>
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-800 transition-colors shadow-2xs"
          >
            {prompt.length > 55 ? prompt.substring(0, 52) + "..." : prompt}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 bg-slate-50/60">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Assistant Active: <strong>{projects.find((p) => p.id === selectedProjectId)?.name || "General Site"}</strong></span>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: "m-reset",
                  role: "assistant",
                  content: "Conversation history cleared. How may I assist your site operations?",
                  timestamp: "Just now",
                },
              ])
            }
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${
                m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold shadow-2xs ${
                  m.role === "user"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-900 text-amber-400"
                }`}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`relative rounded-2xl p-4 text-xs shadow-2xs group leading-relaxed ${
                  m.role === "user"
                    ? "bg-slate-900 text-white rounded-tr-none font-medium"
                    : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none"
                }`}
              >
                {/* Content */}
                <div className="whitespace-pre-wrap font-sans">{m.content}</div>

                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    m.role === "user" ? "text-slate-400" : "text-slate-400"
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {m.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-slate-700"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex gap-3 items-center text-xs text-slate-500">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-amber-400">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
              <span className="animate-pulse">Engineering calculations in progress...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="border-t border-slate-200 bg-white p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question, request concrete/mortar calculations, or ask for sequencing guidance..."
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
