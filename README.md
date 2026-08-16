# Rubik's Cube Move Simulator V2.3

A terminal-based Rubik's Cube simulator written in C. It renders a colored 3x3 cube in the terminal, accepts standard cube notation, and includes a timer, move history, undo system, and a timed challenge (scramble) mode with best-score tracking.

## Features

- 🎨 **Colored terminal display** — each face is rendered with real background colors (white, yellow, green, blue, orange, red)
- ⏱️ **Solving timer** — starts automatically on your first move and stops when the cube is solved
- 📜 **Move history** — full log of every move performed in the session
- ↩️ **Undo system** — reverts the last move (and its effect on move count / timer)
- 🎲 **Challenge mode** — generates a 20-move random scramble and times you to a solve
- 🏆 **Best score tracking** — remembers your fastest / lowest-move challenge completion
- ✅ **Solved detection** — automatically detects and announces when the cube is solved

## Getting Started

### Prerequisites

- A C compiler (e.g. `gcc`)
- A terminal that supports ANSI color escape codes (most Linux/macOS terminals; Windows Terminal or WSL recommended on Windows)

### Build

```bash
gcc -o cube_simulator cube_simulator.c
```

### Run

```bash
./cube_simulator
```

## Usage

On launch, the simulator displays the help menu and a solved cube. Enter commands or moves at the prompt:

```
Move [1] > R U R' U'
```

You can enter multiple moves on one line, separated by spaces.

### Move Notation

Standard Rubik's Cube (Singmaster) notation is used. Each face can be turned clockwise, counter-clockwise (`'`), or 180 degrees (`2`):

| Face  | Clockwise | Counter-clockwise | 180° |
|-------|-----------|--------------------|------|
| Up    | `U`       | `U'`               | `U2` |
| Down  | `D`       | `D'`               | `D2` |
| Left  | `L`       | `L'`               | `L2` |
| Right | `R`       | `R'`               | `R2` |
| Front | `F`       | `F'`               | `F2` |
| Back  | `B`       | `B'`               | `B2` |

### Commands

| Command | Action |
|---------|--------|
| `S` | Show the current cube state |
| `H` | Show the help menu |
| `X` | Reset the cube, timer, and move history |
| `C` | Check whether the cube is solved |
| `G` | Start challenge mode (random scramble + timer) |
| `M` | Show move history |
| `UNDO` | Undo the last move |
| `BEST` | Show the best challenge time/move count |
| `Q` | Quit |

Commands are case-insensitive (e.g. `s` and `S` both work); moves are case-sensitive and must match standard notation exactly.

### Challenge Mode

Typing `G` resets the cube, applies a 20-move random scramble (avoiding consecutive turns of the same face), and starts a timer. Solve the cube using standard moves — the simulator automatically detects completion, reports your time and move count, and updates the best score if you beat your previous record. Check it anytime with `BEST`.

### Example Session

```
Move [1] > S              # show the cube
Move [1] > R U R' U'      # perform a sequence of moves
Move [5] > M               # view move history
Move [5] > UNDO            # undo the last move
Move [4] > C                # check if solved
Move [4] > G                 # start a timed challenge
Move [1] > ...solve it...
Move [1] > BEST              # view your best score
Move [1] > Q                  # quit
```

## How It Works

The cube is stored internally as a `char[6][3][3]` array — one 3x3 grid of characters per face (`W`, `Y`, `G`, `B`, `O`, `R` for White, Yellow, Green, Blue, Orange, Red). Each move function rotates a face 90° clockwise and cyclically permutes the adjacent edge stickers on the four neighboring faces. Counter-clockwise and 180° turns are implemented by repeating the clockwise move three times or twice, respectively — a simple, if not maximally efficient, approach that keeps the logic easy to follow and verify.

## Limitations

- Solving is manual — the simulator does not include a solving algorithm or hints.
- Undo only reverts one move at a time and does not support redo.
- Move history is capped at 1000 entries per session.
- Timer resolution is whole seconds (via `time()`), not sub-second precision.
