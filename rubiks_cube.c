#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>
#include <ctype.h>

#define SIZE 3

/*
============================================================
             RUBIK'S CUBE MOVE SIMULATOR
============================================================

Face numbering:

        0 = UP
        1 = DOWN
        2 = FRONT
        3 = BACK
        4 = LEFT
        5 = RIGHT

Colors:

        UP    = W
        DOWN  = Y
        FRONT = G
        BACK  = B
        LEFT  = O
        RIGHT = R

Supported moves:

        U  U' U2
        D  D' D2
        L  L' L2
        R  R' R2
        F  F' F2
        B  B' B2

Commands:

        S = Show cube
        H = Help
        X = Reset
        C = Check solved
        G = Generate scramble
        Q = Quit
============================================================
*/

char cube[6][SIZE][SIZE];


// ============================================================
// INITIALIZE SOLVED CUBE
// ============================================================

void initializeCube()
{
    char colors[6] = {'W', 'Y', 'G', 'B', 'O', 'R'};

    for (int face = 0; face < 6; face++)
    {
        for (int row = 0; row < SIZE; row++)
        {
            for (int col = 0; col < SIZE; col++)
            {
                cube[face][row][col] = colors[face];
            }
        }
    }
}


// ============================================================
// ROTATE FACE CLOCKWISE
// ============================================================

void rotateFaceClockwise(int face)
{
    char temp[SIZE][SIZE];

    for (int row = 0; row < SIZE; row++)
    {
        for (int col = 0; col < SIZE; col++)
        {
            temp[row][col] = cube[face][row][col];
        }
    }

    for (int row = 0; row < SIZE; row++)
    {
        for (int col = 0; col < SIZE; col++)
        {
            cube[face][col][SIZE - 1 - row] = temp[row][col];
        }
    }
}


// ============================================================
// R MOVE
// ============================================================

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


// ============================================================
// L MOVE
// ============================================================

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


// ============================================================
// U MOVE
// ============================================================

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


// ============================================================
// D MOVE
// ============================================================

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


// ============================================================
// F MOVE
// ============================================================

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


// ============================================================
// B MOVE
// ============================================================

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


// ============================================================
// CHECK SOLVED
// ============================================================

int isSolved()
{
    char colors[6] = {'W', 'Y', 'G', 'B', 'O', 'R'};

    for (int face = 0; face < 6; face++)
    {
        for (int row = 0; row < SIZE; row++)
        {
            for (int col = 0; col < SIZE; col++)
            {
                if (cube[face][row][col] != colors[face])
                    return 0;
            }
        }
    }

    return 1;
}


// ============================================================
// DISPLAY CUBE
// ============================================================

void displayCube()
{
    printf("\n");
    printf("============================================\n");
    printf("               RUBIK'S CUBE\n");
    printf("============================================\n\n");

    printf("                    UP\n");

    for (int row = 0; row < SIZE; row++)
    {
        printf("                    ");

        for (int col = 0; col < SIZE; col++)
            printf("%c ", cube[0][row][col]);

        printf("\n");
    }

    printf("\n");

    printf("LEFT       FRONT      RIGHT       BACK\n");

    for (int row = 0; row < SIZE; row++)
    {
        for (int col = 0; col < SIZE; col++)
            printf("%c ", cube[4][row][col]);

        printf("     ");

        for (int col = 0; col < SIZE; col++)
            printf("%c ", cube[2][row][col]);

        printf("     ");

        for (int col = 0; col < SIZE; col++)
            printf("%c ", cube[5][row][col]);

        printf("     ");

        for (int col = 0; col < SIZE; col++)
            printf("%c ", cube[3][row][col]);

        printf("\n");
    }

    printf("\n");

    printf("                    DOWN\n");

    for (int row = 0; row < SIZE; row++)
    {
        printf("                    ");

        for (int col = 0; col < SIZE; col++)
            printf("%c ", cube[1][row][col]);

        printf("\n");
    }

    printf("\n============================================\n");
}


// ============================================================
// HELP
// ============================================================

void displayHelp()
{
    printf("\n============== MOVE GUIDE ==============\n");

    printf("\nUP:\n");
    printf("U   = Up clockwise\n");
    printf("U'  = Up counter-clockwise\n");
    printf("U2  = Up 180 degrees\n");

    printf("\nDOWN:\n");
    printf("D   = Down clockwise\n");
    printf("D'  = Down counter-clockwise\n");
    printf("D2  = Down 180 degrees\n");

    printf("\nLEFT:\n");
    printf("L   = Left clockwise\n");
    printf("L'  = Left counter-clockwise\n");
    printf("L2  = Left 180 degrees\n");

    printf("\nRIGHT:\n");
    printf("R   = Right clockwise\n");
    printf("R'  = Right counter-clockwise\n");
    printf("R2  = Right 180 degrees\n");

    printf("\nFRONT:\n");
    printf("F   = Front clockwise\n");
    printf("F'  = Front counter-clockwise\n");
    printf("F2  = Front 180 degrees\n");

    printf("\nBACK:\n");
    printf("B   = Back clockwise\n");
    printf("B'  = Back counter-clockwise\n");
    printf("B2  = Back 180 degrees\n");

    printf("\nCOMMANDS:\n");
    printf("S   = Show cube\n");
    printf("H   = Help\n");
    printf("X   = Reset cube\n");
    printf("C   = Check solved\n");
    printf("G   = Generate scramble\n");
    printf("Q   = Quit\n");

    printf("\n========================================\n");
}


