# 🧩 Rubik's Cube Move Simulator

A terminal-based **3×3 Rubik's Cube Move Simulator** developed in C.

The simulator maintains the state of a virtual Rubik's Cube and allows users to perform standard cube rotations, execute multiple moves, generate random scrambles, reset the cube, and check whether the cube has returned to the solved state.

---

## 🎯 Project Overview

This project was developed to strengthen practical C programming and algorithmic problem-solving skills through a real-world simulation.

Instead of representing the cube as a simple visual object, the program maintains the state of all **6 faces × 3 × 3 stickers** and updates the cube whenever a valid move is performed.

### Cube Representation

```text
                    UP
                     ↑
                     │
              ┌─────────────┐
              │  W W W      │
              │  W W W      │
              │  W W W      │
              └─────────────┘

     LEFT       FRONT       RIGHT       BACK
   ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐
   │ O O O │  │ G G G │  │ R R R │  │ B B B │
   │ O O O │  │ G G G │  │ R R R │  │ B B B │
   │ O O O │  │ G G G │  │ R R R │  │ B B B │
   └───────┘  └───────┘  └───────┘  └───────┘

                    DOWN
                     ↓
              ┌─────────────┐
              │  Y Y Y      │
              │  Y Y Y      │
              │  Y Y Y      │
              └─────────────┘
```

---

## ✨ Features

* 🧩 Complete 3×3 cube representation
* 🔄 Six standard face rotations
* ↩️ Counter-clockwise moves
* 🔁 180° moves
* ⌨️ Interactive terminal controls
* 📝 Multiple moves in a single input
* 🔢 Move counter
* 🎲 Random scramble generator
* 🔄 Cube reset functionality
* ✅ Solved-state detection
* 📖 Built-in help menu
* 💻 Pure C implementation
* 🚫 No external libraries required

---

## 🎮 Supported Moves

The simulator follows standard Rubik's Cube move notation.

| Move | Operation               |
| ---- | ----------------------- |
| `U`  | Up clockwise            |
| `U'` | Up counter-clockwise    |
| `U2` | Up 180°                 |
| `D`  | Down clockwise          |
| `D'` | Down counter-clockwise  |
| `D2` | Down 180°               |
| `L`  | Left clockwise          |
| `L'` | Left counter-clockwise  |
| `L2` | Left 180°               |
| `R`  | Right clockwise         |
| `R'` | Right counter-clockwise |
| `R2` | Right 180°              |
| `F`  | Front clockwise         |
| `F'` | Front counter-clockwise |
| `F2` | Front 180°              |
| `B`  | Back clockwise          |
| `B'` | Back counter-clockwise  |
| `B2` | Back 180°               |

---

## 🖥️ Program Commands

| Command | Function                         |
| ------- | -------------------------------- |
| `S`     | Display the current cube         |
| `H`     | Display the move guide           |
| `X`     | Reset the cube                   |
| `C`     | Check whether the cube is solved |
| `G`     | Generate a random scramble       |
| `Q`     | Quit the simulator               |

---

## 🚀 Example Usage

After launching the simulator, individual moves can be entered:

```text
Move [1] > R
Move performed: R
```

Multiple moves can also be entered in a single line:

```text
Move [1] > R U R' U' F2 D L' B
```

The simulator processes each move and updates the cube state.

Example output:

```text
Move performed: R
Move performed: U
Move performed: R'
Move performed: U'
Move performed: F2
Move performed: D
Move performed: L'
Move performed: B
```

The resulting cube state is then displayed in the terminal.

---

## 🔀 Scramble Generation

The `G` command generates a random scramble.

Example:

```text
Move [1] > G

Enter scramble length: 20

Scramble:
R U2 F' L D2 B R' U F2 D' L2 ...
```

The generated moves are automatically applied to the cube.

---

## ✅ Solved-State Detection

The simulator can determine whether every sticker has returned to its original solved position.

For example:

```text
Move [1] > R R' U U' F F' D D' L L' B B'
```

Then:

```text
Move [13] > C
```

The simulator reports:

```text
*** CUBE IS SOLVED! ***
```

A scrambled cube produces:

```text
Cube is NOT solved.
```

---

## 🧠 Concepts Used

This project applies several fundamental programming and algorithmic concepts:

* C programming
* Multidimensional arrays
* Functions
* Loops
* Conditional statements
* String handling
* Input parsing
* Pointer usage
* Random number generation
* State management
* Modular program design
* Algorithmic problem solving
* Simulation logic

---

## 🛠️ Technologies

**Language:** C

**Compiler:** GCC

**Platform:** Terminal / Command Line

**Development Environment:** VS Code

**Version Control:** Git & GitHub

---

## 📂 Project Structure

```text
Rubiks-Cube-Move-Simulator/
│
├── rubiks_cube.c
├── README.md
└── .gitignore
```

### Main Source File

`rubiks_cube.c`

Contains:

* Cube representation
* Face rotation algorithms
* Move processing
* Scramble generation
* Solved-state detection
* Terminal interface

---

## ⚙️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/annapoorna147/Rubiks-Cube-Move-Simulator.git
```

### 2. Enter the project directory

```bash
cd Rubiks-Cube-Move-Simulator
```

### 3. Compile

```bash
gcc rubiks_cube.c -o rubiks_cube
```

### 4. Run

```bash
./rubiks_cube
```

---

## 🧪 Testing

The simulator was tested using:

### Single moves

```text
R
U
D
L
F
B
```

### Reverse moves

```text
R R'
U U'
D D'
L L'
F F'
B B'
```

### Double moves

```text
R2
U2
D2
L2
F2
B2
```

### Move sequences

```text
R U R' U' F2 D L' B
```

### Solved-state verification

```text
R R' U U' F F' D D' L L' B B'
```

---

## 🔮 Future Improvements

Possible future versions could include:

* 🎨 Color-based terminal interface
* 🧊 Interactive 3D cube visualization
* 🖱️ Mouse-controlled cube rotations
* 🤖 Automatic cube solver
* 🧠 Optimal solution generation
* ⏱️ Speed-solving timer
* 📊 Solving statistics
* 💾 Save and load cube states
* 🌐 Web-based version
* 📱 Mobile version

---

## 🎓 Learning Outcome

Through this project, the following skills were practiced:

```text
Problem Understanding
        ↓
Data Representation
        ↓
Algorithm Design
        ↓
C Implementation
        ↓
State Management
        ↓
Input Processing
        ↓
Testing & Debugging
        ↓
Git Version Control
        ↓
GitHub Deployment
```

---

## 👩‍💻 Author

**Annapoorna**

Electronics & Communication Engineering

---

## ⭐ Project Status

**Status:** Completed ✅

**Version:** 1.0

This project was created as a programming and algorithmic problem-solving mini project.

---

⭐ If you found this project interesting, consider starring the repository!
