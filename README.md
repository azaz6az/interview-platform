# Interview Platform Delivery

> All project deliverables for the interview preparation platform

## Folder Structure

| Folder | Contents | How to Use |
|--------|----------|------------|
| **source-code** | Full platform source code | `cd source-code && npm install && npm run dev` |
| **dist** | Production build (ready to deploy) | Deploy to any static hosting service |
| **documents** | PRD + Architecture docs | Understand product design and tech decisions |
| **jd-resume-adapter-standalone** | Original standalone JD adapter | Reference only, integrated into platform |

## Quick Start (One-Click)

Double-click the batch files to start:

| Script | What it does | URL |
|--------|--------------|-----|
| **start-dev.bat** | Start dev server (auto install deps + open browser) | http://localhost:5173 |
| **start-preview.bat** | Preview production build (auto open browser) | http://localhost:8080 |
| **build.bat** | Rebuild production + copy to dist folder | - |

### Manual Start (Alternative)

Dev mode:
```bash
cd source-code && npm install && npm run dev
```

Preview:
```bash
cd dist && python -m http.server 8080
```

## Features

| Module | Description | Status |
|--------|-------------|--------|
| JD Resume Adapter | Upload resume(PDF/DOCX) + JD screenshot -> AI analysis | Done |
| AI Mock Interview | Pick position -> multi-round chat -> score feedback | Done |
| Voice Input | Mic button -> speech-to-text via Web Speech API | Done |
| Question Bank | 100 questions, categorized by position/difficulty | Done |
| Review Diary | Create reviews -> weakness analysis -> trend chart | Done |
| Dashboard | Home shortcuts + weakness widget | Done |

## Tech Stack

- Vite 5 + React 18 + MUI v5 + Tailwind CSS (tw prefix)
- React Router v6 + React Context + useReducer
- Recharts (radar chart, trend chart)
- Web Speech API (voice input)
- pdfjs-dist + mammoth (file parsing)
- localStorage (ip_ prefix)

## Responsive Design

- Desktop (>=960px): Left sidebar navigation
- Mobile (<960px): Bottom tab bar navigation

## Voice Input Tip

Use **Chrome** for the best speech recognition experience.

## Documents

- `documents/interview-platform-prd.md` - Product requirements
- `documents/interview-platform-architecture.md` - System architecture
