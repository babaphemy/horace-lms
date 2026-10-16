const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")
const root = path.resolve(__dirname, "../src")
const cache = new Map()

// Load the pure TypeScript utilities without adding a test runner dependency.
function load(filename) {
  if (cache.has(filename)) return cache.get(filename).exports
  const module = { exports: {} }
  cache.set(filename, module)
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText
  const localRequire = (name) => {
    if (!name.startsWith("@/") && !name.startsWith(".")) return require(name)
    const base = name.startsWith("@/")
      ? path.join(root, name.slice(2))
      : path.resolve(path.dirname(filename), name)
    const target = [base + ".ts", path.join(base, "index.ts")].find(
      fs.existsSync
    )
    if (!target) throw new Error(`Cannot resolve ${name}`)
    return load(target)
  }
  new Function("require", "module", "exports", code)(
    localRequire,
    module,
    module.exports
  )
  return module.exports
}

const { skillTracks } = load(path.join(root, "data/skillTracks.ts"))
const { getTrackEligibility } = load(
  path.join(root, "utils/trackEligibility.ts")
)
const { getLabDefinition } = load(path.join(root, "data/labs/index.ts"))
for (const track of skillTracks) {
  const submissions = track.modules.map((module, index) => ({
    id: String(index),
    courseId: track.id,
    lessonTitle: module.lab,
    status: "Reviewed",
    outcome: "Pass",
    skills: getLabDefinition(module.lab)?.skills || [],
  }))
  assert.ok(
    getLabDefinition(track.previewLab.title),
    `${track.id}: preview definition missing`
  )
  assert.equal(
    getTrackEligibility(track, submissions).eligible,
    true,
    `${track.id}: all projects should qualify`
  )
  assert.equal(
    getTrackEligibility(track, [submissions.at(-1)]).eligible,
    false,
    "Capstone alone must not qualify"
  )
  assert.equal(
    getTrackEligibility(track, submissions.slice(1)).eligible,
    false,
    "Missing module must not qualify"
  )
  assert.equal(
    getTrackEligibility(
      track,
      submissions.map((s) => ({ ...s, courseId: "another-track" }))
    ).eligible,
    false
  )
  assert.equal(
    getTrackEligibility(
      track,
      submissions.map((s) => ({ ...s, outcome: "Revise" }))
    ).eligible,
    false
  )
  assert.equal(
    getTrackEligibility(
      track,
      submissions.map((s) => ({ ...s, status: "Submitted" }))
    ).eligible,
    false
  )
}

const { parseWatSlot, canChangeMentorshipBooking, isFutureMentorshipSlot } =
  load(path.join(root, "utils/mentorship.ts"))
const slot = "October 20, 2026, 2:00 PM WAT"
const start = Date.parse("2026-10-20T13:00:00Z")
assert.equal(parseWatSlot(slot).getTime(), start)
assert.equal(parseWatSlot("February 30, 2026, 2:00 PM WAT"), null)
assert.equal(parseWatSlot("October 20, 2026, 13:00 PM WAT"), null)
assert.equal(isFutureMentorshipSlot(slot, start), false)
assert.equal(isFutureMentorshipSlot("tomorrow", start), false)
const booking = { slot, status: "Booked" }
assert.equal(
  canChangeMentorshipBooking(booking, 12, start - 12 * 3600000),
  true
)
assert.equal(
  canChangeMentorshipBooking(booking, 12, start - 12 * 3600000 + 1),
  false
)
assert.equal(
  canChangeMentorshipBooking(
    { ...booking, status: "Completed" },
    12,
    start - 24 * 3600000
  ),
  false
)
assert.equal(
  canChangeMentorshipBooking(
    { ...booking, status: "Cancelled" },
    12,
    start - 24 * 3600000
  ),
  false
)
console.log(
  "Passed: four-track lab coverage, certificate eligibility, WAT dates and booking cutoff regressions."
)
