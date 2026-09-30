# Security+ SY0-701 — Lab & Playground Build Spec

Build the hands-on lab experience for the course seeded by
`campus/scripts/seed-security-plus.js`:

- **Course:** CompTIA Security+ SY0-701: Exam Prep & Job-Ready Labs
- **Remote course id:** `6abb354f7083e20f4ea9d4ac` (changes if the course is ever deleted and re-seeded)
- **Shape:** 7 modules, 53 lessons — 23 `TEXT`, 22 `ASSIGNMENT`, 8 `QUIZ`
- **Loaded by:** `GET /api/v1/course/lms/{cid}` → `topics[].lessons[]` (`LessonDto`: `id`, `tid`, `title`, `type`, `content`, `orderIndex`; **no `extension`, `video` or `assetKey`**)

This spec extends what already exists. Do not start a parallel lab system.

| Existing piece | Path | Keep / change |
| --- | --- | --- |
| Lab route | `src/app/(main)/course/lab/page.tsx` | Keep URL; resolve a lab definition from it |
| Lab workspace | `src/components/labs/LabWorkspace.tsx` | Refactor into the layout below |
| Lab helpers | `src/utils/labs.ts` | Extend (types, detection, keys) |
| Lesson renderer | `src/components/classroom/LessonContent.tsx` | Fix type handling (Part 1) |
| Curriculum sidebar | `src/components/classroom/ContentCard.tsx` | Uses `isHandsOnLesson` — gets fixed via Part 1 |
| Portfolio | `src/app/(main)/portfolio/page.tsx` | Reads lab submissions; keep compatible |

---

## Part 1 — Make the seeded lessons render correctly (do this first)

These are bugs today, independent of the playground.

1. **Every seeded lesson falls into the "File extension not recognized → Download File" branch.**
   `getContentType()` in `LessonContent.tsx` only looks at `video` and `extension`, and the seeded lessons have neither, so it returns `"unknown"`. The "Download File" button then links to the lesson's plain-text `content`.
   Fix: when there is no extension, fall back to `lesson.type`:
   - `TEXT` / `HTML` → existing `text` / `html` branch (`HTMLLesson`). Content is plain prose, which the sanitiser renders fine.
   - `ASSIGNMENT` → new `assignment` branch: render the brief (`content`) in a card, with the lab launch panel as the primary call to action.
   - `QUIZ` → new `quiz` branch (see item 3).

2. **Lab detection is keyword-guessing.** `isHandsOnLesson()` matches words like "build" and "implement" in any lesson content, so some `TEXT` lessons will show "Launch Lab" and some assignments may not.
   Fix: if `lesson.type` is set, decide on type alone — `ASSIGNMENT` ⇒ lab, `TEXT`/`QUIZ` ⇒ not a lab. Keep the keyword heuristic only for legacy lessons with no type. Add `"assignment"` to `LAB_TYPES`.

3. **The 8 `QUIZ` lessons have no quiz behind them.** The `quiz` collection has no documents for these lesson ids, so `GET course/quiz/bycourse/{cid}` returns nothing for them.
   Frontend: when `getQuizForLesson(lesson.id)` is found, keep the current behaviour (route to `/course/{cid}/{lessonId}`). When it is not found, render the lesson brief plus an empty state: *"Practice set not published yet — use the brief to self-test."* Don't block course completion on a quiz that doesn't exist.
   Backend follow-up (separate ticket): author `QuizContent` for each of the 8 lessons via `POST /api/v1/course/quiz/add` (`title`, `description`, `timeLimit`, `passingScore: 80`, `questions[]`).

4. **Lesson ids aren't stable across reseeds.** Re-running the seed script deletes and recreates every topic and lesson with new ids, which orphans progress, quiz scores and any local lab state keyed by `lessonId`. Don't reseed once learners are enrolled. The lab registry below is keyed by title, not id, so lab definitions survive a reseed.

---

