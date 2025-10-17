import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const summarizeArticle = async (text: string) => {
  const resp = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: `Summarize this text simply:\n\n${text}` }
    ],
    max_tokens: 100
  });
  const msg = resp.choices?.[0]?.message?.content;
  return msg || "";
};
