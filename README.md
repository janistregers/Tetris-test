# Welcome to My Tetris

## Task
The goal of this project was to create a full-featured Tetris implementation using pure JavaScript, strictly following the official Tetris Guidelines. The project focuses on game architecture, event-driven programming, and the separation of logic from rendering.

## Description
This implementation is built from the ground up without external libraries (except for `Math`). It features a robust game engine that handles:
- **Game Architecture:** Separated into Controller (input handling), Renderer (Canvas-based drawing), and Tetris Logic (core rules).
- **Playfield:** A 10x40 grid where only the bottom 20 rows are visible.
- **Tetriminos:** All 7 standard types (I, O, T, S, Z, J, L) with official colors and SRS (Super Rotation System).
- **Randomizer:** Implemented using the "7-bag" random generator system.
- **Features:** Hold piece functionality, ghost piece projection, and lock delay.
- **Audio:** Features the default "Korobeiniki" theme song and standard sound effects.

## Installation
To run this project locally, you will need Node.js to host the internal server provided in the task.

1. Clone the repository to your workspace.
2. Ensure you have the following files in the root directory:
   - `index.html`
   - `style.css`
   - `my_tetris.js`
   - `tetris_logic.js`
   - `renderer.js`
   - `controller.js`
   - `audio.js`
   - `html_server.js`

## Usage
1. Start the local server:
   ```bash
   node html_server.js


<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
