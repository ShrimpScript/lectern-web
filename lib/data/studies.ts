// Benchmark studies rendered at /studies. Generated from the committed run
// traces in the lectern repo (bench/studies/...); every number here is traceable
// to a metrics JSON produced by `lectern --metrics-out`.

export type ArmStats = { tokens: number; wallS: number; passed: number; runs: number };
export type StudyTask = {
  id: string; category: string; planSteps: number;
  single: ArmStats; conductor: ArmStats;
};
export type Study = {
  slug: string; title: string; date: string; model: string; cost: string;
  arms: string[]; reps: number;
  summary: {
    singlePass: number; singleRuns: number; conductorPass: number; conductorRuns: number;
    singleTokens: number; conductorTokens: number; singleWallS: number; conductorWallS: number;
  };
  tasks: StudyTask[]; finding: string; caveats: string[];
  links: { methodology: string; results: string; traces: string; harness: string };
};

export const studies: Study[] = [
{
  "slug": "free-models-single-vs-conductor",
  "title": "Single model vs the Conductor",
  "date": "2026-07-06",
  "model": "opencode/deepseek-v4-flash-free",
  "cost": "$0 \u2014 free tier only",
  "arms": [
    "single",
    "conductor"
  ],
  "reps": 2,
  "summary": {
    "singlePass": 16,
    "singleRuns": 16,
    "conductorPass": 16,
    "conductorRuns": 16,
    "singleTokens": 13993,
    "conductorTokens": 18524,
    "singleWallS": 7.4,
    "conductorWallS": 26.2
  },
  "tasks": [
    {
      "id": "cross-file-slug",
      "category": "cross-file",
      "planSteps": 3,
      "single": {
        "tokens": 14336,
        "wallS": 10.1,
        "passed": 2,
        "runs": 2
      },
      "conductor": {
        "tokens": 35732,
        "wallS": 43.1,
        "passed": 2,
        "runs": 2
      }
    },
    {
      "id": "dedup-list",
      "category": "feature",
      "planSteps": 1,
      "single": {
        "tokens": 13796,
        "wallS": 5.7,
        "passed": 2,
        "runs": 2
      },
      "conductor": {
        "tokens": 13887,
        "wallS": 22.4,
        "passed": 2,
        "runs": 2
      }
    },
    {
      "id": "fix-off-by-one",
      "category": "bugfix",
      "planSteps": 2,
      "single": {
        "tokens": 14220,
        "wallS": 10.7,
        "passed": 2,
        "runs": 2
      },
      "conductor": {
        "tokens": 21622,
        "wallS": 40.9,
        "passed": 2,
        "runs": 2
      }
    },
    {
      "id": "fizzbuzz",
      "category": "feature",
      "planSteps": 1,
      "single": {
        "tokens": 13830,
        "wallS": 5.8,
        "passed": 2,
        "runs": 2
      },
      "conductor": {
        "tokens": 13951,
        "wallS": 20.9,
        "passed": 2,
        "runs": 2
      }
    },
    {
      "id": "json-config",
      "category": "feature",
      "planSteps": 1,
      "single": {
        "tokens": 13891,
        "wallS": 6.9,
        "passed": 2,
        "runs": 2
      },
      "conductor": {
        "tokens": 13835,
        "wallS": 19.5,
        "passed": 2,
        "runs": 2
      }
    },
    {
      "id": "refactor-counter",
      "category": "refactor",
      "planSteps": 2,
      "single": {
        "tokens": 14194,
        "wallS": 8.7,
        "passed": 2,
        "runs": 2
      },
      "conductor": {
        "tokens": 21252,
        "wallS": 25.4,
        "passed": 2,
        "runs": 2
      }
    },
    {
      "id": "stack-class",
      "category": "feature",
      "planSteps": 1,
      "single": {
        "tokens": 13896,
        "wallS": 6.4,
        "passed": 2,
        "runs": 2
      },
      "conductor": {
        "tokens": 14152,
        "wallS": 20.6,
        "passed": 2,
        "runs": 2
      }
    },
    {
      "id": "temp-convert",
      "category": "feature",
      "planSteps": 1,
      "single": {
        "tokens": 13782,
        "wallS": 5.2,
        "passed": 2,
        "runs": 2
      },
      "conductor": {
        "tokens": 13761,
        "wallS": 16.8,
        "passed": 2,
        "runs": 2
      }
    }
  ],
  "finding": "On tasks a single call already solves, the Conductor adds no success and costs +32% tokens and ~3.5x wall time. The overhead tracks decomposition: +1% on single-step tasks, +84% on multi-step ones.",
  "caveats": [
    "No success headroom: the free model passes everything either way, so this measures the Conductor's cost, not its benefit.",
    "review_steps under-reports \u2014 the review runs on file-modifying tasks but emits no routing event; read review cost from the token delta.",
    "tool_calls/changes read 0 on the opencode backend (it edits in place); tokens and grading are accurate.",
    "2 repetitions on a free model \u2014 directional, not definitive."
  ],
  "links": {
    "methodology": "https://github.com/ShrimpScript/lectern/blob/main/bench/METHODOLOGY.md",
    "results": "https://github.com/ShrimpScript/lectern/blob/main/bench/studies/2026-07-06-free-models/RESULTS.md",
    "traces": "https://github.com/ShrimpScript/lectern/tree/main/bench/studies/2026-07-06-free-models/single-vs-conductor",
    "harness": "https://github.com/ShrimpScript/lectern/tree/main/bench"
  }
},
];

