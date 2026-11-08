# Mohammad Nurul Islam — Agent Cursor Portfolio

A React 18 + TypeScript + Vite portfolio source project using GSAP ScrollTrigger, Lenis smooth scrolling, Framer Motion, Geist / Geist Mono / Instrument Serif, and `vite-plugin-singlefile`.

## Run the React source

```bash
npm install
npm run dev
```

## Build the Vite project

```bash
npm run build
```

The Vite build is configured to emit a single-file `dist/index.html` with embedded application JS/CSS. Portrait and CV data are embedded in `src/assets.ts`, so the generated page does not need external image or PDF files.

## Current delivery note

`dist/index.html` in this delivery is a self-contained offline preview that was created and browser-checked separately. A full Vite build could not be executed in the creation environment because `npm install` did not complete (the package-registry request timed out). Run the commands above on a machine with npm registry access to generate the official Vite-compiled single-file output from the React source.

## Content and privacy

Professional resume content is centralized in `src/content.ts`. Sensitive identifiers and referee contact details are intentionally not published. Work cards are labelled as resume-derived work areas, not independently claimed products or external projects. The cursor agents are visual choreography only; no AI agents are running.

The portrait in `src/assets.ts` is a computer-vision background-removal result from the supplied photograph. The face pixels were not retouched or generated. Since the source photo has a light background and light clothing, inspect the transparent edge before public use.
