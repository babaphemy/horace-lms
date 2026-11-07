import { LabDefinition } from "./types"
import { slugify } from "./security-plus/factory"

export const trackLabDefinitions: LabDefinition[] = [
  // ----------------------------------------------------
  // Robotics Systems Integration
  // ----------------------------------------------------
  {
    slug: slugify("Map a safe pick-and-place workcell"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 45,
    objective:
      "Identify robot workcell boundaries, safety zones, and sensor interlocks.",
    prerequisites: [
      "Basic programming confidence",
      "Comfort reading simple wiring diagrams",
    ],
    tools: ["controls", "forms"],
    steps: [
      {
        id: "step-1",
        title: "Define workcell envelope",
        instructions:
          "Identify the reach envelope, operator access points, and emergency stop positions.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Configure proximity & light curtain sensors",
        instructions:
          "Set detection thresholds and interlock triggers to halt motion on intrusion.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Verify safety compliance artifact",
        instructions:
          "Attach link to your workcell schematic and zone safety checklist.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Workcell safety map", "Sensor interlock test report"],
    rubric: [
      {
        id: "safety-spec",
        label: "Safety compliance",
        description:
          "Emergency stop triggers and physical workcell boundaries are fully defined.",
      },
      {
        id: "sensor-mapping",
        label: "Sensor integration",
        description:
          "Sensors are correctly mapped to halt motion when tripped.",
      },
      {
        id: "documentation",
        label: "Documentation",
        description: "Clear diagrams and rationale for sensor placement.",
      },
    ],
    skills: ["Sensor integration"],
  },
  {
    slug: slugify("Wire and test a simulated proximity sensor"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 60,
    objective:
      "Connect analog and digital sensor signals to motion controllers and test response times.",
    prerequisites: ["Comfort reading simple wiring diagrams"],
    tools: ["controls", "network"],
    steps: [
      {
        id: "step-1",
        title: "Sensor signal calibration",
        instructions:
          "Adjust debounce filters and analog voltage scaling for clean proximity triggers.",
        evidence: "tool-result",
      },
      {
        id: "step-2",
        title: "Implement control loop logic",
        instructions:
          "Program controller interrupts when sensor status transitions from low to high.",
        evidence: "note",
      },
      {
        id: "step-3",
        title: "Document control test log",
        instructions:
          "Submit test recordings or telemetry log verifying zero false positives.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Sensor calibration table", "Controller logic log"],
    rubric: [
      {
        id: "control-logic",
        label: "Control logic",
        description:
          "Motion controller responds accurately within specified latency bounds.",
      },
      {
        id: "signal-quality",
        label: "Signal stability",
        description:
          "Debounce and threshold logic eliminates noise and ghost trips.",
      },
    ],
    skills: ["Control logic"],
  },
  {
    slug: slugify("Program a line-following routine"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 60,
    objective:
      "Implement PID control logic for closed-loop motion guidance along high-contrast tracks.",
    prerequisites: ["Basic programming confidence"],
    tools: ["controls"],
    steps: [
      {
        id: "step-1",
        title: "Tune proportional & derivative gains",
        instructions:
          "Iterate P and D constants to prevent oscillation on 90-degree corners.",
        evidence: "tool-result",
      },
      {
        id: "step-2",
        title: "Debug error recovery states",
        instructions:
          "Program scan routine for line re-acquisition when trajectory is lost.",
        evidence: "note",
      },
      {
        id: "step-3",
        title: "Submit code and benchmark telemetry",
        instructions:
          "Provide repository or simulator link showing run completion within time limit.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Tuned PID controller code", "Benchmark run telemetry"],
    rubric: [
      {
        id: "debugging-skill",
        label: "Debugging & optimization",
        description:
          "Oscillation and tracking errors are systematically diagnosed and tuned.",
      },
      {
        id: "execution",
        label: "Course completion",
        description: "Robot finishes the test course without derailment.",
      },
    ],
    skills: ["Debugging"],
  },
  {
    slug: slugify("Submit a portfolio-ready mini workcell"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 90,
    objective:
      "Deliver a documented, integrated robotic handling workflow with safety interlocks.",
    prerequisites: ["All preceding robotics track modules"],
    tools: ["controls", "forms"],
    steps: [
      {
        id: "step-1",
        title: "End-to-end integration",
        instructions:
          "Combine sensor inputs, controller state machine, and physical safety guards.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Conduct safety stress test",
        instructions:
          "Simulate emergency halt during full-speed trajectory and measure stop distance.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Publish portfolio project artifact",
        instructions:
          "Provide public demonstration link (video, repo, or web simulator).",
        evidence: "file-link",
      },
    ],
    deliverables: [
      "Full workcell specification",
      "Safety validation test notes",
      "Demo video link",
    ],
    rubric: [
      {
        id: "safety-tests",
        label: "Safety tests",
        description:
          "Emergency stop and boundary violations halt arm motion within safety margins.",
      },
      {
        id: "system-integration",
        label: "System integration",
        description:
          "Sensors, control logic, and actuators function in an autonomous cycle.",
      },
    ],
    skills: [
      "Safety tests",
      "Sensor integration",
      "Control logic",
      "Debugging",
    ],
  },
  {
    slug: slugify("Calibrate a simulated line-following robot"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 45,
    objective:
      "Free preview lab: tune sensor thresholds and verify robot line adherence.",
    prerequisites: ["Laptop with a modern browser"],
    tools: ["controls"],
    steps: [
      {
        id: "step-1",
        title: "Calibrate optical reflectance thresholds",
        instructions:
          "Adjust black vs white detection values for ambient light conditions.",
        evidence: "tool-result",
      },
      {
        id: "step-2",
        title: "Test simulated track run",
        instructions:
          "Verify robot stays on the test track for 3 full continuous loops.",
        evidence: "note",
      },
      {
        id: "step-3",
        title: "Record calibration notes",
        instructions:
          "Attach calibration notes and screenshot of successful test run.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Calibration values", "Test run screenshot"],
    rubric: [
      {
        id: "sensor-tuning",
        label: "Sensor integration",
        description:
          "Thresholds accurately distinguish between surface and guide line.",
      },
      {
        id: "control-responsiveness",
        label: "Control logic",
        description: "Steering corrections keep the robot centered on track.",
      },
    ],
    skills: ["Sensor integration", "Control logic"],
  },

  // ----------------------------------------------------
  // Applied AI Product Builder
  // ----------------------------------------------------
  {
    slug: slugify("Write a user-value brief"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 45,
    objective:
      "Turn a real business workflow challenge into a testable, prompt-driven AI feature.",
    prerequisites: ["Basic JavaScript or Python"],
    tools: ["forms"],
    steps: [
      {
        id: "step-1",
        title: "Problem statement and KPI definition",
        instructions:
          "Specify the exact user pain point, manual cost, and desired AI output format.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Design prompt structure and role constraints",
        instructions:
          "Formulate system instructions, input placeholders, and tone guidelines.",
        evidence: "note",
      },
      {
        id: "step-3",
        title: "Submit user-value brief artifact",
        instructions: "Attach link to structured product brief document.",
        evidence: "file-link",
      },
    ],
    deliverables: ["AI Product Brief", "System Prompt Specification"],
    rubric: [
      {
        id: "prompt-design",
        label: "Prompt design",
        description:
          "System prompt contains clear role, constraints, formatting rules, and edge-case guardrails.",
      },
    ],
    skills: ["Prompt design"],
  },
  {
    slug: slugify("Build a prompt test matrix"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 60,
    objective:
      "Connect AI API endpoints and execute batch evaluations across positive and adversarial test sets.",
    prerequisites: ["Comfort using APIs"],
    tools: ["network", "forms"],
    steps: [
      {
        id: "step-1",
        title: "Configure API connection & model parameters",
        instructions:
          "Set temperature, max tokens, and timeout handling for the LLM API.",
        evidence: "tool-result",
      },
      {
        id: "step-2",
        title: "Run test matrix against 10 distinct cases",
        instructions:
          "Feed baseline queries, boundary conditions, and prompt injection attempts.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Submit test results sheet",
        instructions:
          "Provide spreadsheet or json log of prompt execution outputs.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Test matrix results table", "API integration script link"],
    rubric: [
      {
        id: "api-integration",
        label: "API integration",
        description:
          "API calls handle authentication, rate limits, and structured JSON parsing robustly.",
      },
    ],
    skills: ["API integration"],
  },
  {
    slug: slugify("Launch a support assistant prototype"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 60,
    objective:
      "Implement automated evaluation criteria to score response accuracy and tone against ground truth.",
    prerequisites: ["API integration basics"],
    tools: ["forms", "network"],
    steps: [
      {
        id: "step-1",
        title: "Set up rubric scoring engine",
        instructions:
          "Configure automated or human-in-the-loop scoring for relevance, accuracy, and brevity.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Conduct blind evaluation",
        instructions:
          "Compare prompt revisions A vs B on identical ticket sets.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Publish prototype URL",
        instructions:
          "Provide live demo link or video walkthrough of the triage assistant.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Prototype demo URL", "Comparative evaluation score sheet"],
    rubric: [
      {
        id: "evaluation",
        label: "Evaluation",
        description:
          "Evaluation metrics are objective, reproducible, and measure regression across iterations.",
      },
    ],
    skills: ["Evaluation"],
  },
  {
    slug: slugify("Submit an evaluated AI assistant"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 90,
    objective:
      "Package a complete AI product with user testing notes, trade-off analysis, and error boundaries.",
    prerequisites: ["Completed prototype and evaluation"],
    tools: ["forms"],
    steps: [
      {
        id: "step-1",
        title: "User testing observation sessions",
        instructions:
          "Observe 3 users interacting with the assistant and record failure modes.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Implement fallback & escalation UI",
        instructions:
          "Design confidence threshold trigger that hands off to a human agent.",
        evidence: "note",
      },
      {
        id: "step-3",
        title: "Portfolio case study submission",
        instructions:
          "Attach portfolio case study link detailing prompt iterations, eval scores, and UX learnings.",
        evidence: "file-link",
      },
    ],
    deliverables: [
      "Portfolio case study",
      "Live prototype link",
      "User test synthesis",
    ],
    rubric: [
      {
        id: "ux-testing",
        label: "UX testing",
        description:
          "Product workflow addresses user hesitation, clarifies AI limitations, and offers easy exit.",
      },
      {
        id: "prompt-design",
        label: "Prompt design",
        description:
          "System prompts are robust against jailbreaks and maintain brand voice.",
      },
    ],
    skills: ["UX testing", "Prompt design", "API integration", "Evaluation"],
  },
  {
    slug: slugify("Design an AI support triage prompt"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 30,
    objective:
      "Free preview lab: design an AI support triage prompt and evaluate output quality.",
    prerequisites: ["Browser with modern internet"],
    tools: ["forms"],
    steps: [
      {
        id: "step-1",
        title: "Draft system instructions",
        instructions:
          "Specify triage categories (Billing, Tech, General) and urgency levels (P1-P4).",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Test 3 sample customer tickets",
        instructions:
          "Validate classification accuracy on ambiguous customer inquiries.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Submit triage rubric score",
        instructions:
          "Attach prompt text and triage classifications for mentor feedback.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Triage system prompt", "Sample ticket evaluation"],
    rubric: [
      {
        id: "prompt-clarity",
        label: "Prompt design",
        description:
          "Categories are mutually exclusive and urgency rules are clear.",
      },
      {
        id: "eval-rigor",
        label: "Evaluation",
        description:
          "Edge-case ticket classifications are defended with sound reasoning.",
      },
    ],
    skills: ["Prompt design", "Evaluation"],
  },

  // ----------------------------------------------------
  // Gameplay Programming Foundations
  // ----------------------------------------------------
  {
    slug: slugify("Animate a controllable player sprite"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 45,
    objective:
      "Build a fixed timestep update/render loop with keyboard input handling.",
    prerequisites: ["Beginner programming knowledge"],
    tools: ["controls"],
    steps: [
      {
        id: "step-1",
        title: "Implement Delta-Time game loop",
        instructions:
          "Ensure movement speeds remain constant regardless of monitor refresh rate (60Hz vs 144Hz).",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Input state mapping",
        instructions:
          "Capture WASD / Arrow keys with instant responsiveness and diagonal normalization.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Submit playable sandbox link",
        instructions:
          "Provide browser link or repo showing player movement and animation state changes.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Game loop source code", "Browser sandbox demo"],
    rubric: [
      {
        id: "game-loop",
        label: "Game loops",
        description:
          "Fixed timestep loop decouples physics updates from rendering framerate cleanly.",
      },
    ],
    skills: ["Game loops"],
  },
  {
    slug: slugify("Build collectibles and hazards"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 60,
    objective:
      "Implement Axis-Aligned Bounding Box (AABB) collision detection and feedback triggers.",
    prerequisites: ["Basic player sprite setup"],
    tools: ["controls"],
    steps: [
      {
        id: "step-1",
        title: "AABB collision algorithm",
        instructions:
          "Calculate overlap on X and Y axes between player hitbox and entity hitboxes.",
        evidence: "tool-result",
      },
      {
        id: "step-2",
        title: "Collision response triggers",
        instructions:
          "Apply score increments for gems and health reduction + screen shake for spikes.",
        evidence: "note",
      },
      {
        id: "step-3",
        title: "Submit collision test video or repo",
        instructions:
          "Attach link demonstrating collision resolution without clipping or jitter.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Collision detection logic", "Interactive hazard level"],
    rubric: [
      {
        id: "collision",
        label: "Collision",
        description:
          "Hitboxes accurately reflect visuals with zero tunneling at high velocity.",
      },
    ],
    skills: ["Collision"],
  },
  {
    slug: slugify("Create a complete level loop"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 60,
    objective:
      "Build a finite state machine managing Title, Playing, Paused, Win, and GameOver scenes.",
    prerequisites: ["Collision and player movement"],
    tools: ["controls"],
    steps: [
      {
        id: "step-1",
        title: "Finite state machine structure",
        instructions:
          "Create State interface with enter, update, exit methods and clean transitions.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Win/loss condition triggers",
        instructions:
          "Trigger level completion upon collecting all items; trigger game over on zero lives.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Submit level playthrough artifact",
        instructions:
          "Attach build or video demonstrating complete state flow from menu to victory.",
        evidence: "file-link",
      },
    ],
    deliverables: ["State machine architecture", "Playthrough capture"],
    rubric: [
      {
        id: "state-machines",
        label: "State machines",
        description:
          "Scene transitions cleanly unload assets and reset variables without memory leaks.",
      },
    ],
    skills: ["State machines"],
  },
  {
    slug: slugify("Submit a portfolio-ready 2D game"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 90,
    objective:
      "Package a playable 2D game prototype with playtest session notes and polish.",
    prerequisites: ["Completed player, collision, and state modules"],
    tools: ["controls"],
    steps: [
      {
        id: "step-1",
        title: "Audio & visual feedback juice",
        instructions:
          "Add particle bursts, audio cues, and camera easing on key gameplay moments.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Playtesting feedback session",
        instructions:
          "Conduct 2 peer playtest sessions and record mechanical friction points.",
        evidence: "note",
      },
      {
        id: "step-3",
        title: "Publish playable game & portfolio entry",
        instructions:
          "Host playable web build (itch.io, Vercel, GitHub Pages) and attach link.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Playable game URL", "Playtest report", "GitHub repository"],
    rubric: [
      {
        id: "playtesting",
        label: "Playtesting",
        description:
          "Feedback from test players informed difficulty adjustments and mechanic tuning.",
      },
      {
        id: "code-quality",
        label: "Game loops & state",
        description:
          "Game architecture is modular, readable, and free of blocking bugs.",
      },
    ],
    skills: ["Playtesting", "Game loops", "Collision", "State machines"],
  },
  {
    slug: slugify("Tune a jump mechanic"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 35,
    objective:
      "Free preview lab: tune jump velocity, gravity scale, and coyote time in a browser sandbox.",
    prerequisites: ["No prior engine experience required"],
    tools: ["controls"],
    steps: [
      {
        id: "step-1",
        title: "Adjust jump impulse and gravity fall multiplier",
        instructions:
          "Tune parameters so ascent feels crisp and descent feels responsive.",
        evidence: "tool-result",
      },
      {
        id: "step-2",
        title: "Configure jump buffering & coyote time",
        instructions:
          "Add 100ms tolerance window for jumps right after walking off ledges.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Submit jump feel checklist",
        instructions:
          "Attach configuration parameters and test observation notes.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Jump parameters config", "Feel checklist notes"],
    rubric: [
      {
        id: "game-feel",
        label: "Game loops",
        description:
          "Jump controls feel intuitive, responsive, and predictable.",
      },
      {
        id: "playtesting",
        label: "Playtesting",
        description:
          "Coyote time and jump buffering eliminate common player timing frustrations.",
      },
    ],
    skills: ["Game loops", "Playtesting"],
  },

  // ----------------------------------------------------
  // Motion Animation Production
  // ----------------------------------------------------
  {
    slug: slugify("Improve a flat interface transition"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 45,
    objective:
      "Apply Disney 12 principles of animation (easing, anticipation, staging) to UI interactions.",
    prerequisites: ["Basic design tool familiarity"],
    tools: ["forms"],
    steps: [
      {
        id: "step-1",
        title: "Analyze linear vs bezier easing",
        instructions:
          "Replace static linear interpolation with cubic-bezier curves matching real physics.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Implement overshoot and settle timing",
        instructions:
          "Add subtle damping on modal expansion or drawer open animation.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Submit before & after video clip",
        instructions:
          "Attach side-by-side comparison recording of the improved transition.",
        evidence: "file-link",
      },
    ],
    deliverables: [
      "Before/after motion recording",
      "Cubic-bezier timing curves spec",
    ],
    rubric: [
      {
        id: "timing",
        label: "Timing",
        description:
          "Duration and acceleration curves direct user focus naturally without feeling sluggish.",
      },
    ],
    skills: ["Timing"],
  },
  {
    slug: slugify("Build a six-frame storyboard"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 60,
    objective:
      "Plan keyframes, choreography, and visual hierarchy for a product onboarding sequence.",
    prerequisites: ["Design tools familiarity"],
    tools: ["forms"],
    steps: [
      {
        id: "step-1",
        title: "Draft key poses and focal points",
        instructions:
          "Map the narrative beat of each frame from introduction to call-to-action.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Annotate camera, layer depth, and speed",
        instructions:
          "Specify motion vectors, scale factors, and alpha transitions between beats.",
        evidence: "note",
      },
      {
        id: "step-3",
        title: "Submit completed storyboard board",
        instructions: "Attach PDF or image board of the six keyframes.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Six-frame storyboard PDF", "Choreography director notes"],
    rubric: [
      {
        id: "storyboards",
        label: "Storyboards",
        description:
          "Visual progression clearly communicates sequence flow before production investment.",
      },
    ],
    skills: ["Storyboards"],
  },
  {
    slug: slugify("Ship a social-ready motion asset"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 70,
    objective:
      "Produce a high-fidelity 15-second animated clip with seamless looping and typography.",
    prerequisites: ["Storyboarding and timing principles"],
    tools: ["forms"],
    steps: [
      {
        id: "step-1",
        title: "Kinetic typography and shape morphing",
        instructions: "Animate text reveals in sync with accent graphics.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Loop continuity check",
        instructions:
          "Align the final frame's position and velocity with the opening frame for seamless replay.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Export video artifact and specs",
        instructions:
          "Attach link to rendered MP4 / WebM asset with optimization breakdown.",
        evidence: "file-link",
      },
    ],
    deliverables: ["High-res exported video file", "Loop benchmark notes"],
    rubric: [
      {
        id: "transitions",
        label: "Transitions",
        description:
          "Shape morphs and scene switches maintain visual momentum and zero seam artifacts.",
      },
    ],
    skills: ["Transitions"],
  },
  {
    slug: slugify("Submit a portfolio reel entry"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 90,
    objective:
      "Package motion work into a presentation reel with design decisions and critique iteration notes.",
    prerequisites: ["All preceding animation modules"],
    tools: ["forms"],
    steps: [
      {
        id: "step-1",
        title: "Synthesize mentor critique",
        instructions:
          "Document feedback received on earlier drafts and demonstrate explicit revisions.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Reel editing and pacing",
        instructions:
          "Cut multiple projects into a dynamic 45-second reel highlighting your strongest work first.",
        evidence: "note",
      },
      {
        id: "step-3",
        title: "Publish portfolio reel entry",
        instructions: "Attach live portfolio link or Vimeo/YouTube showcase.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Portfolio showcase link", "Critique response changelog"],
    rubric: [
      {
        id: "critique-response",
        label: "Critique response",
        description:
          "Revisions clearly reflect thoughtful application of mentor feedback.",
      },
      {
        id: "timing-transitions",
        label: "Timing & transitions",
        description:
          "Reel demonstrates mastery over rhythm, pacing, and visual polish.",
      },
    ],
    skills: ["Critique response", "Timing", "Storyboards", "Transitions"],
  },
  {
    slug: slugify("Animate a product onboarding transition"),
    domain: null,
    environment: "browser",
    estimatedMinutes: 40,
    objective:
      "Free preview lab: create a short transition, check timing against a rubric, and submit for critique.",
    prerequisites: ["Modern browser"],
    tools: ["forms"],
    steps: [
      {
        id: "step-1",
        title: "Storyboard 3-step onboarding flow",
        instructions:
          "Define Welcome, Setup, and Ready stages with consistent visual landmarks.",
        evidence: "note",
      },
      {
        id: "step-2",
        title: "Apply timing curve to card transition",
        instructions:
          "Adjust enter/exit curves to complete within 350ms without feeling abrupt.",
        evidence: "tool-result",
      },
      {
        id: "step-3",
        title: "Submit transition recording",
        instructions:
          "Attach screen capture or animated GIF of the onboarding flow.",
        evidence: "file-link",
      },
    ],
    deliverables: ["Transition screen capture", "Timing rationale note"],
    rubric: [
      {
        id: "timing",
        label: "Timing",
        description:
          "Animation feels snappy, functional, and guides learner attention.",
      },
      {
        id: "transitions",
        label: "Transitions",
        description:
          "Elements glide smoothly between states without visual pop or layout shift.",
      },
    ],
    skills: ["Timing", "Transitions"],
  },
]