## Part 2 — Lab definitions (static content, versioned in the frontend)

The backend lesson carries only the brief. Each lab's structured content — steps, tools, fixtures, rubric — lives in the frontend as typed data.

**Files**

```
src/data/labs/types.ts                    // LabDefinition and related types
src/data/labs/index.ts                    // registry + getLabDefinition()
src/data/labs/security-plus/*.ts          // one file per module (m1.ts … m7.ts)
src/data/labs/security-plus/fixtures/*    // scenario data (logs, packets, emails, certs…)
```

**Lookup.** `getLabDefinition(lessonTitle)` looks up by `slugify(lessonTitle)`. For example, `"Lab: Linux log triage"` becomes `lab-linux-log-triage`. If nothing matches, return `undefined`; the workspace then falls back to today's generic three checkpoints, so other courses keep working.

**Type**

```ts
export type LabEnvironment = "browser" | "local-vm" | "hybrid"

export interface LabDefinition {
  slug: string
  domain: 1 | 2 | 3 | 4 | 5 | null        // SY0-701 domain, null for capstone/career
  environment: LabEnvironment
  estimatedMinutes: number
  objective: string                       // one sentence, outcome-focused
  prerequisites: string[]                 // e.g. "Lab VM from Module 1"
  steps: LabStep[]                        // ordered; each is a checkpoint
  tools: PlaygroundToolId[]               // tabs shown in the playground pane
  fixtures?: Record<string, string>       // fixture ids passed to tools
  deliverables: string[]                  // what goes in the submission
  rubric: { id: string; label: string; description: string }[]
  skills: string[]                        // shown on portfolio + certificate
}

export interface LabStep {
  id: string
  title: string
  instructions: string                    // markdown, rendered with react-markdown
  evidence: "note" | "tool-result" | "file-link" | "none"
  autoCheck?: { tool: PlaygroundToolId; rule: string }  // see Part 4
}
```

---

## Part 3 — Workspace layout

Refactor `LabWorkspace.tsx` into a three-pane layout. On mobile, show the panes as tabs.

```
┌──────────────────────────────────────────────────────────────────────┐
│ Header: title · domain chip · environment chip · est. time · status  │
├──────────────┬──────────────────────────────────────┬────────────────┤
│ Steps        │ Playground (tabs, one per tool)      │ Checkpoints    │
│ 1 ✓ …        │                                      │ progress bar   │
│ 2 ● current  │   <active tool component>            │ rubric preview │
│ 3 …          │                                      │ deliverables   │
│ instructions │                                      │                │
├──────────────┴──────────────────────────────────────┴────────────────┤
│ Build log (notes) · artifact link · Save · Submit · Ask Mentor        │
└──────────────────────────────────────────────────────────────────────┘
```

- **`environment: "local-vm"`** labs show a "Runs in your lab VM" banner that links back to *Build a safe cybersecurity lab*. They have no playground tools. The workspace becomes steps, an evidence checklist and a submission form.
- **`hybrid`** labs show the banner *and* the browser tools, e.g. Wireshark runs locally but the IOC timeline is built in the browser.
- Keep the existing autosave, localStorage keys, submission shape (`LabSubmission`), portfolio link and Ask Mentor link. Add `skills` from the definition to the submission instead of the hard-coded three.
- Persist tool state per lab: `horace.lab.playground.{courseId}.{lessonId}.{toolId}`.
- Take `userId` from the session (`useSession`), not from the `?userId=` query param. Today anyone can edit the URL and write submissions under another user's key.

---

## Part 4 — Playground tools

All tools run entirely in the browser against bundled fixtures. **Nothing sends traffic to real hosts**: no port scanning, no fetching certificates from live servers, no sending email. Each tool is a client component in `src/components/labs/tools/`, is lazy-loaded with `next/dynamic` (`ssr: false`), and exposes:

```ts
interface ToolProps<S> {
  fixture?: unknown
  state: S
  onChange: (next: S) => void        // parent persists to localStorage
  onResult: (r: ToolResult) => void  // feeds checkpoint auto-checks
}
```

| Tool id | What the learner does | Build notes |
| --- | --- | --- |
| `hash` | Hash text or a dropped file (SHA-256/384/512), compare two digests, compute HMAC | `crypto.subtle.digest`; file via `react-dropzone`; files never leave the browser |
| `crypto` | AES-GCM encrypt/decrypt; generate ECDSA P-256 key pair; sign & verify | `crypto.subtle`; show base64 outputs; tampering one byte must visibly fail verification |
| `cert` | Paste or select a PEM chain; view subject, SANs, issuer, validity, signature algorithm; diagnose | Add `@peculiar/x509`. Fixtures: valid chain, expired leaf, hostname mismatch, missing intermediate |
| `packets` | Filterable table of pre-parsed packets; tag rows as IOCs; build a timeline | Fixture is JSON (not a raw pcap): `{ts, src, dst, proto, info}`. Real pcap work stays in local Wireshark |
| `logs` | Search/filter `auth.log`/syslog/Windows events; pivot counts by IP, user, event; flag findings | Simple query box (`field:value`, free text); `lodash` `groupBy` for pivots |
| `detection` | Write rules (field · operator · value, threshold, time window) and run them over a labelled event set | Show hits, false positives and missed malicious events. Auto-check: ≥1 true positive, 0 false positives on the "benign" set |
| `controls` | PBQ: classify scenario controls by category (managerial/operational/technical/physical) and function (preventive/detective/…) | Select-based grid (no drag-and-drop library). Graded against the fixture answer key; show why each wrong answer is wrong |
| `network` | Place assets in zones (user, server, mgmt, guest, DMZ) and write firewall rules; test "src → dst : port" | Rule table evaluated top-down with default deny. Auto-check: fixture assertions, e.g. `guest → server:445 = deny` |
| `iam` | Review a user/role/last-login export; mark keep / revoke / modify with a reason | Auto-check against expected: orphaned accounts, stale admins, separation-of-duty conflicts |
| `phishing` | Inspect raw headers and body; read the Received chain and SPF/DKIM/DMARC results; extract URLs; give a verdict | **Render email as plain text only**, never as HTML. Show extracted URLs defanged (`hxxps://example[.]com`) and not clickable |
| `tabletop` | Timed ransomware injects; the learner responds to each before the next one unlocks | Inject schedule comes from the fixture; the timer can be paused for classroom use |
| `forms` | Structured templates: vulnerability ticket, incident report, risk register (likelihood × impact heatmap), vendor review, 30-day plan | `react-hook-form` + zod schemas in `src/schema/labs/`; "Export as Markdown" copies to the build log |

