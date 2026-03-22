"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  MessageSquare,
  Paperclip,
  X,
  Bot,
  User,
  Loader2,
  ExternalLink,
  Link,
  FileText,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewsArticle, ChatMessage } from "@/lib/types";
import { getFlagEmoji } from "@/lib/countries";
import { cn, formatTimeAgo } from "@/lib/utils";

const CHAT_STORAGE_KEY = "omniview-chat-history";

interface AiChatProps {
  articles: NewsArticle[];
  provider?: string | null;
}

function loadChatHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveChatHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-100)));
  } catch {
    // storage full, ignore
  }
}

export function AiChat({ articles, provider }: AiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadChatHistory());
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedArticles, setAttachedArticles] = useState<NewsArticle[]>([]);
  const [showArticlePicker, setShowArticlePicker] = useState(false);
  const [articleSearch, setArticleSearch] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [customText, setCustomText] = useState("");
  const [showCustomInput, setShowCustomInput] = useState<"url" | "text" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persist chat history
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() && attachedArticles.length === 0 && !customUrl && !customText) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      attachedArticles:
        attachedArticles.length > 0 ? [...attachedArticles] : undefined,
      timestamp: new Date().toISOString(),
    };

    // Add context about custom inputs to the message content
    let enrichedContent = userMsg.content;
    if (customUrl) {
      enrichedContent += (enrichedContent ? "\n\n" : "") + `Analyze this article: ${customUrl}`;
    }
    if (customText) {
      enrichedContent += (enrichedContent ? "\n\n" : "") + `Analyze this article text:\n${customText}`;
    }
    userMsg.content = enrichedContent || "Analyze the attached content for neutrality and bias.";

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachedArticles([]);
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          articles: userMsg.attachedArticles,
          provider: provider ?? undefined,
          customArticleUrl: customUrl || undefined,
          customArticleText: customText || undefined,
        }),
      });

      const data = await res.json();
      setCustomUrl("");
      setCustomText("");
      setShowCustomInput(null);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-err-${Date.now()}`,
            role: "assistant",
            content: `Error: ${data.error}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: data.message,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: "Connection error. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, attachedArticles, messages, provider, customUrl, customText]);

  const addArticle = (article: NewsArticle) => {
    if (!attachedArticles.find((a) => a.id === article.id)) {
      setAttachedArticles((prev) => [...prev, article]);
    }
    setShowArticlePicker(false);
    setArticleSearch("");
    inputRef.current?.focus();
  };

  const removeArticle = (id: string) => {
    setAttachedArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.source.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.country.toLowerCase().includes(articleSearch.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <MessageSquare className="h-4 w-4 text-cyan-400" />
        <h2 className="text-sm font-semibold">AI Analysis Chat</h2>
        <span className="ml-auto text-[10px] text-zinc-500 hidden sm:inline">
          Analyze articles for neutrality & bias
        </span>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="h-7 w-7 p-0 text-zinc-600 hover:text-red-400"
            title="Clear chat history"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-600">
            <Bot className="h-10 w-10" />
            <p className="text-sm text-center">Ask me about any article or topic.</p>
            <div className="flex flex-wrap justify-center gap-2 text-[10px] text-zinc-700">
              <span className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" /> Attach articles
              </span>
              <span className="flex items-center gap-1">
                <Link className="h-3 w-3" /> Paste URL
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" /> Paste text
              </span>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2 sm:gap-3",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                <Bot className="h-4 w-4 text-cyan-400" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[90%] sm:max-w-[80%] rounded-xl px-3 sm:px-4 py-3",
                msg.role === "user"
                  ? "bg-blue-600/20 text-zinc-100"
                  : "bg-zinc-800/50 text-zinc-200"
              )}
            >
              {/* Attached articles */}
              {msg.attachedArticles && msg.attachedArticles.length > 0 && (
                <div className="mb-2 space-y-1.5">
                  {msg.attachedArticles.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 rounded-lg bg-zinc-900/50 px-2.5 py-1.5 text-[11px]"
                    >
                      <span>{getFlagEmoji(a.countryCode)}</span>
                      <span className="truncate font-medium">{a.title}</span>
                      <span className="shrink-0 text-zinc-500 hidden sm:inline">{a.source}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                {msg.content}
              </div>
              <span className="mt-1 block text-[10px] text-zinc-600">
                {formatTimeAgo(msg.timestamp)}
              </span>
            </div>
            {msg.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                <User className="h-4 w-4 text-blue-400" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
              <Bot className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="rounded-xl bg-zinc-800/50 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Custom article input */}
      {showCustomInput === "url" && (
        <div className="border-t border-zinc-800 px-3 sm:px-4 py-2">
          <div className="flex items-center gap-2">
            <Link className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Paste article URL for neutrality analysis..."
              className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-cyan-500/50"
              autoFocus
            />
            <button
              onClick={() => { setShowCustomInput(null); setCustomUrl(""); }}
              className="text-zinc-600 hover:text-zinc-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {customUrl && (
            <p className="mt-1 text-[10px] text-cyan-400/70">
              AI will analyze this article for bias, neutrality, and manipulation.
            </p>
          )}
        </div>
      )}

      {showCustomInput === "text" && (
        <div className="border-t border-zinc-800 px-3 sm:px-4 py-2">
          <div className="flex items-start gap-2">
            <FileText className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-2" />
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste article text for neutrality analysis..."
              className="flex-1 min-h-[60px] max-h-[120px] resize-none rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-cyan-500/50"
              autoFocus
            />
            <button
              onClick={() => { setShowCustomInput(null); setCustomText(""); }}
              className="text-zinc-600 hover:text-zinc-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {customText && (
            <p className="mt-1 text-[10px] text-cyan-400/70">
              AI will rate objectivity 0-100 and identify loaded language & framing.
            </p>
          )}
        </div>
      )}

      {/* Attached articles preview */}
      {attachedArticles.length > 0 && (
        <div className="border-t border-zinc-800 px-3 sm:px-4 py-2">
          <div className="flex flex-wrap gap-1.5">
            {attachedArticles.map((a) => (
              <Badge
                key={a.id}
                variant="outline"
                className="gap-1.5 pr-1 text-[10px]"
              >
                {getFlagEmoji(a.countryCode)} {a.title.slice(0, 30)}...
                <button
                  onClick={() => removeArticle(a.id)}
                  className="rounded p-0.5 hover:bg-zinc-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Article picker dropdown */}
      {showArticlePicker && (
        <div className="border-t border-zinc-800 bg-zinc-900">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search articles..."
              value={articleSearch}
              onChange={(e) => setArticleSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-cyan-500/50"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredArticles.slice(0, 15).map((a) => (
              <button
                key={a.id}
                onClick={() => addArticle(a)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-zinc-800 transition-colors"
              >
                <span>{getFlagEmoji(a.countryCode)}</span>
                <span className="min-w-0 flex-1 truncate">{a.title}</span>
                <span className="shrink-0 text-zinc-500 hidden sm:inline">{a.source}</span>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 text-zinc-600 hover:text-cyan-400"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </button>
            ))}
            {filteredArticles.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-zinc-600">
                No articles match your search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-zinc-800 p-2 sm:p-3">
        <div className="flex items-end gap-1.5 sm:gap-2">
          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowArticlePicker(!showArticlePicker)}
              className={cn(
                "h-9 w-9 p-0",
                showArticlePicker && "bg-cyan-500/20 text-cyan-400"
              )}
              title="Attach articles"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomInput(showCustomInput === "url" ? null : "url")}
              className={cn(
                "h-9 w-9 p-0",
                showCustomInput === "url" && "bg-cyan-500/20 text-cyan-400"
              )}
              title="Paste article URL"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomInput(showCustomInput === "text" ? null : "text")}
              className={cn(
                "h-9 w-9 p-0",
                showCustomInput === "text" && "bg-cyan-500/20 text-cyan-400"
              )}
              title="Paste article text"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about articles, neutrality, or investment signals..."
            className="min-h-[36px] max-h-[120px] flex-1 resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-cyan-500/50"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || (!input.trim() && attachedArticles.length === 0 && !customUrl && !customText)}
            size="sm"
            className="shrink-0 h-9 w-9 p-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
