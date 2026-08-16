# Rubik's Cube Move Simulator

> A terminal-based 3×3 Rubik's Cube simulator written in C, featuring standard cube notation, colored visualization, move history, undo functionality, solve timing, random scrambles, and an interactive Challenge Mode.

![Language](https://img.shields.io/badge/Language-C-blue)
![Version](https://img.shields.io/badge/Version-2.3-green)
![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux-lightgrey)
![License](https://img.shields.io/badge/License-Educational-orange)

---

## 🎯 Overview

**Rubik's Cube Move Simulator** is an interactive command-line application that simulates a physical 3×3 Rubik's Cube.

The cube is represented internally using a six-face data structure, and every move updates the corresponding stickers while preserving the complete cube state.

The simulator supports standard Rubik's Cube notation such as:

```text
R U R' U' F2
```

Every layer turn — Up, Down, Left, Right, Front, and Back — is available in:

- Clockwise form
- Counter-clockwise form
- 180° form

Multiple moves can also be entered in a single command.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Colored Display** | Displays the cube using ANSI terminal colors for easier visualization |
| ⏱️ **Solve Timer** | Automatically starts when solving begins and tracks elapsed time |
| 📜 **Move History** | Records performed moves and displays them on demand |
| ↩️ **Undo** | Reverts the most recent move and restores the previous cube state |
| 🎲 **Challenge Mode** | Generates a randomized 20-move scramble and starts a challenge timer |
| 🏆 **Best Score Tracking** | Tracks the best completed challenge based on time and moves |
| ✅ **Solved Detection** | Automatically detects when the cube reaches the solved state |
| 🔄 **Reset System** | Resets the cube, timer, and move history |
| ⌨️ **Interactive CLI** | Provides a command-based terminal interface |

---

## 🧩 Cube Notation

| Face | Clockwise | Counter-Clockwise | 180° |
|:----:|:---------:|:------------------:|:----:|
| Up    | `U` | `U'` | `U2` |
| Down  | `D` | `D'` | `D2` |
| Left  | `L` | `L'` | `L2` |
| Right | `R` | `R'` | `R2` |
| Front | `F` | `F'` | `F2` |
| Back  | `B` | `B'` | `B2` |

### Example

Multiple moves can be entered on one line:

```text
Move [1] > R U R' U' F2 B D2
```

---

## ⌨️ Commands

| Command | Description |
|:-------:|:-------------|
| `S` | Show the current cube |
| `H` | Display the help menu |
| `X` | Reset the cube, timer, and move history |
| `C` | Check whether the cube is solved |
| `G` | Start Challenge Mode |
| `M` | Show move history |
| `UNDO` | Undo the latest move |
| `BEST` | Show the best Challenge Mode score |
| `Q` | Quit the simulator |

### Input Rules

- Commands are entered through the terminal.
- Move notation is case-sensitive.
- Use the exact notation shown above.
- Multiple moves must be separated by spaces.

Example:

```text
R U R' U' F2
```

---

## 🎨 Colored Terminal Display

The simulator uses ANSI terminal escape sequences to display cube stickers with colors.

Example:

```text
================================================================
                 RUBIK'S CUBE SIMULATOR V2.3
================================================================

                           UP

                      W    W    W
                      W    W    W
                      W    W    W

       LEFT             FRONT            RIGHT             BACK

  O    O    O        G    G    G        R    R    R        B    B    B
  O    O    O        G    G    G        R    R    R        B    B    B
  O    O    O        G    G    G        R    R    R        B    B    B

                         DOWN

                      Y    Y    Y
                      Y    Y    Y
                      Y    Y    Y

================================================================
```

---

## ⏱️ Solve Timer

The simulator tracks the time taken to solve the cube. The timer starts when a valid move begins a solving session.

Example:

```text
Moves: 5    |    Time: 8 sec
```

When the cube is solved:

```text
====================================================
              🎉 CUBE IS SOLVED! 🎉
====================================================
⏱️  Solve time : 8 seconds
📊 Total moves: 5
====================================================
```

---

## 📜 Move History

Every valid move can be recorded and displayed during the current session.

Use:

```text
M
```

Example:

```text
============================================================
                     MOVE HISTORY
============================================================

Moves: R U R' U' F2

Total moves: 5
```

Move history helps review the sequence used during a solve.

---

## ↩️ Undo System

The simulator supports undoing previously performed moves.

Use:

```text
UNDO
```

Example:

```text
Move [1] > R

Move performed: R

Move [2] > UNDO

↩️  Undid move: R
```

The inverse of the move is automatically calculated:

| Move | Inverse | Move | Inverse | Move | Inverse |
|:----:|:-------:|:----:|:-------:|:----:|:-------:|
| `R`  | `R'`    | `U`  | `U'`    | `D`  | `D'`    |
| `R'` | `R`     | `U'` | `U`     | `D'` | `D`     |
| `R2` | `R2`    | `U2` | `U2`    | `D2` | `D2`    |
| `L`  | `L'`    | `F`  | `F'`    | `B`  | `B'`    |
| `L'` | `L`     | `F'` | `F`     | `B'` | `B`     |
| `L2` | `L2`    | `F2` | `F2`    | `B2` | `B2`    |

The same inverse relationship applies to all supported faces.

---

## 🎲 Random Scramble

The simulator can generate a randomized scramble using:

```text
G
```

Challenge Mode generates a 20-move scramble.

Example:

```text
====================================================
                 🎯 CHALLENGE MODE
====================================================

Scramble:
L' B2 L' R2 L' R' L2 D B' U2 F R2 U B2 L B D2 F D2 F

🎯 Solve the scrambled cube!
⏱️  Challenge timer started!
```

The scramble is applied automatically before the player starts solving, and the generator avoids selecting the same face on consecutive turns.

---

## 🎯 Challenge Mode

Challenge Mode turns the simulator into a timed solving challenge.

### Workflow

```text
Generate Scramble
       ↓
Apply Scramble
       ↓
Start Timer
       ↓
Player Solves Cube
       ↓
Count Player Moves
       ↓
Detect Solved State
       ↓
Stop Timer
       ↓
Display Result
       ↓
Update Best Score
```

Start Challenge Mode with:

```text
G
```

The simulator tracks:

- Challenge time
- Challenge move count
- Solved state
- Best performance

---

## 🏆 Best Score

Use:

```text
BEST
```

to view the best completed Challenge Mode result during the current program session.

Example:

```text
====================================================
                 🏆 BEST CHALLENGE
====================================================

Best time : 24 seconds
Best moves: 38

====================================================
```

The best result is compared using solving performance (time first, then move count).

> **Note:** Best scores are currently maintained during the program session and are not permanently saved after the program exits.

---

## ✅ Solved Detection

The simulator checks the cube state after valid moves. A cube is solved when every face contains the correct uniform color.

Use:

```text
C
```

to manually check the current cube state.

Example:

```text
Cube is NOT solved.
```

or:

```text
🎉 CUBE IS SOLVED!
```

Challenge Mode also automatically detects when the player solves the scrambled cube.

---

## 🔄 Reset

Use:

```text
X
```

to reset:

- Cube state
- Timer
- Move history
- Move counter
- Challenge state

The cube returns to the solved configuration.

---

## 🛠️ How It Works

The cube state is represented using:

```c
char cube[6][3][3];
```

This represents:

```
6 faces × 3 rows × 3 columns = 54 stickers
```

The six faces use the following colors:

- `W` = White
- `Y` = Yellow
- `G` = Green
- `B` = Blue
- `O` = Orange
- `R` = Red

Each face-turn operation performs two major tasks:

1. Rotate the selected 3×3 face.
2. Update the affected stickers on the four neighboring faces.

Counter-clockwise and 180° moves are derived from the clockwise rotation logic — a clockwise turn is applied three times for a counter-clockwise turn, and twice for a 180° turn.

---

## 🧠 Technical Concepts

This project demonstrates practical C programming concepts including:

- Multidimensional arrays
- Character arrays
- Functions
- Pointers
- Strings
- Tokenization
- Input parsing
- State management
- Random number generation
- Matrix rotation
- Inverse operations
- Timers
- Conditional logic
- Loops
- Command-line interfaces
- Debugging

---

## 🎲 Scramble Generation

Challenge Mode generates a sequence of 20 random moves. The scramble generator avoids selecting the same face consecutively.

Example:

```text
L' B2 L' R2 L' R' L2 D B' U2 F R2 U B2 L B D2 F D2 F
```

The generated scramble is applied to the cube before the challenge begins.

---

## 📊 Performance Tracking

The simulator tracks several useful metrics.

| Metric | Description |
|---|---|
| Total Moves | Total valid moves performed |
| Challenge Moves | Player moves during Challenge Mode |
| Solve Time | Time taken to solve |
| Best Time | Fastest completed challenge |
| Best Moves | Move count associated with the best result |

---

## 🧪 Testing

The simulator has been tested using:

- **Basic moves:** `U` `D` `L` `R` `F` `B`
- **Counter-clockwise moves:** `U'` `D'` `L'` `R'` `F'` `B'`
- **180° moves:** `U2` `D2` `L2` `R2` `F2` `B2`
- **Multiple moves:** `R U R' U' F2`
- **Undo:** `R` → `UNDO`
- **Reset:** `X`
- **Solved detection:** `C`
- **Challenge Mode:** `G`
- **Best Score:** `BEST`

---

## 🚀 Getting Started

### Prerequisites

You need:

- GCC or another C compiler
- Terminal with ANSI color support
- macOS, Linux, or a compatible environment

### 📥 Clone the Repository

```bash
git clone https://github.com/annapoorna147/Rubiks-Cube-Move-Simulator.git
```

Enter the project directory:

```bash
cd Rubiks-Cube-Move-Simulator
```

### 🔨 Compile

Compile the simulator using GCC:

```bash
gcc rubiks_cube.c -o rubiks_cube
```

### ▶️ Run

```bash
./rubiks_cube
```

---

## 🎮 Example Session

```text
================================================================
             RUBIK'S CUBE MOVE SIMULATOR V2.3
================================================================

🎨 Colored terminal display
⏱️  Solving timer
📜 Move history
↩️  Undo system
🎲 Random scramble
🏆 Best score
✅ Solved detection

Move [1] > R U R' U' F2

⏱️  Timer started!

Move performed: R
Move performed: U
Move performed: R'
Move performed: U'
Move performed: F2
```

View history:

```text
Move [6] > M
```

Undo:

```text
Move [6] > UNDO
```

Start a challenge:

```text
Move [6] > G
```

Check best score:

```text
Move [1] > BEST
```

Exit:

```text
Move [1] > Q
```

---

## 📁 Project Structure

```text
Rubiks-Cube-Move-Simulator/
│
├── rubiks_cube.c
├── README.md
├── .gitignore
└── rubiks_cube
```

### Files

| File | Purpose |
|---|---|
| `rubiks_cube.c` | Main C source code |
| `README.md` | Project documentation |
| `.gitignore` | Files excluded from Git |
| `rubiks_cube` | Locally compiled executable |

The executable is generated locally and ignored by Git.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| C | Core simulator implementation |
| GCC | Compilation |
| Standard C Library | Core programming functionality |
| `time.h` | Timer functionality |
| ANSI Escape Sequences | Colored terminal output |
| Git | Version control |
| GitHub | Repository hosting |

---

## 📈 Version History

### V1.0 — Initial Simulator
- 3×3 cube representation
- Six face rotations
- Clockwise moves
- Counter-clockwise moves
- 180° moves
- Multiple move input
- Move counter
- Reset
- Solved detection
- Help menu

### V2.0 — Colored Terminal Display
- Added colored cube visualization
- Improved terminal layout
- Improved readability

### V2.1 — Timer & Move History
- Added solve timer
- Added move history
- Added elapsed-time tracking
- Added solving statistics

### V2.2 — Undo System
- Added `UNDO`
- Added inverse move calculation
- Added move rollback
- Improved state management

### V2.3 — Challenge Mode
- Added randomized 20-move scrambles
- Added Challenge Mode
- Added challenge timer
- Added challenge move counter
- Added automatic solved detection
- Added best challenge score
- Added `BEST` command
- Updated documentation

---

## 🔮 Future Roadmap

Potential future improvements:

- [ ] Persistent best scores
- [ ] Leaderboard
- [ ] Average of 5 solves
- [ ] Average of 12 solves
- [ ] WCA-style timing
- [ ] Scramble history
- [ ] Save and load cube states
- [ ] Custom scramble length
- [ ] Difficulty levels
- [ ] Automatic cube solver
- [ ] Hint system
- [ ] Optimal solution calculation
- [ ] Keyboard-controlled cube
- [ ] Animated terminal moves
- [ ] Graphical user interface
- [ ] 3D cube visualization
- [ ] Web version
- [ ] Mobile application
- [ ] AI-assisted solving

---

## ⚠️ Limitations

- No built-in solver or hint system
- Solving is currently manual
- Best scores are not permanently stored
- Move history is limited to 1,000 entries per session
- Timer resolution uses whole seconds through `time()`
- No graphical 3D interface
- No persistent leaderboard

---

## 🎓 Learning Outcomes

This project provided practical experience with:

```text
C Programming
      ↓
Multidimensional Arrays
      ↓
State Management
      ↓
Matrix Transformations
      ↓
Input Processing
      ↓
Randomization
      ↓
Timers
      ↓
Debugging
      ↓
Git & GitHub
      ↓
Interactive Application Development
```

The project was developed incrementally, adding new functionality across multiple versions rather than building everything at once.

---

## 🌱 Development Journey

```text
V1.0
Basic Cube Simulator
        │
        ▼
V2.0
Colored Terminal Display
        │
        ▼
V2.1
Timer + Move History
        │
        ▼
V2.2
Undo System
        │
        ▼
V2.3
Challenge Mode + Best Score
```

Each version introduced additional functionality while maintaining the core cube simulation.

---

## 🏆 Current Version

**Rubik's Cube Move Simulator — Version 2.3**

### Current Feature Set

- ✅ 3×3 Cube Simulation
- ✅ Standard Cube Notation
- ✅ Colored Terminal Display
- ✅ Solve Timer
- ✅ Move History
- ✅ Undo System
- ✅ Random Scramble
- ✅ Challenge Mode
- ✅ Challenge Timer
- ✅ Challenge Move Counter
- ✅ Solved Detection
- ✅ Best Score Tracking
- ✅ Interactive CLI

---

## 📜 License

This project is intended for:

- Educational use
- Learning C programming
- Personal experimentation
- Portfolio demonstration

---

## 👩🏻‍💻 Author

**Annapoorna**

Electronics & Communication Engineering student interested in:

- 🤖 Artificial Intelligence
- 💻 Software Engineering
- 📡 Electronics & Communication
- 🧠 Algorithms & Problem Solving
- 🔧 Embedded Systems
- 💡 Building practical software projects

---

## ⭐ Project

**Rubik's Cube Move Simulator**

Built in C and developed incrementally from a basic cube simulator into an interactive challenge-based application.

```text
Build → Test → Debug → Improve → Version → Repeat
```

🧩 **V2.3 — Challenge Mode Edition**
