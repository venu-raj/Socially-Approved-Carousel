# 🎥 Socially Approved Video Carousel

A high-performance video carousel inspired by the **Socially Approved** section from **driptrip.in**.

The project demonstrates how to efficiently render and manage **30–40 videos** while maintaining smooth scrolling and playback using lazy loading, virtualization techniques, Intersection Observer, and optimized React rendering.

---

# Demo

Frontend:
```
http://localhost:3000
```

Backend:
```
http://localhost:8000
```

---

# Features

## Frontend

### Outer Carousel

- Displays 30+ video cards smoothly
- Responsive layout
- Horizontal carousel (Desktop)
- Reel-style vertical feed (Mobile)
- Instant opening modal
- Smooth Framer Motion animations
- Lazy loaded thumbnails
- Optimized rendering

---

### Inner Carousel (Modal)

- Shows 3 preview videos
- Center video plays
- Side videos remain paused
- Swipe support
- Keyboard navigation
- Infinite navigation
- Smooth transitions

---

### Video Player

- Play / Pause
- Mute / Unmute
- Auto Play
- Auto Pause when hidden
- Replay on finish
- Loading Spinner
- Buffered loading
- Progress Bar
- Remaining duration

---

### User Interactions

- ❤️ Like
- 🔁 Share
- 📋 Copy Link

---

### Performance

- Lazy Loading
- Intersection Observer
- Virtualized rendering
- Only active videos mounted
- Memory optimized
- Videos removed from DOM when outside viewport
- Cached video metadata
- Smooth scrolling

---

# Folder Structure

```
project
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── lib
│   ├── store
│   ├── types
│
├── backend
│   ├── src
│   └──── db
│   └──── route
│
```

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- TailwindCSS v4
- Zustand
- Axios
- SWR
- Framer Motion
- Embla Carousel
- Lucide Icons
- Sonner

---

## Backend

- Express
- TypeScript
- PostgreSQL
- Drizzle ORM
- JWT
- bcrypt
- CORS
- Docker

---

## Database

- PostgreSQL

---

## Deployment Ready

- Docker
- Docker Compose
- Environment Variables

---

# Performance Optimizations

## Lazy Loading

Videos are not loaded until entering the viewport.

---

## Intersection Observer

Automatically

- Starts playback
- Pauses hidden videos
- Loads upcoming videos
- Removes videos leaving viewport

---

## DOM Optimization

Instead of rendering all videos simultaneously,

- Active Videos: 3
- Buffered Videos: 7

Maximum mounted video elements:

```
≈10
```

This significantly reduces

- GPU usage
- Memory usage
- CPU load

---

## React Optimizations

- memo()
- useMemo()
- useCallback()
- SWR Cache
- Zustand selectors

---

## Network Optimizations

- Metadata preload
- Thumbnail first
- Video fetched on demand
- Cached API responses

---

# Installation

## Clone Repository

```bash
download from github
```

# Frontend Setup

```
cd frontend
```

Install packages

```bash
npm install
```

Run

```bash
npm run dev
```

---

# Backend Setup

```
cd backend
```

Run

```bash
docker compose up --build
```

```bash
npx drizzle-kit push
```
---

# Environment Variables (optional)

## Backend

```
PORT=5000

DATABASE_URL=postgres://postgres:postgres@db:5432/carousel

JWT_SECRET=your_secret
```

---

## Frontend

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

# Docker

Start

```bash
docker compose up --build
```

Stop

```bash
docker compose down
```

Run detached

```bash
docker compose up -d
```

---


# Development Notes

The project focuses heavily on runtime performance while maintaining a smooth user experience.

Key optimizations include:

- Lazy video loading
- Intersection Observer
- Optimistic UI updates
- Video virtualization
- Buffered rendering
- Memory-efficient playback
- Responsive layout
- Cached API requests

These optimizations allow the application to handle **30–40 videos** without significant performance degradation while ensuring smooth scrolling and playback across desktop and mobile devices.



---

# API Reference

## Base URL

```
http://localhost:8000/api
```

---

## Endpoints

### Get All Videos

```http
GET /videos
```

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Videos per page |

#### Example

```http
GET /videos?page=1&limit=10
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "99f3c468-39c6-4239-9676-8ac26e34c09b",
      "title": "Amazing Tutorial",
      "description": "This is an amazing tutorial video",
      "videoUrl": "https://cdn.shopify.com/videos/c/o/v/700ab6303552439db98abf2a04d2d54d.mp4",
      "thumbnail": "https://cdn.shopify.com/videos/c/o/v/700ab6303552439db98abf2a04d2d54d.mp4",
      "likes": 3,
      "shares": 1,
      "comments": 0,
      "customerName": "John Doe",
      "customerTitle": "Senior Developer",
      "avatarUrl": "https://example.com/avatars/john.jpg",
      "createdAt": "2026-07-15T20:58:43.779Z",
      "updatedAt": "2026-07-15T22:49:34.108Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1
  }
}
```

---

### Get Video by ID

```http
GET /videos/:id
```

Example

```http
GET /videos/99f3c468-39c6-4239-9676-8ac26e34c09b
```

---

### Create Video

```http
POST /videos
```

Example Body

```json
{
  "title": "Amazing Tutorial",
  "description": "This is an amazing tutorial video",
  "videoUrl": "https://cdn.shopify.com/videos/c/o/v/700ab6303552439db98abf2a04d2d54d.mp4",
  "thumbnail": "https://cdn.shopify.com/videos/c/o/v/700ab6303552439db98abf2a04d2d54d.mp4",
  "customerName": "John Doe",
  "customerTitle": "Senior Developer",
  "avatarUrl": "https://example.com/avatars/john.jpg"
}
```

---

### Create Multiple Videos

```http
POST /videos/bulk
```

Example Body

```json
[
  {
    "title": "Video 1",
    "description": "Description",
    "videoUrl": "...",
    "thumbnail": "...",
    "customerName": "John Doe",
    "customerTitle": "Senior Developer",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  {
    "title": "Video 2",
    "description": "Description",
    "videoUrl": "...",
    "thumbnail": "...",
    "customerName": "Jane Doe",
    "customerTitle": "UI Designer",
    "avatarUrl": "https://example.com/avatar2.jpg"
  }
]
```

---

### Update Video

```http
PUT /videos/:id
```

Example

```http
PUT /videos/99f3c468-39c6-4239-9676-8ac26e34c09b
```

Example Body

```json
{
  "title": "Updated Tutorial",
  "likes": 10,
  "shares": 2
}
```

---

### Error Response

```json
{
  "success": false,
  "error": "Video not found"
}
```

or

```json
{
  "success": false,
  "error": "Invalid video ID format"
}
```