export type HardArm = { id: string; label: string; note: string; comparable: boolean; passed: number; runs: number; meanTokens: number | null; meanWallS: number };
export type HardStudy = { slug: string; title: string; date: string; arms: HardArm[]; headToHead: { id: string; raw: number; lectern: number }[]; findings: string[]; caveats: string[]; links: { results: string; traces: string } };

export const hardStudy: HardStudy = {
  "slug": "hard-tasks-lectern-vs-raw-agent",
  "title": "Harder tasks \u2014 Lectern vs the raw agent",
  "date": "2026-07-06",
  "arms": [
    {
      "id": "free-single",
      "label": "free single \u00d72",
      "note": "deepseek free tier",
      "comparable": true,
      "passed": 11,
      "runs": 12,
      "meanTokens": 15252,
      "meanWallS": 40.8
    },
    {
      "id": "free-conductor",
      "label": "free conductor \u00d72",
      "note": "deepseek free tier",
      "comparable": true,
      "passed": 11,
      "runs": 12,
      "meanTokens": 32655,
      "meanWallS": 76.7
    },
    {
      "id": "raw-claude",
      "label": "raw Claude Code",
      "note": "claude -p, no Lectern",
      "comparable": true,
      "passed": 6,
      "runs": 6,
      "meanTokens": 11557,
      "meanWallS": 34.4
    },
    {
      "id": "lectern-claude",
      "label": "Lectern + Claude Code",
      "note": "lectern run",
      "comparable": true,
      "passed": 6,
      "runs": 6,
      "meanTokens": 11671,
      "meanWallS": 35.1
    },
    {
      "id": "conductor-auto",
      "label": "Conductor, routed",
      "note": "Haiku/Sonnet per step",
      "comparable": false,
      "passed": 6,
      "runs": 6,
      "meanTokens": 4425,
      "meanWallS": 113.4
    }
  ],
  "headToHead": [
    {
      "id": "hard-api-shim",
      "raw": 10846,
      "lectern": 10785
    },
    {
      "id": "hard-csv-report",
      "raw": 10231,
      "lectern": 10385
    },
    {
      "id": "hard-fix-tests",
      "raw": 10236,
      "lectern": 10317
    },
    {
      "id": "hard-migration",
      "raw": 11367,
      "lectern": 11287
    },
    {
      "id": "hard-pipeline",
      "raw": 13530,
      "lectern": 13721
    },
    {
      "id": "hard-wordwrap",
      "raw": 13131,
      "lectern": 13529
    }
  ],
  "findings": [
    "Same tasks, same Claude Code subscription, with and without Lectern: 6/6 both, +1.0% tokens, same wall time. The engine layer \u2014 indexing, brain recall, session capture, the Apply pipeline \u2014 is effectively free on top of the agent it drives.",
    "The Conductor's per-step routing demonstrably fires: quick steps went to Haiku, the main step to Sonnet \u2014 two models inside one task, all six tasks passing fully routed.",
    "At this difficulty orchestration still shows cost, not success gain: strong single calls pass everything, so plan-and-review can only add overhead. Its success case needs task classes where single calls genuinely fail."
  ],
  "caveats": [
    "Cross-backend token totals are not comparable: Claude Code reports usage excluding prompt-cache reads; opencode reports fuller totals. The Conductor-routed arm's low token figure is a cache-accounting artifact \u2014 read its cost from wall time.",
    "Subscription arms ran once each (bounded deliberately); free arms twice. Directional, not definitive.",
    "One free-single run timed out at 240s (free-tier flakiness) and counts as a failure."
  ],
  "links": {
    "results": "https://github.com/ShrimpScript/lectern/blob/main/bench/studies/2026-07-06-hard-tasks/RESULTS.md",
    "traces": "https://github.com/ShrimpScript/lectern/tree/main/bench/studies/2026-07-06-hard-tasks"
  }
};
