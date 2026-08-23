#include <stdio.h>

#include "cube.h"
#include "moves.h"

static int test_inverse(
    const char *move,
    const char *inverse
)
{
    RubixCube cube;

    cube_initialize(&cube);

    if (!cube_apply_move(&cube, move))
        return 0;

    if (!cube_apply_move(&cube, inverse))
        return 0;

    return cube_is_solved(&cube);
}

static int test_double_move(
    const char *move
)
{
    RubixCube cube;

    cube_initialize(&cube);

    if (!cube_apply_move(&cube, move))
        return 0;

    if (!cube_apply_move(&cube, move))
        return 0;

    return 1;
}

int main(void)
{
    printf("\n====================================\n");
    printf("          MOVE ENGINE TEST\n");
    printf("====================================\n\n");

    const char *moves[][2] =
    {
        {"U", "U'"},
        {"D", "D'"},
        {"L", "L'"},
        {"R", "R'"},
        {"F", "F'"},
        {"B", "B'"}
    };

    for (int i = 0; i < 6; i++)
    {
        if (test_inverse(moves[i][0], moves[i][1]))
            printf("PASS: %s + %s\n",
                   moves[i][0],
                   moves[i][1]);
        else
        {
            printf("FAIL: %s + %s\n",
                   moves[i][0],
                   moves[i][1]);
            return 1;
        }
    }

    const char *double_moves[] =
    {
        "U2",
        "D2",
        "L2",
        "R2",
        "F2",
        "B2"
    };

    for (int i = 0; i < 6; i++)
    {
        if (test_double_move(double_moves[i]))
            printf("PASS: %s executed twice\n",
                   double_moves[i]);
        else
        {
            printf("FAIL: %s\n",
                   double_moves[i]);
            return 1;
        }
    }

    RubixCube cube;
    cube_initialize(&cube);

    if (!cube_apply_move(&cube, "INVALID"))
    {
        printf("PASS: Invalid move rejected\n");
    }
    else
    {
        printf("FAIL: Invalid move accepted\n");
        return 1;
    }

    printf("\n====================================\n");
    printf("          MOVE ENGINE PASSED\n");
    printf("====================================\n\n");

    return 0;
}
