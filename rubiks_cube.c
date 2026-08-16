#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>

#define SIZE 3
#define MAX_HISTORY 1000
#define MAX_MOVE_LENGTH 4

char cube[6][SIZE][SIZE];
char moveHistory[MAX_HISTORY][MAX_MOVE_LENGTH];

int moveCount = 0;
int historyCount = 0;

int challengeMode = 0;
int challengeMoves = 0;

double bestTime = -1.0;
int bestMoves = -1;

time_t startTime;
int timerRunning = 0;


/* ============================================================
   INITIALIZE CUBE
   ============================================================ */

void initializeCube()
{
    char colors[6] = {'W','Y','G','B','O','R'};

    for (int face = 0; face < 6; face++)
        for (int row = 0; row < SIZE; row++)
            for (int col = 0; col < SIZE; col++)
                cube[face][row][col] = colors[face];
}


/* ============================================================
   RESET SESSION
   ============================================================ */

void resetSession()
{
    moveCount = 0;
    historyCount = 0;
    challengeMoves = 0;
    timerRunning = 0;

    for (int i = 0; i < MAX_HISTORY; i++)
        moveHistory[i][0] = '\0';
}


/* ============================================================
   TIMER
   ============================================================ */

void startTimer()
{
    if (!timerRunning)
    {
        startTime = time(NULL);
        timerRunning = 1;
        printf("\n⏱️  Timer started!\n");
    }
}

double getElapsedTime()
{
    if (!timerRunning)
        return 0.0;

    return difftime(time(NULL), startTime);
}

double stopTimer()
{
    if (!timerRunning)
        return 0.0;

    double elapsed = getElapsedTime();
    timerRunning = 0;

    return elapsed;
}


/* ============================================================
   MOVE HISTORY
   ============================================================ */

void addToHistory(const char *move)
{
    if (historyCount >= MAX_HISTORY)
        return;

    strncpy(moveHistory[historyCount], move, MAX_MOVE_LENGTH - 1);
    moveHistory[historyCount][MAX_MOVE_LENGTH - 1] = '\0';

    historyCount++;
}

void displayHistory()
{
    printf("\n");
    printf("============================================================\n");
    printf("                     MOVE HISTORY\n");
    printf("============================================================\n");

    if (historyCount == 0)
    {
        printf("\nNo moves have been performed yet.\n");
    }
    else
    {
        printf("\nMoves: ");

        for (int i = 0; i < historyCount; i++)
        {
            printf("%s", moveHistory[i]);

            if (i < historyCount - 1)
                printf(" ");
        }

        printf("\n");
        printf("Total moves: %d\n", historyCount);

        if (challengeMode)
            printf("Challenge moves: %d\n", challengeMoves);
    }

    if (timerRunning)
        printf("Elapsed time: %.0f seconds\n", getElapsedTime());
    else
        printf("Timer: Not running\n");

    printf("\n============================================================\n");
}


/* ============================================================
   ROTATE FACE
   ============================================================ */

void rotateFaceClockwise(int face)
{
    char temp[SIZE][SIZE];

    for (int row = 0; row < SIZE; row++)
        for (int col = 0; col < SIZE; col++)
            temp[row][col] = cube[face][row][col];

    for (int row = 0; row < SIZE; row++)
        for (int col = 0; col < SIZE; col++)
            cube[face][col][SIZE - 1 - row] = temp[row][col];
}


/* ============================================================
   R MOVE
   ============================================================ */

void moveR()
{
    char temp[SIZE];

    rotateFaceClockwise(5);

    for (int i = 0; i < SIZE; i++)
        temp[i] = cube[0][i][2];

    for (int i = 0; i < SIZE; i++)
        cube[0][i][2] = cube[2][i][2];

    for (int i = 0; i < SIZE; i++)
        cube[2][i][2] = cube[1][i][2];

    for (int i = 0; i < SIZE; i++)
        cube[1][i][2] = cube[3][SIZE - 1 - i][0];

    for (int i = 0; i < SIZE; i++)
        cube[3][SIZE - 1 - i][0] = temp[i];
}

