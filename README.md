# IT Support Assistant Chatbot

Enterprise IT helpdesk chatbot built with Next.js 16 (App Router), Tailwind CSS v4, and Fuse.js.

## Features

- **Fuzzy search** across VDI, Phone, Scanner, and General IT knowledge bases using Fuse.js
- **Chat UI** with user/bot message bubbles, typing indicator, and related questions
- **Sidebar** with category navigation, popular issues, and recent searches
- **Escalation logic** — routes low-confidence queries to IT Helpdesk (helpdesk@company.com, Ext. 1234)
- **Accessible** — ARIA labels, keyboard navigation, sufficient color contrast

## Project Structure

```
app/              # Next.js App Router pages and layout
src/
  components/     # ChatBot UI component
  data/           # Static JSON knowledge bases (vdi, phone, scanner, general)
  lib/            # Search service (Fuse.js) and sanitize utilities
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm test` | Playwright e2e tests |