**Fixture rules:** everything is fictitious. Use documentation IP ranges (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`), `example.com`/`example.org` domains, fake company "Northwind Clinic", and fake users. Include no real malware, live payloads or working credentials.

---

## Part 5 — Lab-by-lab mapping (all 22 `ASSIGNMENT` lessons)

| # | Lesson title (registry key) | Env | Tools | Auto-checked checkpoint |
| --- | --- | --- | --- | --- |
| M1 | Build a safe cybersecurity lab | local-vm | — | — (evidence: diagram link, isolation proof) |
| M1 | PBQ: select and layer security controls | browser | `controls` | ≥ 80% correct classifications |
| M2 | Lab: hash, encrypt, sign, and verify | hybrid | `hash`, `crypto` | Signature verified; tampered copy fails |
| M2 | Lab: certificate troubleshooting | browser | `cert`, `forms` | Correct diagnosis for the expired and mismatch fixtures |
| M3 | Lab: packet analysis with Wireshark | hybrid | `packets`, `forms` | ≥ 5 IOCs tagged, timeline ordered |
| M3 | Lab: vulnerability scan and remediation | local-vm | `forms` | — (evidence: scan before/after) |
| M3 | Job practical: write a vulnerability ticket | browser | `forms` | All required ticket fields valid |
| M4 | Lab: design a segmented small-enterprise network | browser | `network` | All fixture reachability assertions pass |
| M4 | Lab: backup and restore validation | hybrid | `hash`, `forms` | Pre-backup and post-restore hashes match |
| M5 | Lab: Linux log triage | browser | `logs`, `forms` | Brute-force source IP + compromised user identified |
| M5 | Lab: create SIEM detections | browser | `detection` | ≥ 3 rules; 0 false positives on benign set |
| M5 | Lab: IAM access review | browser | `iam` | All planted issues found |
| M5 | Automation and secure scripting | local-vm | — | — (evidence: repo link + secure-coding checklist) |
| M5 | Lab: phishing investigation | browser | `phishing`, `forms` | Correct verdict + spoofed sender identified |
| M5 | Lab: ransomware tabletop | browser | `tabletop`, `forms` | All injects answered; incident report complete |
| M6 | Lab: risk register and treatment plan | browser | `forms` | ≥ 8 risks scored, each with a treatment |
| M6 | Job practical: vendor security review | browser | `forms` | Questionnaire complete + recommendation |
| M6 | Security awareness campaign | browser | `forms` | — (evidence: campaign plan link) |
| M7 | Capstone: investigate a compromised company | browser | `logs`, `packets`, `phishing`, `forms` | Root cause + timeline + report (one shared fixture scenario) |
| M7 | Capstone: hardening and 30-day improvement plan | browser | `forms` | Plan has owner + metric on every item |
| M7 | Portfolio packaging and interview walkthrough | browser | — | Links ≥ 7 prior submissions (read from local submissions) |
| M7 | Targeted remediation sprint | browser | — | Lists objectives scoring < 80% (from quiz scores when available) |

Write each lab's `steps` from its lesson brief in the seed script; the brief lists the expected actions and deliverables. Example for *Lab: Linux log triage*:

1. Load `auth.log` fixture and scope the time window (`note`)
2. Find the source of the failed-login spike (`tool-result`, auto-check `logs`)
3. Identify the account that then logged in successfully (`tool-result`)
4. Record the evidence timeline and a containment recommendation (`note`)
5. Export the incident summary from `forms` and link it as the artifact (`file-link`)

---

## Part 6 — Delivery order

1. **Part 1 fixes.** The course becomes usable as a read-and-submit course.
2. Lab types, registry and workspace layout, with the generic fallback preserved.
3. `forms`, `controls` and `hash`. These unlock 12 of the 22 labs.
4. `logs`, `detection`, `iam`, `phishing` and `packets` (Domain 4 and the capstone).
5. `cert`, `crypto`, `network` and `tabletop`.
6. Mapping for all 22 labs, plus fixtures.

## Acceptance criteria

- No seeded lesson shows "File extension not recognized".
- Exactly the 22 `ASSIGNMENT` lessons show "Launch Lab" in the lesson view and the sidebar.
- `QUIZ` lessons with no quiz document show the empty state and don't block course completion.
- Each of the 22 labs opens with its own steps, tools and rubric. A lesson without a definition still opens the generic workspace.
- Tool state and notes survive a page reload. Submissions still appear on `/portfolio`.
- Opening the browser devtools Network tab while using any tool shows no requests beyond the app's own assets.
- `npm run validate` passes. Add Cypress specs for: rendering a seeded TEXT lesson, launching one browser lab, completing an auto-check, and submitting.

## Out of scope (later backend work)

- A lab submission and mentor review API. Submissions stay in localStorage as they do today; `LabWorkspace` already tells learners this.
- Quiz content for the 8 `QUIZ` lessons (Part 1, item 3).
- Hosted VMs or remote desktop. `local-vm` labs stay on the learner's own machine, per Module 1.
