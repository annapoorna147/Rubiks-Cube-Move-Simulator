#include <stddef.h>
#include "cube.h"

static const char COLORS[RUBIX_FACES] = {
    'W', 'Y', 'G', 'B', 'O', 'R'
};

void cube_initialize(RubixCube *cube)
{
    for (int face = 0; face < RUBIX_FACES; face++)
    {
        for (int row = 0; row < RUBIX_SIZE; row++)
        {
            for (int col = 0; col < RUBIX_SIZE; col++)
            {
                cube->stickers[face][row][col] = COLORS[face];
            }
        }
    }
}

void cube_reset(RubixCube *cube)
{
    cube_initialize(cube);
}

void cube_rotate_face_clockwise(RubixCube *cube, int face)
{
    char temp[RUBIX_SIZE][RUBIX_SIZE];

    for (int row = 0; row < RUBIX_SIZE; row++)
    {
        for (int col = 0; col < RUBIX_SIZE; col++)
        {
            temp[row][col] = cube->stickers[face][row][col];
        }
    }

    for (int row = 0; row < RUBIX_SIZE; row++)
    {
        for (int col = 0; col < RUBIX_SIZE; col++)
        {
            cube->stickers[face][col][RUBIX_SIZE - 1 - row] =
                temp[row][col];
        }
    }
}

/* =========================
   R MOVE
   ========================= */

void cube_move_R(RubixCube *cube)
{
    char temp[RUBIX_SIZE];

    cube_rotate_face_clockwise(cube, 5);

    for (int i = 0; i < RUBIX_SIZE; i++)
        temp[i] = cube->stickers[0][i][2];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[0][i][2] = cube->stickers[2][i][2];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[2][i][2] = cube->stickers[1][i][2];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[1][i][2] =
            cube->stickers[3][RUBIX_SIZE - 1 - i][0];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[3][RUBIX_SIZE - 1 - i][0] = temp[i];
}

void cube_move_R_prime(RubixCube *cube)
{
    cube_move_R(cube);
    cube_move_R(cube);
    cube_move_R(cube);
}

void cube_move_R2(RubixCube *cube)
{
    cube_move_R(cube);
    cube_move_R(cube);
}

/* =========================
   L MOVE
   ========================= */

void cube_move_L(RubixCube *cube)
{
    char temp[RUBIX_SIZE];

    cube_rotate_face_clockwise(cube, 4);

    for (int i = 0; i < RUBIX_SIZE; i++)
        temp[i] = cube->stickers[0][i][0];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[0][i][0] =
            cube->stickers[3][RUBIX_SIZE - 1 - i][2];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[3][RUBIX_SIZE - 1 - i][2] =
            cube->stickers[1][i][0];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[1][i][0] = cube->stickers[2][i][0];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[2][i][0] = temp[i];
}

void cube_move_L_prime(RubixCube *cube)
{
    cube_move_L(cube);
    cube_move_L(cube);
    cube_move_L(cube);
}

void cube_move_L2(RubixCube *cube)
{
    cube_move_L(cube);
    cube_move_L(cube);
}

/* =========================
   U MOVE
   ========================= */