void moveRPrime()
{
    moveR();
    moveR();
    moveR();
}

void moveR2()
{
    moveR();
    moveR();
}


/* ============================================================
   L MOVE
   ============================================================ */

void moveL()
{
    char temp[SIZE];

    rotateFaceClockwise(4);

    for (int i = 0; i < SIZE; i++)
        temp[i] = cube[0][i][0];

    for (int i = 0; i < SIZE; i++)
        cube[0][i][0] = cube[3][SIZE - 1 - i][2];

    for (int i = 0; i < SIZE; i++)
        cube[3][SIZE - 1 - i][2] = cube[1][i][0];

    for (int i = 0; i < SIZE; i++)
        cube[1][i][0] = cube[2][i][0];

    for (int i = 0; i < SIZE; i++)
        cube[2][i][0] = temp[i];
}

void moveLPrime()
{
    moveL();
    moveL();
    moveL();
}

void moveL2()
{
    moveL();
    moveL();
}


/* ============================================================
   U MOVE
   ============================================================ */

void moveU()
{
    char temp[SIZE];

    rotateFaceClockwise(0);

    for (int i = 0; i < SIZE; i++)
        temp[i] = cube[2][0][i];

    for (int i = 0; i < SIZE; i++)
        cube[2][0][i] = cube[4][0][i];

    for (int i = 0; i < SIZE; i++)
        cube[4][0][i] = cube[3][0][i];

    for (int i = 0; i < SIZE; i++)
        cube[3][0][i] = cube[5][0][i];

    for (int i = 0; i < SIZE; i++)
        cube[5][0][i] = temp[i];
}

void moveUPrime()
{
    moveU();
    moveU();
    moveU();
}

void moveU2()
{
    moveU();
    moveU();
}


/* ============================================================
   D MOVE
   ============================================================ */

void moveD()
{
    char temp[SIZE];

    rotateFaceClockwise(1);

    for (int i = 0; i < SIZE; i++)
        temp[i] = cube[2][2][i];

    for (int i = 0; i < SIZE; i++)
        cube[2][2][i] = cube[5][2][i];

    for (int i = 0; i < SIZE; i++)
        cube[5][2][i] = cube[3][2][i];

    for (int i = 0; i < SIZE; i++)
        cube[3][2][i] = cube[4][2][i];

    for (int i = 0; i < SIZE; i++)
        cube[4][2][i] = temp[i];
}

void moveDPrime()
{
    moveD();
    moveD();
    moveD();
}

void moveD2()
{
    moveD();
    moveD();
}


/* ============================================================
   F MOVE
   ============================================================ */

void moveF()
{
    char temp[SIZE];

    rotateFaceClockwise(2);

    for (int i = 0; i < SIZE; i++)
        temp[i] = cube[0][2][i];

    for (int i = 0; i < SIZE; i++)
        cube[0][2][i] = cube[4][SIZE - 1 - i][2];

    for (int i = 0; i < SIZE; i++)
        cube[4][SIZE - 1 - i][2] = cube[1][0][i];

    for (int i = 0; i < SIZE; i++)
        cube[1][0][i] = cube[5][SIZE - 1 - i][0];

    for (int i = 0; i < SIZE; i++)
        cube[5][SIZE - 1 - i][0] = temp[i];
}

void moveFPrime()
{
    moveF();
    moveF();
    moveF();
}

void moveF2()
{
    moveF();
    moveF();
}


/* ============================================================
   B MOVE
   ============================================================ */

void moveB()
{
    char temp[SIZE];

    rotateFaceClockwise(3);

    for (int i = 0; i < SIZE; i++)
        temp[i] = cube[0][0][i];

    for (int i = 0; i < SIZE; i++)
        cube[0][0][i] = cube[5][i][2];

    for (int i = 0; i < SIZE; i++)
        cube[5][i][2] = cube[1][2][SIZE - 1 - i];

    for (int i = 0; i < SIZE; i++)
        cube[1][2][SIZE - 1 - i] = cube[4][i][0];

    for (int i = 0; i < SIZE; i++)
        cube[4][i][0] = temp[i];
}

