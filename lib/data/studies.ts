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
