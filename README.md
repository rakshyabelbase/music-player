# Aura — Premium Music Player

A production-quality music streaming UI built with React, TypeScript, Tailwind CSS, Framer Motion, Zustand, and the Web Audio API.

## Features

- Animated landing screen
- Sidebar & mobile navigation (Home, Search, Library, Playlists, Liked Songs)
- Music library grid with hover animations
- Full-screen now playing view with rotating album art
- Sticky bottom mini player with slide-up animation
- Play/pause, skip, shuffle, repeat controls
- Animated progress bar with seeking
- Volume control
- Queue drawer with upcoming tracks
- Synced lyrics panel
- Web Audio API frequency visualizer
- Search with debounced animated results
- Recently played & trending sections
- Loading skeletons, empty states, and error states

## Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Framer Motion**
- **Zustand** (persisted preferences)
- **Web Audio API** (AnalyserNode visualizer)
- **Lucide React** icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Audio

Demo tracks stream from [SoundHelix](https://www.soundhelix.com/) sample MP3s. Playback requires network access. Click anywhere after load to satisfy browser autoplay policies.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/   # UI, layout, music cards, player
  data/         # Mock catalog
  hooks/        # Audio, visualizer, lyrics
  pages/        # Route views
  store/        # Zustand player state
  types/        # TypeScript definitions
  utils/        # Helpers
```
