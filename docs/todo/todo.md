# Horace LMS Repositioning — User Stories & Acceptance Criteria

### For: Hands-On Skill Acquisition, Practical Labs, and Mentorship/Training

---

## Epic 1: Skill Track Catalog & Discovery

**US-1.1 — Browse skill tracks**
As a prospective learner, I want to browse available skill tracks (not generic "courses"), so that I can find a program that matches the job role I'm targeting.

_Acceptance Criteria:_

- Given I visit `/courses` (or renamed `/tracks`), when the page loads, then I see a non-empty grid of skill tracks with title, target role/outcome, duration, and skill level.
- Each track card shows a thumbnail, 1-line outcome statement (e.g., "Become job-ready in Robotics Systems Integration"), and price/tier.
- Filters exist for: skill domain (Robotics, AI, Game Dev, Animation, etc.), skill level, duration, and whether mentorship is included.
- Clicking a track opens a detail page before any login/paywall.

**US-1.2 — View track curriculum before enrolling**
As a prospective learner, I want to see the full curriculum, project list, and prerequisites before I commit, so that I know exactly what hands-on work I'll do.

_Acceptance Criteria:_

- Track detail page lists modules in order, each with: learning objective, associated lab/project, and estimated hours.
- At least one sample/preview lab is accessible without enrolling.
- Prerequisites and target job outcomes are explicitly stated.

**US-1.3 — See proof of outcomes**
As a prospective learner, I want to see real learner portfolios, project samples, or placement stats for a track, so that I can trust the "job-ready" claim.

_Acceptance Criteria:_

- Track page includes a "Learner Outcomes" section with at least: sample project screenshots/links, and (if available) completion or placement stats.
- No outcome claim is displayed without a linked source project or testimonial.

---

## Epic 2: Hands-On Labs / Practical Workspace

**US-2.1 — Launch a lab from the course**
As an enrolled learner, I want to launch an interactive lab environment directly from a lesson, so that I can practice the skill without setting up local tools.

_Acceptance Criteria:_

- A "Launch Lab" button appears on any lesson tagged as hands-on.
- Clicking it opens a sandboxed workspace (embedded code editor, simulated tool, or guided environment appropriate to the domain) within 10 seconds.
- Learner's work-in-progress in the lab autosaves at least every 60 seconds.
- Learner can leave and resume the lab from the same state.

**US-2.2 — Get checkpoint feedback in a lab**
As a learner, I want the lab to check my progress at defined checkpoints, so that I know if I'm on the right track before finishing the whole project.

_Acceptance Criteria:_

- Each lab has 1+ checkpoints with pass/fail or rubric-based validation.
- Learner receives immediate automated feedback OR is flagged for mentor review at each checkpoint.
- Failed checkpoints show a hint or link to the relevant lesson content.

**US-2.3 — Submit a completed project**
As a learner, I want to submit my finished lab/project for review, so that I get credited toward track completion and can add it to my portfolio.

_Acceptance Criteria:_

- Submission requires learner to attach/link final work (file, repo, or in-platform artifact).
- Submission status is visible as: Submitted → In Review → Reviewed (Pass/Revise).
- On "Pass," the project is automatically added to the learner's portfolio page.

**US-2.4 — Instructor/mentor reviews a lab submission**
As a mentor, I want to review learner lab submissions against a rubric, so that I can give actionable, consistent feedback.

_Acceptance Criteria:_

- Mentor dashboard lists pending submissions sorted by track and due date.
- Review screen shows the rubric alongside the submission.
- Mentor can leave inline comments and select an overall Pass/Revise outcome.
- Learner is notified (in-app + email) when review is complete.

---

## Epic 3: Mentorship

**US-3.1 — View and select a mentor**
As a learner, I want to see mentor profiles (expertise, bio, availability), so that I can choose someone relevant to my track.

_Acceptance Criteria:_

- Each track shows a list of assigned/available mentors with photo, expertise tags, and short bio.
- Mentor profiles show average response time and rating (once reviews exist).

**US-3.2 — Book a mentorship session**
As a learner, I want to book a 1:1 or group mentorship session, so that I can get help beyond automated lab feedback.

_Acceptance Criteria:_

- Learner can view a mentor's open time slots and book one within the platform (no external tool required).
- Booking triggers a calendar invite/confirmation to both learner and mentor.
- Learner can cancel/reschedule up to a configurable cutoff (e.g., 12 hours before).

