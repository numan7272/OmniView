import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export type ProviderId = "anthropic" | "openai" | "gemini";

export interface ProviderConfig {
  id: ProviderId;
  name: string;
  model: string;
  description: string;
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  anthropic: {
    id: "anthropic",
    name: "Claude (Anthropic)",
    model: "claude-sonnet-4-20250514",
    description: "Claude Sonnet 4 -- Best for nuanced analysis",
  },
  openai: {
    id: "openai",
    name: "ChatGPT (OpenAI)",
    model: "gpt-4.1",
    description: "GPT-4.1 -- Strong general reasoning",
  },
  gemini: {
    id: "gemini",
    name: "Gemini (Google)",
    model: "gemini-2.5-pro",
    description: "Gemini 2.5 Pro -- Fast and capable",
  },
};

function getActiveProvider(): ProviderId {
  const p = process.env.AI_PROVIDER as ProviderId | undefined;
  if (p && PROVIDERS[p]) return p;
  // Auto-detect based on which key is available
  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "your-anthropic-api-key-here") return "anthropic";
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your-openai-api-key-here") return "openai";
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your-gemini-api-key-here") return "gemini";
  return "anthropic";
}

export function getConfiguredProviders(): ProviderId[] {
  const configured: ProviderId[] = [];
  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== "your-anthropic-api-key-here") configured.push("anthropic");
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your-openai-api-key-here") configured.push("openai");
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your-gemini-api-key-here") configured.push("gemini");
  return configured;
}

// --- Anthropic ---
let anthropicClient: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

async function callAnthropic(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  maxTokens: number = 4096
): Promise<string> {
  const client = getAnthropic();
  const response = await client.messages.create({
    model: PROVIDERS.anthropic.model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  const block = response.content.find((c) => c.type === "text");
  return block?.type === "text" ? block.text : "";
}

// --- OpenAI ---
let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

async function callOpenAI(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  maxTokens: number = 4096
): Promise<string> {
  const client = getOpenAI();
  const response = await client.chat.completions.create({
    model: PROVIDERS.openai.model,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}

// --- Gemini ---
async function callGemini(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  _maxTokens: number = 4096
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  // Build conversation contents for Gemini
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" as const : "user" as const,
    parts: [{ text: m.content }],
  }));

  const response = await ai.models.generateContent({
    model: PROVIDERS.gemini.model,
    contents,
    config: {
      systemInstruction: systemPrompt,
    },
  });

  return response.text ?? "";
}

// --- Unified interface ---

export async function callAI(
  systemPrompt: string,
  messages: { role: "user" | "assistant"; content: string }[],
  options?: { maxTokens?: number; provider?: ProviderId }
): Promise<{ text: string; provider: ProviderId }> {
  const provider = options?.provider ?? getActiveProvider();
  const maxTokens = options?.maxTokens ?? 4096;

  const configured = getConfiguredProviders();
  if (!configured.includes(provider)) {
    throw new Error(
      `${PROVIDERS[provider].name} is not configured. Add ${provider === "anthropic" ? "ANTHROPIC_API_KEY" : provider === "openai" ? "OPENAI_API_KEY" : "GEMINI_API_KEY"} to .env.local`
    );
  }

  let text: string;
  switch (provider) {
    case "anthropic":
      text = await callAnthropic(systemPrompt, messages, maxTokens);
      break;
    case "openai":
      text = await callOpenAI(systemPrompt, messages, maxTokens);
      break;
    case "gemini":
      text = await callGemini(systemPrompt, messages, maxTokens);
      break;
  }

  return { text, provider };
}