// ============================================================
// PERFORM ONE MOVE
// ============================================================

int performMove(char move[])
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


// ============================================================
// GENERATE SCRAMBLE
// ============================================================

void generateScramble(int length)
{
    char *moves[] =
    {
        "U", "U'", "U2",
        "D", "D'", "D2",
        "L", "L'", "L2",
        "R", "R'", "R2",
        "F", "F'", "F2",
        "B", "B'", "B2"
    };

    int previousFace = -1;

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

        printf("%s ", moves[index]);

        performMove(moves[index]);
    }

    printf("\n");
}


// ============================================================
// PROCESS A LINE OF MOVES
// ============================================================

int processMoves(char line[], int *moveCount)
{
    char *token;

    token = strtok(line, " \t\n");

    while (token != NULL)
    {
        if (performMove(token))
        {
            (*moveCount)++;

            printf("Move performed: %s\n", token);
        }
        else
        {
            printf("Invalid move: %s\n", token);
            printf("Type H for help.\n");
        }

        token = strtok(NULL, " \t\n");
    }

    return 1;
}


// ============================================================
// MAIN
// ============================================================

int main()
{
    char input[200];

    int moveCount = 0;

    srand((unsigned int)time(NULL));

    initializeCube();

    printf("\n");
    printf("============================================\n");
    printf("       RUBIK'S CUBE MOVE SIMULATOR\n");
    printf("============================================\n");

    printf("\nCube initialized successfully!\n");

    displayHelp();
    displayCube();


    // ========================================================
    // MAIN LOOP
    // ========================================================

    while (1)
    {
        printf("\nMove [%d] > ", moveCount + 1);

        if (fgets(input, sizeof(input), stdin) == NULL)
            break;

        // Remove newline
        input[strcspn(input, "\n")] = '\0';


        // Ignore empty input
        if (strlen(input) == 0)
            continue;


        // ----------------------------------------------------
        // QUIT
        // ----------------------------------------------------

        if (strcmp(input, "Q") == 0 ||
            strcmp(input, "q") == 0)
        {
            printf("\n============================================\n");
            printf("Thank you for using the simulator!\n");
            printf("Total moves: %d\n", moveCount);
            printf("============================================\n");

            break;
        }


        // ----------------------------------------------------
        // SHOW
        // ----------------------------------------------------

        else if (strcmp(input, "S") == 0 ||
                 strcmp(input, "s") == 0)
        {
            displayCube();
        }


        // ----------------------------------------------------
        // HELP
        // ----------------------------------------------------

        else if (strcmp(input, "H") == 0 ||
                 strcmp(input, "h") == 0)
        {
            displayHelp();
        }


        // ----------------------------------------------------
        // RESET
        // ----------------------------------------------------

        else if (strcmp(input, "X") == 0 ||
                 strcmp(input, "x") == 0)
        {
            initializeCube();

            moveCount = 0;

            printf("\nCube reset successfully!\n");

            displayCube();
        }


        // ----------------------------------------------------
        // CHECK SOLVED
        // ----------------------------------------------------

        else if (strcmp(input, "C") == 0 ||
                 strcmp(input, "c") == 0)
        {
            if (isSolved())
                printf("\n*** CUBE IS SOLVED! ***\n");
            else
                printf("\nCube is NOT solved.\n");
        }


        // ----------------------------------------------------
        // GENERATE SCRAMBLE
        // ----------------------------------------------------

        else if (strcmp(input, "G") == 0 ||
                 strcmp(input, "g") == 0)
        {
            int length;

            printf("Enter scramble length: ");

            if (fgets(input, sizeof(input), stdin) != NULL)
            {
                length = atoi(input);

                if (length <= 0)
                {
                    printf("Invalid scramble length.\n");
                }
                else
                {
                    generateScramble(length);

                    moveCount += length;

                    displayCube();
                }
            }
        }


        // ----------------------------------------------------
        // MOVES
        // ----------------------------------------------------

        else
        {
            processMoves(input, &moveCount);

            if (isSolved())
                printf("\n*** CUBE IS SOLVED! ***\n");

            displayCube();
        }
    }

    return 0;
}