void moveBPrime()
{
    moveB();
    moveB();
    moveB();
}

void moveB2()
{
    moveB();
    moveB();
}


/* ============================================================
   SOLVED CHECK
   ============================================================ */

int isSolved()
{
    char colors[6] = {'W','Y','G','B','O','R'};

    for (int face = 0; face < 6; face++)
        for (int row = 0; row < SIZE; row++)
            for (int col = 0; col < SIZE; col++)
                if (cube[face][row][col] != colors[face])
                    return 0;

    return 1;
}


/* ============================================================
   COLORED DISPLAY
   ============================================================ */

void printSticker(char color)
{
    switch (color)
    {
        case 'W':
            printf("\033[47m\033[30m  W  \033[0m");
            break;

        case 'Y':
            printf("\033[43m\033[30m  Y  \033[0m");
            break;

        case 'G':
            printf("\033[42m\033[30m  G  \033[0m");
            break;

        case 'B':
            printf("\033[44m\033[97m  B  \033[0m");
            break;

        case 'O':
            printf("\033[48;5;208m\033[30m  O  \033[0m");
            break;

        case 'R':
            printf("\033[41m\033[97m  R  \033[0m");
            break;

        default:
            printf("  ?  ");
    }
}


/* ============================================================
   DISPLAY CUBE
   ============================================================ */

void displayCube()
{
    printf("\n");
    printf("================================================================\n");
    printf("                 RUBIK'S CUBE SIMULATOR V2.3\n");
    printf("================================================================\n\n");

    printf("                           UP\n\n");

    for (int row = 0; row < SIZE; row++)
    {
        printf("                    ");

        for (int col = 0; col < SIZE; col++)
            printSticker(cube[0][row][col]);

        printf("\n");
    }

    printf("\n");

    printf("       LEFT             FRONT            RIGHT             BACK\n\n");

    for (int row = 0; row < SIZE; row++)
    {
        for (int col = 0; col < SIZE; col++)
            printSticker(cube[4][row][col]);

        printf("    ");

        for (int col = 0; col < SIZE; col++)
            printSticker(cube[2][row][col]);

        printf("    ");

        for (int col = 0; col < SIZE; col++)
            printSticker(cube[5][row][col]);

        printf("    ");

        for (int col = 0; col < SIZE; col++)
            printSticker(cube[3][row][col]);

        printf("\n");
    }

    printf("\n");
    printf("                         DOWN\n\n");

    for (int row = 0; row < SIZE; row++)
    {
        printf("                    ");

        for (int col = 0; col < SIZE; col++)
            printSticker(cube[1][row][col]);

        printf("\n");
    }

    printf("\n");
    printf("================================================================\n");

    printf("Moves: %d", moveCount);

    if (challengeMode)
        printf("    |    Challenge Moves: %d", challengeMoves);

    if (timerRunning)
        printf("    |    Time: %.0f sec", getElapsedTime());

    printf("\n");
    printf("================================================================\n");
}


/* ============================================================
   HELP
   ============================================================ */

void displayHelp()
{
    printf("\n");
    printf("====================== V2.3 HELP ======================\n");

    printf("\nMOVES:\n");
    printf("U   = Up clockwise\n");
    printf("U'  = Up counter-clockwise\n");
    printf("U2  = Up 180 degrees\n");

    printf("D   = Down clockwise\n");
    printf("D'  = Down counter-clockwise\n");
    printf("D2  = Down 180 degrees\n");

    printf("L   = Left clockwise\n");
    printf("L'  = Left counter-clockwise\n");
    printf("L2  = Left 180 degrees\n");

    printf("R   = Right clockwise\n");
    printf("R'  = Right counter-clockwise\n");
    printf("R2  = Right 180 degrees\n");

    printf("F   = Front clockwise\n");
    printf("F'  = Front counter-clockwise\n");
    printf("F2  = Front 180 degrees\n");

    printf("B   = Back clockwise\n");
    printf("B'  = Back counter-clockwise\n");
    printf("B2  = Back 180 degrees\n");

    printf("\nCOMMANDS:\n");
    printf("S       = Show cube\n");
    printf("H       = Show help\n");
    printf("X       = Reset cube\n");
    printf("C       = Check solved\n");
    printf("G       = Start challenge\n");
    printf("M       = Move history\n");
    printf("UNDO    = Undo last move\n");
    printf("BEST    = Show best challenge score\n");
    printf("Q       = Quit\n");

    printf("\n=======================================================\n");
}


