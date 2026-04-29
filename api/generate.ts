import Anthropic from "@anthropic-ai/sdk";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not set" }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const { prompt } = (await req.json()) as { prompt?: string };
    if (!prompt) {
      return new Response(JSON.stringify({ error: "missing prompt" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");

    return new Response(JSON.stringify({ text }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "unknown error" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
}
