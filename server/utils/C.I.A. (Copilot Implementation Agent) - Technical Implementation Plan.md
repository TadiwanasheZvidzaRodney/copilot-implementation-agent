# C.I.A. (Copilot Implementation Agent) - Technical Implementation Plan

## Overview
C.I.A. is a Nuxt 3 application designed to generate structured, phased technical implementation plans from natural language project descriptions. It utilizes a text-based interface and leverages the Hugging Face Inference API (Serverless) to power its AI reasoning engine, keeping operational costs at zero while maintaining high-quality markdown outputs.

## Tech Stack
* **Framework:** Nuxt 3 (Vue.js)
* **Styling:** Tailwind CSS (Modern, minimalistic: Black, White, and Grey palette)
* **AI Backend:** Hugging Face Inference API (`@huggingface/inference`)
* **Model:** `meta-llama/Meta-Llama-3-8B-Instruct` (or equivalent open-weights reasoning model)
* **Markdown Parsing:** Nuxt Content or `marked` for frontend rendering

---

## Phase 1: Project Initialization & UI Scaffold

**Goal:** Set up the core Nuxt framework and build out the minimalistic frontend interface.

* [ ] **1.1 Nuxt Initialization:** * Run `npx nuxi@latest init cia-agent`.
    * Clean up default boilerplate.
* [ ] **1.2 Tailwind CSS Configuration:**
    * Install and configure `@nuxtjs/tailwindcss`.
    * Update `tailwind.config.js` to enforce the strict black, white, and grey color palette. Remove default vibrant colors if necessary to ensure brand consistency.
* [ ] **1.3 Base Layout & Components:**
    * Create a clean `app.vue` layout.
    * Build the primary input component: a large, borderless or subtly bordered text area for the user's project description.
    * Build a primary call-to-action button ("Generate Plan").
    * Implement loading skeletons (grey pulsing blocks) to display while the AI processes the request.

## Phase 2: Backend & Hugging Face Integration

**Goal:** Establish the server route and connect the Hugging Face SDK.

* [ ] **2.1 Environment Setup:**
    * Create a `.env` file at the root.
    * Add `HF_TOKEN=your_huggingface_access_token`.
* [ ] **2.2 SDK Installation:**
    * Run `npm install @huggingface/inference`.
* [ ] **2.3 Server Route Creation:**
    * Create `server/api/generate.ts`.
    * Initialize the `HfInference` client using the environment variable.
    * Set up the `defineEventHandler` to accept POST requests and read the body payload (`projectDescription`).

## Phase 3: The AI Engine (Prompt Engineering)

**Goal:** Lock in the system instructions to ensure deterministic, highly structured Markdown outputs from the LLM.

* [ ] **3.1 System Prompt Definition:**
    * Inside `server/api/generate.ts`, write a strict system prompt.
    * *Requirements:* The prompt must instruct C.I.A. to output *only* Markdown. It must enforce a specific phased structure (e.g., Phase 1: Setup, Phase 2: Core, Phase 3: Deployment). It must forbid conversational filler.
* [ ] **3.2 API Call Construction:**
    * Implement the `hf.chatCompletion` call.
    * Pass the system prompt and user description into the `messages` array.
    * Set `temperature: 0.2` or lower to prevent hallucinations and enforce strict formatting.
* [ ] **3.3 Error Handling:**
    * Wrap the call in a `try/catch` block. 
    * Return standard HTTP error codes (500) and fallback messages if the Hugging Face API times out.

## Phase 4: Frontend-Backend Orchestration

**Goal:** Connect the UI to the API and render the generated Markdown beautifully.

* [ ] **4.1 State Management:**
    * Use Nuxt's `useState` or standard Vue `ref`s to track `isLoading`, `markdownResult`, and `errorMessage`.
* [ ] **4.2 Fetch Logic:**
    * Create the submit handler on the frontend that triggers `$fetch('/api/generate', { method: 'POST', body: ... })`.
* [ ] **4.3 Markdown Rendering:**
    * Install a markdown parser (like `marked` or use `@nuxtjs/mdc`).
    * Create a display component that safely renders the returned Markdown string into HTML.
    * Apply Tailwind typography (`prose prose-invert` depending on light/dark mode) to style the generated headers, lists, and code blocks elegantly.

## Phase 5: Refinement & Polish

**Goal:** Ensure the app is production-ready, highly usable, and bug-free.

* [ ] **5.1 Edge Case Handling:**
    * Disable the "Generate" button if the text area is empty.
    * Handle cases where the LLM exceeds token limits (adjust `max_tokens` in the backend).
* [ ] **5.2 UX Iteration:**
    * Ensure transitions between the input state, loading skeleton state, and result state are smooth.
    * Add a "Copy to Clipboard" button for the generated implementation plan.
* [ ] **5.3 Deployment Preparation:**
    * Verify all environment variables are ready for the production environment.
    * Test local build using `npm run build` and `npm run preview`.