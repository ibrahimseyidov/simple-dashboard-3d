## Simple Dashboard 3D

A small 3D dashboard built with **React + TypeScript + Vite**, featuring:

- Designers management page with validation
- 3D editor page using `@react-three/fiber` and `drei`
- State management via Zustand
- Mock API with localStorage persistence
- Basic unit test for designer form validation

### Tech Stack

- **React** (latest)
- **TypeScript**
- **Vite**
- **react-router-dom**
- **Zustand**
- **@react-three/fiber** + **@react-three/drei**
- **react-hook-form** + **zod**
- **Vitest** for testing

### Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

### Scripts

- **`npm run dev`** – start development server
- **`npm run build`** – production build
- **`npm run preview`** – preview production build
- **`npm test`** – run unit tests (Vitest)

### Notes

- Data is stored in `localStorage` via the API layer (`src/api`).
- UI never touches `localStorage` directly.
- Default route is `/designers`. Use the top navigation to switch to the editor.