void cube_move_U(RubixCube *cube)
{
    char temp[RUBIX_SIZE];

    cube_rotate_face_clockwise(cube, 0);

    for (int i = 0; i < RUBIX_SIZE; i++)
        temp[i] = cube->stickers[2][0][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[2][0][i] = cube->stickers[4][0][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[4][0][i] = cube->stickers[3][0][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[3][0][i] = cube->stickers[5][0][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[5][0][i] = temp[i];
}

void cube_move_U_prime(RubixCube *cube)
{
    cube_move_U(cube);
    cube_move_U(cube);
    cube_move_U(cube);
}

void cube_move_U2(RubixCube *cube)
{
    cube_move_U(cube);
    cube_move_U(cube);
}

/* =========================
   D MOVE
   ========================= */

void cube_move_D(RubixCube *cube)
{
    char temp[RUBIX_SIZE];

    cube_rotate_face_clockwise(cube, 1);

    for (int i = 0; i < RUBIX_SIZE; i++)
        temp[i] = cube->stickers[2][2][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[2][2][i] = cube->stickers[5][2][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[5][2][i] = cube->stickers[3][2][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[3][2][i] = cube->stickers[4][2][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[4][2][i] = temp[i];
}

void cube_move_D_prime(RubixCube *cube)
{
    cube_move_D(cube);
    cube_move_D(cube);
    cube_move_D(cube);
}

void cube_move_D2(RubixCube *cube)
{
    cube_move_D(cube);
    cube_move_D(cube);
}

/* =========================
   F MOVE
   ========================= */

void cube_move_F(RubixCube *cube)
{
    char temp[RUBIX_SIZE];

    cube_rotate_face_clockwise(cube, 2);

    for (int i = 0; i < RUBIX_SIZE; i++)
        temp[i] = cube->stickers[0][2][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[0][2][i] =
            cube->stickers[4][RUBIX_SIZE - 1 - i][2];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[4][RUBIX_SIZE - 1 - i][2] =
            cube->stickers[1][0][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[1][0][i] =
            cube->stickers[5][RUBIX_SIZE - 1 - i][0];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[5][RUBIX_SIZE - 1 - i][0] = temp[i];
}

void cube_move_F_prime(RubixCube *cube)
{
    cube_move_F(cube);
    cube_move_F(cube);
    cube_move_F(cube);
}

void cube_move_F2(RubixCube *cube)
{
    cube_move_F(cube);
    cube_move_F(cube);
}

/* =========================
   B MOVE
   ========================= */

void cube_move_B(RubixCube *cube)
{
    char temp[RUBIX_SIZE];

    cube_rotate_face_clockwise(cube, 3);

    for (int i = 0; i < RUBIX_SIZE; i++)
        temp[i] = cube->stickers[0][0][i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[0][0][i] = cube->stickers[5][i][2];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[5][i][2] =
            cube->stickers[1][2][RUBIX_SIZE - 1 - i];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[1][2][RUBIX_SIZE - 1 - i] =
            cube->stickers[4][i][0];

    for (int i = 0; i < RUBIX_SIZE; i++)
        cube->stickers[4][i][0] = temp[i];
}

void cube_move_B_prime(RubixCube *cube)
{
    cube_move_B(cube);
    cube_move_B(cube);
    cube_move_B(cube);
}

void cube_move_B2(RubixCube *cube)
{
    cube_move_B(cube);
    cube_move_B(cube);
}

/* =========================
   SOLVED CHECK
   ========================= */

int cube_is_solved(const RubixCube *cube)
{
    for (int face = 0; face < RUBIX_FACES; face++)
    {
        for (int row = 0; row < RUBIX_SIZE; row++)
        {
            for (int col = 0; col < RUBIX_SIZE; col++)
            {
                if (cube->stickers[face][row][col] != COLORS[face])
                    return 0;
            }
        }
    }

    return 1;
}

int cube_is_valid_color_count(const RubixCube *cube)
{
    if (cube == NULL)
        return 0;

    int counts[256] = {0};

    for (int face = 0; face < RUBIX_FACES; face++)
    {
        for (int row = 0; row < RUBIX_SIZE; row++)
        {
            for (int col = 0; col < RUBIX_SIZE; col++)
            {
                unsigned char color =
                    (unsigned char)cube->stickers[face][row][col];

                counts[color]++;
            }
        }
    }

    /*
     * A standard 3x3 cube has exactly
     * nine stickers of each of its six colors.
     */
    const char colors[RUBIX_FACES] =
    {
        'W', 'Y', 'G', 'B', 'O', 'R'
    };

    for (int i = 0; i < RUBIX_FACES; i++)
    {
        if (counts[(unsigned char)colors[i]] != 9)
            return 0;
    }

    /*
     * Reject unexpected colors.
     */
    for (int color = 0; color < 256; color++)
    {
        if (counts[color] > 0)
        {
            int known = 0;

            for (int i = 0; i < RUBIX_FACES; i++)
            {
                if (color == (unsigned char)colors[i])
                {
                    known = 1;
                    break;
                }
            }

            if (!known)
                return 0;
        }
    }

    return 1;
}
