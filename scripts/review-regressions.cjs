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
      submissions.map((s) => ({ ...s, trackId: "another-track" }))
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
  assert.equal(
    getTrackEligibility(
      track,
      submissions.map((s) => ({ ...s, courseId: "backend-course-uuid" }))
    ).eligible,
    true
  )
  assert.equal(
    getTrackEligibility(
      track,
      submissions.map((s) => ({
        ...s,
        courseId: "backend-course-uuid",
        trackId: track.id,
      }))
    ).eligible,
    true
  )
  assert.equal(
    getTrackEligibility(
      track,
      submissions.map((s) => ({ ...s, lessonTitle: "Unrelated lab" }))
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
const { getCheckpointStatus, isArtifactUrl, checkpointsReady } = load(
  path.join(root, "utils/labEvidence.ts")
)
assert.equal(isArtifactUrl("javascript:alert(1)"), false)
assert.equal(checkpointsReady([]), false)
assert.equal(checkpointsReady(["pending", "pending"]), false)
assert.equal(checkpointsReady(["recorded", "pending"]), false)
assert.equal(checkpointsReady(["recorded", "passed"]), true)
assert.equal(isArtifactUrl("not a link"), false)
assert.equal(isArtifactUrl("https://example.com/project"), true)
const note = { id: "note", evidence: "note" }
assert.equal(getCheckpointStatus(note, "   ", {}), "pending")
assert.equal(
  getCheckpointStatus(note, "Measured the sensor response at 12 ms.", {}),
  "recorded"
)
assert.equal(
  getCheckpointStatus({ evidence: "file-link" }, "invalid", {}),
  "pending"
)
assert.equal(
  getCheckpointStatus({ evidence: "file-link" }, "https://example.com", {}),
  "recorded"
)
const automatic = {
  evidence: "tool-result",
  autoCheck: { tool: "hash", rule: "match" },
}
assert.equal(
  getCheckpointStatus(
    automatic,
    "Manual evidence cannot bypass an automatic check.",
    {}
  ),
  "pending"
)
assert.equal(
  getCheckpointStatus(automatic, "", { hash: { rule: "other", passed: true } }),
  "pending"
)
assert.equal(
  getCheckpointStatus(automatic, "", {
    hash: { rule: "match", passed: false },
  }),
  "pending"
)
assert.equal(
  getCheckpointStatus(automatic, "", { hash: { rule: "match", passed: true } }),
  "passed"
)
console.log(
  "Passed: checkpoint evidence, artifact URLs and automatic-check isolation."
)
console.log(
  "Passed: four-track lab coverage, certificate eligibility, WAT dates and booking cutoff regressions."
)

const { mapSupportPlan } = load(path.join(root, "utils/supportPlan.ts"))
const plan = mapSupportPlan({
  slug: "unmentored-basic",
  features: [
    "No ads",
    "No setup fees",
    "No credit card required",
    { label: "Mentorship", included: false },
  ],
  prices: {},
  durationValue: 1,
  durationUnit: "MONTHS",
})
assert.equal(plan.features.length, 4)
assert.ok(plan.features.slice(0, 3).every((feature) => feature.included))
assert.equal(plan.features[3].included, false)

async function bookingRegressions() {
  const m = load(path.join(root, "utils/mentorship.ts"))
  const data = new Map()
  global.localStorage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  }
  global.window = { localStorage, dispatchEvent: () => {} }
  let lock = Promise.resolve()
  Object.defineProperty(global, "navigator", {
    configurable: true,
    value: {
      locks: {
        request: (_name, action) => {
          const result = lock.then(action)
          lock = result.catch(() => {})
          return result
        },
      },
    },
  })
  const track = skillTracks[0],
    mentor = track.mentors[0]
  const firstQuestion = {
    id: "question-1",
    userId: "learner",
    question: "First question",
    status: "Open",
  }
  const laterQuestion = {
    id: "question-2",
    userId: "learner",
    question: "New question",
    status: "Open",
  }
  localStorage.setItem(
    m.getAllMentorshipQuestionsKey(),
    JSON.stringify([laterQuestion, firstQuestion])
  )
  localStorage.setItem(
    m.getMentorshipQuestionsKey("learner"),
    JSON.stringify([laterQuestion, firstQuestion])
  )
  await m.answerMentorshipQuestion(firstQuestion.id, "Saved answer")
  const questions = m.readMentorshipItems(m.getAllMentorshipQuestionsKey())
  assert.equal(questions.length, 2)
  assert.equal(
    questions.find((question) => question.id === laterQuestion.id).status,
    "Open"
  )
  assert.equal(
    questions.find((question) => question.id === firstQuestion.id).answer,
    "Saved answer"
  )
  assert.equal(
    m.readMentorshipItems(m.getMentorshipQuestionsKey("learner"))[0].answer,
    "Saved answer"
  )
  for (const date of ["2026-10-26T12:00:00Z", "2027-12-30T12:00:00Z"]) {
    const now = Date.parse(date)
    const slots = m.getAvailableMentorSlots(mentor, [], undefined, now)
    assert.ok(slots.length > 0)
    assert.ok(
      slots.every((slot) => m.parseWatSlot(slot).getTime() > now + 12 * 3600000)
    )
  }
  const slots = m.getAvailableMentorSlots(mentor)
  const first = {
    id: "first",
    userId: "learner",
    trackId: track.id,
    mentorId: mentor.id,
    mentorName: mentor.name,
    slot: slots[0],
    status: "Booked",
  }
  const attempts = await Promise.allSettled([
    m.createBooking(first),
    m.createBooking({ ...first, id: "duplicate" }),
  ])
  assert.equal(
    attempts.filter((attempt) => attempt.status === "fulfilled").length,
    1
  )
  await m.createBooking({
    ...first,
    id: "later",
    userId: "another",
    slot: slots[1],
  })
  await assert.rejects(
    m.changeBooking(first.id, { type: "reschedule", slot: slots[1] })
  )
  await assert.rejects(
    m.changeBooking(first.id, {
      type: "reschedule",
      slot: "November 1, 2030, 3:00 AM WAT",
    })
  )
  await m.changeBooking(first.id, { type: "reschedule", slot: slots[2] })
  await m.changeBooking(first.id, {
    type: "meeting",
    url: "https://example.com/session",
  })
  await assert.rejects(
    m.changeBooking(first.id, { type: "meeting", url: "javascript:alert(1)" })
  )
  await assert.rejects(m.changeBooking(first.id, { type: "complete" }))
  await assert.rejects(
    m.changeBooking(
      first.id,
      { type: "cancel", reason: "wrong user" },
      "intruder"
    )
  )
  await m.changeBooking(
    first.id,
    { type: "cancel", reason: "cancel" },
    first.userId
  )
  const all = m.readMentorshipItems(m.getAllMentorshipBookingsKey())
  assert.equal(all.length, 2, "Newer bookings must survive updates")
  const changed = all.find((booking) => booking.id === first.id)
  assert.equal(
    changed.slot,
    slots[2],
    "Cancellation must preserve the latest slot"
  )
  assert.deepEqual(
    m.readMentorshipItems(m.getMentorshipBookingsKey(first.userId))[0],
    changed
  )
  await assert.rejects(
    m.changeBooking(first.id, { type: "reschedule", slot: slots[0] })
  )
  localStorage.setItem(
    m.getAllMentorshipBookingsKey(),
    JSON.stringify([{ ...first, slot: "September 9, 2026, 10:00 AM WAT" }])
  )
  await assert.rejects(
    m.changeBooking(first.id, { type: "cancel", reason: "past" })
  )
  console.log(
    "Passed: rolling availability, booking conflicts, fresh-state mutations, cutoff enforcement, meeting links and pricing flags."
  )
}
bookingRegressions().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
