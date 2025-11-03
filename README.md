# Snake Game

A modern take on the classic Snake game implemented with vanilla HTML, CSS, and JavaScript. Steer the snake, grab the food, and avoid colliding with the walls or your own tail as the pace quickens.

## Features

- Responsive canvas that plays nicely on desktop and mobile browsers
- Keyboard (arrow keys & WASD) and touch swipe controls
- Persistent high-score tracking via `localStorage`
- Restart button and end-of-game overlay
- Lightweight, dependency-free code base that can be deployed as static assets

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/snake-game.git
   cd snake-game
   ```

2. Open `index.html` in your favourite browser. That's it! No build steps required.

If you prefer to run the game from a local development server (which enables live reload in many editors), you can use any static server. For example, with Node.js installed:

```bash
npx http-server .
```

## Controls

| Action        | Keyboard             | Touch |
| ------------- | -------------------- | ----- |
| Move up       | Arrow Up / W         | Swipe up |
| Move down     | Arrow Down / S       | Swipe down |
| Move left     | Arrow Left / A       | Swipe left |
| Move right    | Arrow Right / D      | Swipe right |
| Restart game  | R key / Restart button | Tap restart / Play Again |

## Project structure

```
.
├── index.html     # App markup & canvas layout
├── styles.css     # UI styling
└── script.js      # Game logic and input handling
```

## Customisation tips

- Adjust the `tileCount`, `startingSpeed`, or `minimumSpeed` constants in `script.js` to tweak the difficulty curve.
- Replace the colours in `styles.css` to make the game match your preferred palette.
- Add new power-ups or obstacles by extending the `update` function in `script.js`.

## License

This project is released under the [MIT License](LICENSE). Feel free to remix and deploy your own version.