/* ============================================================
   VALIDATE MOVE
   ============================================================ */

int isValidMove(const char *move)
{
    const char *moves[] =
    {
        "U","U'","U2",
        "D","D'","D2",
        "L","L'","L2",
        "R","R'","R2",
        "F","F'","F2",
        "B","B'","B2"
    };

    for (int i = 0; i < 18; i++)
    {
        if (strcmp(move, moves[i]) == 0)
            return 1;
    }

    return 0;
}


/* ============================================================
   PERFORM MOVE
   ============================================================ */

int performMove(const char *move)
{
    if (strcmp(move, "U") == 0)
        moveU();
    else if (strcmp(move, "U'") == 0)
        moveUPrime();
    else if (strcmp(move, "U2") == 0)
        moveU2();
    else if (strcmp(move, "D") == 0)
        moveD();
    else if (strcmp(move, "D'") == 0)
        moveDPrime();
    else if (strcmp(move, "D2") == 0)
        moveD2();
    else if (strcmp(move, "L") == 0)
        moveL();
    else if (strcmp(move, "L'") == 0)
        moveLPrime();
    else if (strcmp(move, "L2") == 0)
        moveL2();
    else if (strcmp(move, "R") == 0)
        moveR();
    else if (strcmp(move, "R'") == 0)
        moveRPrime();
    else if (strcmp(move, "R2") == 0)
        moveR2();
    else if (strcmp(move, "F") == 0)
        moveF();
    else if (strcmp(move, "F'") == 0)
        moveFPrime();
    else if (strcmp(move, "F2") == 0)
        moveF2();
    else if (strcmp(move, "B") == 0)
        moveB();
    else if (strcmp(move, "B'") == 0)
        moveBPrime();
    else if (strcmp(move, "B2") == 0)
        moveB2();
    else
        return 0;

    return 1;
}


/* ============================================================
   INVERSE MOVE
   ============================================================ */

void getInverseMove(const char *move, char inverse[])
{
    if (strcmp(move, "U") == 0)
        strcpy(inverse, "U'");
    else if (strcmp(move, "U'") == 0)
        strcpy(inverse, "U");
    else if (strcmp(move, "U2") == 0)
        strcpy(inverse, "U2");

    else if (strcmp(move, "D") == 0)
        strcpy(inverse, "D'");
    else if (strcmp(move, "D'") == 0)
        strcpy(inverse, "D");
    else if (strcmp(move, "D2") == 0)
        strcpy(inverse, "D2");

    else if (strcmp(move, "L") == 0)
        strcpy(inverse, "L'");
    else if (strcmp(move, "L'") == 0)
        strcpy(inverse, "L");
    else if (strcmp(move, "L2") == 0)
        strcpy(inverse, "L2");

    else if (strcmp(move, "R") == 0)
        strcpy(inverse, "R'");
    else if (strcmp(move, "R'") == 0)
        strcpy(inverse, "R");
    else if (strcmp(move, "R2") == 0)
        strcpy(inverse, "R2");

    else if (strcmp(move, "F") == 0)
        strcpy(inverse, "F'");
    else if (strcmp(move, "F'") == 0)
        strcpy(inverse, "F");
    else if (strcmp(move, "F2") == 0)
        strcpy(inverse, "F2");

    else if (strcmp(move, "B") == 0)
        strcpy(inverse, "B'");
    else if (strcmp(move, "B'") == 0)
        strcpy(inverse, "B");
    else if (strcmp(move, "B2") == 0)
        strcpy(inverse, "B2");

    else
        strcpy(inverse, "");
}


