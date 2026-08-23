#include <string.h>

#include "moves.h"

int cube_apply_move(
    RubixCube *cube,
    const char *move
)
{
    if (cube == NULL || move == NULL)
        return 0;

    if (strcmp(move, "U") == 0)
    {
        cube_move_U(cube);
        return 1;
    }

    if (strcmp(move, "U'") == 0)
    {
        cube_move_U_prime(cube);
        return 1;
    }

    if (strcmp(move, "U2") == 0)
    {
        cube_move_U2(cube);
        return 1;
    }

    if (strcmp(move, "D") == 0)
    {
        cube_move_D(cube);
        return 1;
    }

    if (strcmp(move, "D'") == 0)
    {
        cube_move_D_prime(cube);
        return 1;
    }

    if (strcmp(move, "D2") == 0)
    {
        cube_move_D2(cube);
        return 1;
    }

    if (strcmp(move, "L") == 0)
    {
        cube_move_L(cube);
        return 1;
    }

    if (strcmp(move, "L'") == 0)
    {
        cube_move_L_prime(cube);
        return 1;
    }

    if (strcmp(move, "L2") == 0)
    {
        cube_move_L2(cube);
        return 1;
    }

    if (strcmp(move, "R") == 0)
    {
        cube_move_R(cube);
        return 1;
    }

    if (strcmp(move, "R'") == 0)
    {
        cube_move_R_prime(cube);
        return 1;
    }

    if (strcmp(move, "R2") == 0)
    {
        cube_move_R2(cube);
        return 1;
    }

    if (strcmp(move, "F") == 0)
    {
        cube_move_F(cube);
        return 1;
    }

    if (strcmp(move, "F'") == 0)
    {
        cube_move_F_prime(cube);
        return 1;
    }

    if (strcmp(move, "F2") == 0)
    {
        cube_move_F2(cube);
        return 1;
    }

    if (strcmp(move, "B") == 0)
    {
        cube_move_B(cube);
        return 1;
    }

    if (strcmp(move, "B'") == 0)
    {
        cube_move_B_prime(cube);
        return 1;
    }

    if (strcmp(move, "B2") == 0)
    {
        cube_move_B2(cube);
        return 1;
    }

    return 0;
}
