export type SkillDomain = "Robotics" | "AI" | "Game Dev" | "Animation"
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced"
export type TrackDuration = "4-6 weeks" | "8-10 weeks" | "12+ weeks"

export interface TrackModule {
  title: string
  objective: string
  lab: string
  hours: number
}

export interface LearnerOutcome {
  label: string
  detail: string
  proof: string
}

export interface SkillTrack {
  id: string
  title: string
  domain: SkillDomain
  level: SkillLevel
  duration: TrackDuration
  mentorship: boolean
  price: string
  tier: string
  thumbnail: string
  outcome: string
  targetRole: string
  prerequisites: string[]
  skills: string[]
  previewLab: {
    title: string
    description: string
    estimate: string
  }
  modules: TrackModule[]
  outcomes: LearnerOutcome[]
  mentors: {
    name: string
    expertise: string
    responseTime: string
  }[]
}

export const skillTracks: SkillTrack[] = [
  {
    id: "robotics-systems-integration",
    title: "Robotics Systems Integration",
    domain: "Robotics",
    level: "Intermediate",
    duration: "12+ weeks",
    mentorship: true,
    price: "$249",
    tier: "Mentored Track",
    thumbnail: "/img/lms-banner.png",
    outcome: "Become job-ready in Robotics Systems Integration.",
    targetRole: "Junior Robotics Integration Technician",
    prerequisites: [
      "Basic programming confidence",
      "Comfort reading simple wiring diagrams",
      "Laptop with a modern browser",
    ],
    skills: [
      "Sensor integration",
      "Control logic",
      "Debugging",
      "Safety tests",
    ],
    previewLab: {
      title: "Calibrate a simulated line-following robot",
      description:
        "Tune sensor thresholds, run checkpoints, and document the robot behavior before a mentor review.",
      estimate: "45 minutes",
    },
    modules: [
      {
        title: "Robot Workcells and Safety",
        objective: "Identify robot cell components and risk controls.",
        lab: "Map a safe pick-and-place workcell",
        hours: 4,
      },
      {
        title: "Sensors and Actuators",
        objective: "Connect sensor signals to motion decisions.",
        lab: "Wire and test a simulated proximity sensor",
        hours: 6,
      },
      {
        title: "Control Logic",
        objective: "Build repeatable motion sequences with checkpoints.",
        lab: "Program a line-following routine",
        hours: 8,
      },
      {
        title: "Integration Project",
        objective: "Deliver a documented robotic handling workflow.",
        lab: "Submit a portfolio-ready mini workcell",
        hours: 10,
      },
    ],
    outcomes: [
      {
        label: "Portfolio project",
        detail: "Automated sorting workcell with test notes and demo video.",
        proof: "Verified by mentor rubric",
      },
      {
        label: "Completion signal",
        detail:
          "Certificate lists sensor calibration and control logic skills.",
        proof: "Issued after all labs pass",
      },
    ],
    mentors: [
      {
        name: "Amina Bello",
        expertise: "Industrial robotics, safety reviews",
        responseTime: "Within 24 hours",
      },
      {
        name: "Daniel Okoro",
        expertise: "Embedded control and diagnostics",
        responseTime: "Within 1 business day",
      },
    ],
  },
  {
    id: "applied-ai-product-builder",
    title: "Applied AI Product Builder",
    domain: "AI",
    level: "Beginner",
    duration: "8-10 weeks",
    mentorship: true,
    price: "$199",
    tier: "Mentored Track",
    thumbnail: "/img/lms-banner.png",
    outcome: "Ship a working AI assistant with measurable user value.",
    targetRole: "AI Product Associate",
    prerequisites: [
      "Basic JavaScript or Python",
      "Comfort using APIs",
      "A problem area to prototype around",
    ],
    skills: ["Prompt design", "API integration", "Evaluation", "UX testing"],
    previewLab: {
      title: "Design an AI support triage prompt",
      description:
        "Create a prompt, test three cases, and compare output quality against a rubric.",
      estimate: "30 minutes",
    },
    modules: [
      {
        title: "AI Use Case Framing",
        objective: "Turn a workflow problem into a testable AI feature.",
        lab: "Write a user-value brief",
        hours: 3,
      },
      {
        title: "Prompting and Guardrails",
        objective: "Create prompts that are specific, testable, and bounded.",
        lab: "Build a prompt test matrix",
        hours: 6,
      },
      {
        title: "API Prototype",
        objective: "Connect an AI API to a product workflow.",
        lab: "Launch a support assistant prototype",
        hours: 8,
      },
      {
        title: "Evaluation and Portfolio",
        objective: "Measure quality and explain tradeoffs clearly.",
        lab: "Submit an evaluated AI assistant",
        hours: 8,
      },
    ],
    outcomes: [
      {
        label: "Sample project",
        detail: "AI support triage assistant with eval report.",
        proof: "Linked demo and rubric score",
      },
      {
        label: "Career artifact",
        detail: "Case study explaining model behavior and product impact.",
        proof: "Published to learner portfolio",
      },
    ],
    mentors: [
      {
        name: "Ife Adeyemi",
        expertise: "AI prototyping and product strategy",
        responseTime: "Within 18 hours",
      },
    ],
  },
  {
    id: "gameplay-programming-foundations",
    title: "Gameplay Programming Foundations",
    domain: "Game Dev",
    level: "Beginner",
    duration: "8-10 weeks",
    mentorship: false,
    price: "$79",
    tier: "Self-Paced Labs",
    thumbnail: "/img/3.webp",
    outcome: "Build a playable 2D game loop from scratch.",
    targetRole: "Junior Gameplay Programmer",
    prerequisites: [
      "Beginner programming knowledge",
      "Interest in game mechanics",
      "No engine experience required",
    ],
    skills: ["Game loops", "Collision", "State machines", "Playtesting"],
    previewLab: {
      title: "Tune a jump mechanic",
      description:
        "Adjust movement variables and pass playability checkpoints in a browser sandbox.",
      estimate: "35 minutes",
    },
    modules: [
      {
        title: "Game Loop Basics",
        objective: "Explain update, render, and input cycles.",
        lab: "Animate a controllable player sprite",
        hours: 4,
      },
      {
        title: "Collision and Feedback",
        objective:
          "Make mechanics readable through hit detection and response.",
        lab: "Build collectibles and hazards",
        hours: 6,
      },
      {
        title: "States and Level Flow",
        objective: "Manage start, play, pause, win, and fail states.",
        lab: "Create a complete level loop",
        hours: 7,
      },
      {
        title: "Playable Prototype",
        objective: "Package a polished prototype with playtest notes.",
        lab: "Submit a portfolio-ready 2D game",
        hours: 8,
      },
    ],
    outcomes: [
      {
        label: "Project sample",
        detail: "Browser-playable 2D prototype with source link.",
        proof: "Public portfolio entry",
      },
      {
        label: "Skill proof",
        detail: "Completed checkpoints for collision and state handling.",
        proof: "Automated checkpoint log",
      },
    ],
    mentors: [],
  },
  {
    id: "motion-animation-production",
    title: "Motion Animation Production",
    domain: "Animation",
    level: "Intermediate",
    duration: "4-6 weeks",
    mentorship: true,
    price: "$149",
    tier: "Mentored Track",
    thumbnail: "/img/5.webp",
    outcome: "Create a polished animation reel for product and media teams.",
    targetRole: "Junior Motion Designer",
    prerequisites: [
      "Basic design tool familiarity",
      "Portfolio samples are helpful but not required",
      "Willingness to iterate from critique",
    ],
    skills: ["Timing", "Storyboards", "Transitions", "Critique response"],
    previewLab: {
      title: "Animate a product onboarding transition",
      description:
        "Create a short transition, check timing against a rubric, and submit for critique.",
      estimate: "40 minutes",
    },
    modules: [
      {
        title: "Motion Principles",
        objective: "Use timing and easing to guide attention.",
        lab: "Improve a flat interface transition",
        hours: 4,
      },
      {
        title: "Storyboard to Sequence",
        objective: "Turn a product moment into a clear animation plan.",
        lab: "Build a six-frame storyboard",
        hours: 5,
      },
      {
        title: "Production Polish",
        objective: "Refine movement, hierarchy, and export quality.",
        lab: "Ship a social-ready motion asset",
        hours: 7,
      },
      {
        title: "Reel Packaging",
        objective: "Present motion work with context and decisions.",
        lab: "Submit a portfolio reel entry",
        hours: 5,
      },
    ],
    outcomes: [
      {
        label: "Portfolio reel",
        detail: "Three short motion pieces with critique notes.",
        proof: "Mentor-reviewed submission",
      },
      {
        label: "Verified competency",
        detail: "Certificate highlights timing, transitions, and iteration.",
        proof: "Rubric-backed review",
      },
    ],
    mentors: [
      {
        name: "Maya Chen",
        expertise: "Product motion and visual storytelling",
        responseTime: "Within 24 hours",
      },
    ],
  },
]

export const domains: SkillDomain[] = [
  "Robotics",
  "AI",
  "Game Dev",
  "Animation",
]
export const levels: SkillLevel[] = ["Beginner", "Intermediate", "Advanced"]
export const durations: TrackDuration[] = [
  "4-6 weeks",
  "8-10 weeks",
  "12+ weeks",
]

export function getSkillTrack(id: string) {
  return skillTracks.find((track) => track.id === id)
}