/* ============================================================
   UNDO
   ============================================================ */

void undoLastMove()
{
    char inverse[MAX_MOVE_LENGTH];

    if (historyCount == 0)
    {
        printf("\nNothing to undo.\n");
        return;
    }

    getInverseMove(
        moveHistory[historyCount - 1],
        inverse
    );

    performMove(inverse);

    printf(
        "\n↩️  Undid move: %s\n",
        moveHistory[historyCount - 1]
    );

    moveHistory[historyCount - 1][0] = '\0';
    historyCount--;

    if (moveCount > 0)
        moveCount--;

    if (challengeMode && challengeMoves > 0)
        challengeMoves--;

    displayCube();
}


/* ============================================================
   PROCESS MOVES
   ============================================================ */

void processMoves(char line[])
{
    char *token = strtok(line, " \t\n");

    while (token != NULL)
    {
        if (isValidMove(token))
        {
            performMove(token);

            if (!timerRunning)
                startTimer();

            addToHistory(token);

            moveCount++;

            if (challengeMode)
                challengeMoves++;

            printf(
                "Move performed: %s\n",
                token
            );

            if (challengeMode && isSolved())
            {
                double finalTime = stopTimer();

                printf("\n");
                printf("====================================================\n");
                printf("              🎉 CHALLENGE COMPLETE! 🎉\n");
                printf("====================================================\n");

                printf(
                    "⏱️  Solve Time : %.0f seconds\n",
                    finalTime
                );

                printf(
                    "📊 Challenge Moves: %d\n",
                    challengeMoves
                );

                if (
                    bestTime < 0 ||
                    finalTime < bestTime ||
                    (
                        finalTime == bestTime &&
                        challengeMoves < bestMoves
                    )
                )
                {
                    bestTime = finalTime;
                    bestMoves = challengeMoves;

                    printf("\n🏆 NEW BEST SCORE!\n");
                }

                printf("====================================================\n");

                challengeMode = 0;
            }
        }
        else
        {
            printf(
                "Invalid move: %s\n",
                token
            );

            printf("Type H for help.\n");
        }

        token = strtok(NULL, " \t\n");
    }
}


/* ============================================================
   START CHALLENGE
   ============================================================ */

void startChallenge()
{
    const char *moves[] =
    {
        "U","U'","U2",
        "D","D'","D2",
        "L","L'","L2",
        "R","R'","R2",
        "F","F'","F2",
        "B","B'","B2"
    };

    int length = 20;
    int previousFace = -1;

    initializeCube();
    resetSession();

    challengeMode = 1;
    challengeMoves = 0;

    printf("\n");
    printf("====================================================\n");
    printf("                 🎯 CHALLENGE MODE\n");
    printf("====================================================\n");

    printf("\nScramble:\n");

    for (int i = 0; i < length; i++)
    {
        int index;
        int face;

        do
        {
            index = rand() % 18;
            face = index / 3;
        }
        while (face == previousFace);

        previousFace = face;

        performMove(moves[index]);

        printf("%s", moves[index]);

        if (i < length - 1)
            printf(" ");
    }

    printf("\n");
    printf("\n🎯 Solve the scrambled cube!\n");

    startTime = time(NULL);
    timerRunning = 1;

    printf("⏱️  Challenge timer started!\n");

    displayCube();
}


/* ============================================================
   BEST SCORE
   ============================================================ */

void displayBestScore()
{
    printf("\n");
    printf("====================================================\n");
    printf("                 🏆 BEST CHALLENGE\n");
    printf("====================================================\n");

    if (bestTime < 0)
    {
        printf("\nNo challenge completed yet.\n");
    }
    else
    {
        printf(
            "\nBest time : %.0f seconds\n",
            bestTime
        );

        printf(
            "Best moves: %d\n",
            bestMoves
        );
    }

    printf("\n====================================================\n");
}


/* ============================================================
   MAIN
   ============================================================ */

