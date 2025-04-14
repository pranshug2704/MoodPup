# MoodPup 🐾

A simple web application where you can track your mood and see it reflected in a customizable digital pet!

## Features

*   **Mood Tracking:** Enter text describing how you feel.
*   **Emotion Analysis:** Basic sentiment analysis determines the mood (happy, sad, excited, calm, anxious, neutral).
*   **Digital Pet Display:** A customizable dog emoji reflects the current mood.
*   **Customization:** Change the dog's name, breed, accessories, and accent color via a side panel.
*   **Mood History:** View a simple, horizontally scrollable graph visualizing mood trends over time.
*   **Animation:** Basic idle animation for the selected dog breed and reaction animation on mood input.
*   **Persistence:** Customization settings are saved in `localStorage`.

## Tech Stack

*   **Framework:** React
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Emotion (CSS-in-JS)
*   **Animation:** Framer Motion
*   **Sentiment Analysis:** `sentiment` library

## Setup and Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pranshug2704/MoodPup.git
    cd MoodPup
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should be available at `http://localhost:5173` (or another port if 5173 is busy).

## Important Note on Environment

During development, we encountered persistent build issues related to CSS processing (specifically involving PostCSS and attempts to process Tailwind CSS even after removal). These issues were resolved by ensuring a clean environment and potentially relate to Node.js version compatibility.

It is strongly recommended to use a **Node.js LTS (Long-Term Support)** version (e.g., v20.x as of early 2025) for the most stable experience. If you encounter build errors, try:

*   Ensuring you are on an LTS Node version (use `nvm` to manage versions).
*   Performing a very clean install: `rm -rf node_modules && rm -f package-lock.json && npm cache clean --force && npm install`.

## Development

*   The main application logic is in `src/pages/MoodPupMain.tsx`.
*   Reusable UI elements are in `src/components/`.
*   State management hooks are in `src/hooks/`.
*   Utility functions (like emotion analysis) are in `src/utils/`.
