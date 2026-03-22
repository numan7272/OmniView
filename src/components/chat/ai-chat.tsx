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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsArticle, ChatMessage } from "@/lib/types";
import { getFlagEmoji } from "@/lib/countries";
import { cn, formatTimeAgo } from "@/lib/utils";

interface AiChatProps {
  articles: NewsArticle[];
}

export function AiChat({ articles }: AiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedArticles, setAttachedArticles] = useState<NewsArticle[]>([]);
  const [showArticlePicker, setShowArticlePicker] = useState(false);
  const [articleSearch, setArticleSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() && attachedArticles.length === 0) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      attachedArticles:
        attachedArticles.length > 0 ? [...attachedArticles] : undefined,
      timestamp: new Date().toISOString(),
    };

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
        }),
      });

      const data = await res.json();

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
  }, [input, attachedArticles, messages]);

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
        <span className="ml-auto text-[10px] text-zinc-500">
          Attach articles to analyze neutrality
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-zinc-600">
            <Bot className="h-10 w-10" />
            <p className="text-sm">Ask me about any article or topic.</p>
            <p className="text-xs text-zinc-700">
              Use <Paperclip className="inline h-3 w-3" /> to attach articles
              for cross-country neutrality analysis.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
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
                "max-w-[80%] rounded-xl px-4 py-3",
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
                      <span className="shrink-0 text-zinc-500">{a.source}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
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

      {/* Attached articles preview */}
      {attachedArticles.length > 0 && (
        <div className="border-t border-zinc-800 px-4 py-2">
          <div className="flex flex-wrap gap-1.5">
            {attachedArticles.map((a) => (
              <Badge
                key={a.id}
                variant="outline"
                className="gap-1.5 pr-1 text-[10px]"
              >
                {getFlagEmoji(a.countryCode)} {a.title.slice(0, 40)}...
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
                <span className="shrink-0 text-zinc-500">{a.source}</span>
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
      <div className="border-t border-zinc-800 p-3">
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowArticlePicker(!showArticlePicker)}
            className={cn(
              "shrink-0 h-9 w-9 p-0",
              showArticlePicker && "bg-cyan-500/20 text-cyan-400"
            )}
            title="Attach articles"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
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
            disabled={loading || (!input.trim() && attachedArticles.length === 0)}
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
