/* Blog posts as structured data (no MDX dependency). Body is an array of blocks
   rendered by the blog page. Add posts here. */
export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "why-an-engine-not-a-model",
    title: "Why we built an engine, not a model",
    date: "Jun 20, 2026",
    author: "The Lectern team",
    excerpt:
      "Coding agents are powerful but amnesiac and siloed. Lectern is the engine layer that gives any backend memory, skills, and adaptive context.",
    body: [
      { t: "p", text: "Every coding agent today is brilliant for ten minutes and then forgets your project. Tomorrow it re-learns the repo from zero, repeats yesterday's mistakes, and burns tokens doing it." },
      { t: "h2", text: "The fuel vs. the engine" },
      { t: "p", text: "You already pay for intelligence — a Claude Code subscription, an Antigravity workspace. That's the fuel. What's missing is the engine: the layer that remembers your codebase, learns how you work, and feeds the model exactly what it needs." },
      { t: "quote", text: "You bring the car. We're the V8." },
      { t: "p", text: "Because the engine sits above any backend, your memory and skills are portable — switch from Claude Code to a local model and nothing is lost. And it all runs locally: your code and keys never leave your machine." },
    ],
  },
  {
    slug: "never-lose-a-session-to-a-rate-limit",
    title: "Never lose a session to a rate limit",
    date: "Jun 6, 2026",
    author: "The Lectern team",
    excerpt:
      "Automatic, mid-session fallback: when one backend hits its limit, Lectern continues the same task on the next — no interruption.",
    body: [
      { t: "p", text: "Hitting a usage limit in the middle of a refactor is maddening. Lectern fixes it: when the active backend signals it's out of usage, we continue the exact same task on the next backend in your priority list." },
      { t: "h2", text: "How it works" },
      { t: "p", text: "Lectern owns the canonical session — the conversation, the plan, the pending diffs, the recalled memory. So we can rebuild the context for the next backend and pick up where you left off, with a quiet 'continued on Antigravity' marker. Idempotency keys make sure applied work is never repeated." },
    ],
  },
  {
    slug: "local-first-and-why-it-matters",
    title: "Local-first, and why it matters for your code",
    date: "May 22, 2026",
    author: "The Lectern team",
    excerpt: "Your repository is your most sensitive asset. Lectern runs on your machine; the cloud only ever sees encrypted blobs and counts.",
    body: [
      { t: "p", text: "Lectern is local-first by design. Indexing uses local embeddings, so building memory never fans your code out to a provider. Keys live in your system keychain." },
      { t: "h2", text: "What the cloud sees" },
      { t: "p", text: "Only two things, both opt-in: anonymous usage counts, and end-to-end-encrypted memory/skills blobs we cannot read. Never your source, prompts, or keys. We don't train on your code — ever." },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