int main()
{
    char input[200];

    srand((unsigned int)time(NULL));

    initializeCube();
    resetSession();

    printf("\n");
    printf("================================================================\n");
    printf("             RUBIK'S CUBE MOVE SIMULATOR V2.3\n");
    printf("================================================================\n");

    printf("\n");
    printf("🎨 Colored terminal display\n");
    printf("⏱️  Solving timer\n");
    printf("📜 Move history\n");
    printf("↩️  Undo system\n");
    printf("🎲 Challenge mode\n");
    printf("🏆 Best score\n");
    printf("✅ Solved detection\n");

    displayHelp();
    displayCube();

    while (1)
    {
        printf(
            "\nMove [%d] > ",
            moveCount + 1
        );

        if (
            fgets(
                input,
                sizeof(input),
                stdin
            ) == NULL
        )
        {
            break;
        }

        input[strcspn(input, "\n")] = '\0';

        if (strlen(input) == 0)
            continue;


        /* QUIT */

        if (
            strcmp(input, "Q") == 0 ||
            strcmp(input, "q") == 0
        )
        {
            printf("\n");
            printf("====================================================\n");
            printf(
                "Thank you for using Rubik's Cube Simulator V2.3!\n"
            );
            printf(
                "Total moves: %d\n",
                moveCount
            );
            printf("====================================================\n");

            break;
        }


        /* SHOW */

        else if (
            strcmp(input, "S") == 0 ||
            strcmp(input, "s") == 0
        )
        {
            displayCube();
        }


        /* HELP */

        else if (
            strcmp(input, "H") == 0 ||
            strcmp(input, "h") == 0
        )
        {
            displayHelp();
        }


        /* RESET */

        else if (
            strcmp(input, "X") == 0 ||
            strcmp(input, "x") == 0
        )
        {
            initializeCube();
            resetSession();
            challengeMode = 0;

            printf(
                "\nCube, timer and move history reset!\n"
            );

            displayCube();
        }


        /* CHECK */

        else if (
            strcmp(input, "C") == 0 ||
            strcmp(input, "c") == 0
        )
        {
            if (isSolved())
            {
                double finalTime = stopTimer();

                printf("\n");
                printf("====================================================\n");
                printf("              🎉 CUBE IS SOLVED! 🎉\n");
                printf("====================================================\n");

                printf(
                    "⏱️  Solve time : %.0f seconds\n",
                    finalTime
                );

                printf(
                    "📊 Total moves: %d\n",
                    moveCount
                );

                printf("====================================================\n");
            }
            else
            {
                printf("\nCube is NOT solved.\n");

                if (timerRunning)
                    printf(
                        "⏱️  Current time: %.0f seconds\n",
                        getElapsedTime()
                    );
            }
        }


        /* HISTORY */

        else if (
            strcmp(input, "M") == 0 ||
            strcmp(input, "m") == 0
        )
        {
            displayHistory();
        }


        /* UNDO */

        else if (
            strcmp(input, "UNDO") == 0 ||
            strcmp(input, "undo") == 0
        )
        {
            undoLastMove();
        }


        /* CHALLENGE */

        else if (
            strcmp(input, "G") == 0 ||
            strcmp(input, "g") == 0
        )
        {
            startChallenge();
        }


        /* BEST */

        else if (
            strcmp(input, "BEST") == 0 ||
            strcmp(input, "best") == 0
        )
        {
            displayBestScore();
        }


        /* NORMAL MOVES */

        else
        {
            processMoves(input);

            if (!challengeMode && isSolved())
            {
                double finalTime = stopTimer();

                printf("\n");
                printf("====================================================\n");
                printf("              🎉 CUBE IS SOLVED! 🎉\n");
                printf("====================================================\n");

                printf(
                    "⏱️  Solve time : %.0f seconds\n",
                    finalTime
                );

                printf(
                    "📊 Total moves: %d\n",
                    moveCount
                );

                printf("====================================================\n");
            }

            displayCube();
        }
    }

    return 0;
}