**US-3.3 — Async mentor Q&A**
As a learner, I want to ask my mentor a question tied to a specific lab or lesson, so that I get contextual help without waiting for a live session.

_Acceptance Criteria:_

- A "Ask Mentor" action is available on any lesson/lab, pre-filled with context (track, lesson, learner's current submission if any).
- Mentor sees the question in a queue tagged with that context.
- Learner is notified when the mentor responds; thread is preserved for future reference.

**US-3.4 — Track mentorship engagement (admin)**
As an admin, I want to see mentorship session volume and mentor load, so that I can staff mentors appropriately.

_Acceptance Criteria:_

- Admin dashboard shows sessions booked/completed per mentor per week.
- Alerts appear when a mentor's queue (Q&A or reviews) exceeds a configurable threshold.

---

## Epic 4: Job-Readiness & Portfolio

**US-4.1 — Auto-build a portfolio**
As a learner, I want completed, passed projects to automatically populate a shareable portfolio page, so that I have proof of skill for job applications.

_Acceptance Criteria:_

- Portfolio page auto-generates at a public/shareable URL once the learner has 1+ passed project.
- Each portfolio entry shows project title, skill tags, description, and link/preview of the work.
- Learner can toggle individual projects public/private.

**US-4.2 — Earn a skill-verified certificate**
As a learner, I want a certificate that reflects specific verified skills (not just "completed a course"), so that it carries more weight with employers.

_Acceptance Criteria:_

- Certificate is issued only after all required track projects are marked "Pass" by a mentor or validated checkpoint.
- Certificate lists the specific skills/competencies demonstrated, not just the track title.
- Certificate includes a verification link/QR code that resolves to a public validity page.

**US-4.3 — Track my job-readiness progress**
As a learner, I want a progress view showing which skills/competencies I've demonstrated vs. still need, so that I know how close I am to job-ready.

_Acceptance Criteria:_

- Learner dashboard shows a competency checklist per track (e.g., "Version control: ✅", "API integration: ⏳").
- Progress updates automatically as labs/projects are passed.

---

## Epic 5: Instructor/Admin Content Management

**US-5.1 — Create a hands-on lab**
As a course creator, I want to build a lab (instructions, starter files, checkpoints, rubric) within the platform, so that I don't need external tooling to publish practical content.

_Acceptance Criteria:_

- Lab creation flow lets admin define: instructions (rich text/markdown), starter environment/files, checkpoints, and a grading rubric.
- Lab can be attached to one or more lessons/tracks.
- Preview mode lets the creator test the lab exactly as a learner would experience it.

**US-5.2 — Use AI agent to draft lab content**
As a course creator, I want the existing AI Agent feature to help draft lab instructions and starter rubrics, so that I can produce practical content faster.

_Acceptance Criteria:_

- AI Agent can generate a first-draft lab (instructions + rubric) from a short prompt describing the target skill.
- Generated content is clearly marked as a draft requiring human review before publishing.

---

## Epic 6: Pricing & Positioning

**US-6.1 — Choose a learner-outcome-based plan**
As a prospective learner, I want pricing tiers framed around my learning outcome (self-paced labs vs. mentored career track), so that I can pick based on what I actually need.

_Acceptance Criteria:_

- Pricing page replaces admin-seat-based tiers with at least: (a) Self-Paced Labs, (b) Mentored Track, (c) Team/Corporate Upskilling.
- Each tier explicitly states whether mentorship, certification, and portfolio features are included.
- No tier language refers to "schools," "districts," or "student information management" on the learner-facing pricing page.

**US-6.2 — Corporate/team upskilling signup**
As a company L&D manager, I want to enroll a team into hands-on tracks and see aggregate progress, so that I can justify the training investment.

_Acceptance Criteria:_

- Admin can bulk-invite team members to specific tracks via email/CSV.
- Team dashboard shows per-member progress, completed labs, and certificates earned.
- Exportable report (CSV/PDF) summarizing team completion and skills gained.

---

## Suggested Delivery Sequence (MVP → Full)

1. **MVP:** Epic 1 (catalog) + Epic 2.1–2.3 (basic labs + submission) + Epic 4.1 (portfolio)
2. **V1:** Epic 3 (mentorship booking + Q&A) + Epic 2.4 (mentor review) + Epic 4.2 (certificates)
3. **V2:** Epic 5 (creator tooling + AI-assisted lab drafting) + Epic 6 (pricing/positioning overhaul) + Epic 4.3 (competency tracking) + Epic 3.4 (mentor ops dashboard)
