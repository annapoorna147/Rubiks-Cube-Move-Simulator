# 🧩 Rubik's Cube Move Simulator

A terminal-based 3×3 Rubik's Cube simulator developed in C.

The program simulates standard Rubik's Cube moves, maintains the complete cube state, generates scrambles, counts moves, and checks whether the cube has returned to the solved state.

## ✨ Features

- 3×3 Rubik's Cube simulation
- Six face rotations:
  - U — Up
  - D — Down
  - L — Left
  - R — Right
  - F — Front
  - B — Back
- Counter-clockwise moves using `'`
- 180° moves using `2`
- Multiple moves in a single input
- Move counter
- Cube reset
- Solved-state detection
- Random scramble generation
- Interactive terminal interface
- Help menu

## 🎮 Supported Moves

| Move | Description |
|------|-------------|
| `U` | Up clockwise |
| `U'` | Up counter-clockwise |
| `U2` | Up 180° |
| `D` | Down clockwise |
| `D'` | Down counter-clockwise |
| `D2` | Down 180° |
| `L` | Left clockwise |
| `L'` | Left counter-clockwise |
| `L2` | Left 180° |
| `R` | Right clockwise |
| `R'` | Right counter-clockwise |
| `R2` | Right 180° |
| `F` | Front clockwise |
| `F'` | Front counter-clockwise |
| `F2` | Front 180° |
| `B` | Back clockwise |
| `B'` | Back counter-clockwise |
| `B2` | Back 180° |

## 🖥️ Commands

| Command | Function |
|---------|----------|
| `S` | Show cube |
| `H` | Show help |
| `X` | Reset cube |
| `C` | Check whether cube is solved |
| `G` | Generate a random scramble |
| `Q` | Quit |

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Rubiks-Cube-Move-Simulator