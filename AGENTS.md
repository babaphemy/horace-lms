# AGENTS.md

## Project

**Horace LMS** is a Next.js web app for learning management, courses, classroom content, checkout, user dashboards, LMS marketing pages, resources, and API docs.

Repository root: `horace-lms`.

## Goals

- Ship changes that match the existing App Router, TypeScript, Material UI, Tailwind, and local component patterns.
- Keep linting, type checking, and production builds green.
- Keep API, authentication, payment, and course-content behavior explicit and easy to verify.
- Avoid broad rewrites unless the user asks for them.

## Stack

- **Next.js 15** App Router, **React 18**, **TypeScript**
- **Material UI 7**, Emotion, Tailwind CSS, Sass
- **next-auth** for authentication
- **react-query v3**, SWR, React Hook Form, Yup, Zod
- Stripe and Paystack payment UI/helpers
- TipTap editor, PDF.js/React PDF, React Player
- Cypress is installed, but there are currently no E2E spec files in `cypress/e2e`.

## Important Paths

- Routes and layouts: `src/app/`
- API route handlers and client-facing API helpers: `src/app/api/`
- Shared app components: `src/components/`
- Course/classroom components: `src/components/courses/` and `src/components/classroom/`
- Hooks: `src/hooks/`
- Shared types: `src/types/`
- Course/lab/reference content: `docs/` and `labs.horace/`
- Static assets: `public/` and `src/assets/`

Do not place reusable type declarations under `src/app/@types`; folders prefixed with `@` inside `app/` are interpreted by Next.js as parallel route slots. Prefer `src/types/`.

## Commands

- `npm run dev` — start local development.
- `npm run build` — create a production Next.js build.
- `npm start` — serve a completed production build.
- `npm run check-lint` — run ESLint.
- `npm run check-types` — run TypeScript without emitting files.
- `npm run lint` — run Prettier in check mode.
- `npm run format` — run Prettier in write mode.
- `npm run cypress:open` — open Cypress.
- `npm run cypress:run` — run Cypress headlessly.

`npm test` currently points to `jest --watch`, but Jest is not installed in this project. Do not rely on it until a test runner is added or the script is updated.

## Validation

Before handing off code changes, run the smallest relevant set of checks. For most changes, use:

```bash
npm run check-lint
npm run check-types
npm run build
```

For formatting-only or docs-only changes, run:

```bash
npm run lint
```

If changing Cypress config or adding E2E specs, also run:

```bash
npm run cypress:run
```

The production build may warn that Browserslist data is old. That warning does not fail the build.

## API And Auth

- Environment-driven base URLs are defined in `src/app/api/setting.ts`.
- The main API helper surface is `src/app/api/rest.ts`.
- `fetchWithAuth` adds the next-auth bearer token when a session token exists.
- The next-auth route lives at `src/app/api/auth/[...nextauth]/route.ts`.
- Client-exposed environment variables must use `NEXT_PUBLIC_*`. Do not put secrets in `NEXT_PUBLIC_*` values.

## Conventions

- Prefer existing local patterns over introducing new abstractions.
- Prefer server components unless a component needs browser APIs, local state, effects, or client-only libraries.
- Keep edits scoped to the request and nearby code.
- Use existing MUI, Tailwind, styled component, and helper patterns already present in the touched area.
- Sanitize HTML before using `dangerouslySetInnerHTML`.
- Use structured parsing/helpers for structured data instead of ad hoc string manipulation when practical.
- Do not hand-edit generated artifacts or build output.
- Leave unrelated user changes alone.

## Deployment

The app is hosted on Vercel using the normal Next.js build flow. The `Dockerfile` is useful for self-hosting or container testing, but Vercel does not need it for a standard Next.js deployment.
