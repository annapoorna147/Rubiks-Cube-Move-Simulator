#include <stddef.h>
#include <string.h>

#include "move_parser.h"

static int apply_base_move(
    RubixCube *cube,
    char move
)
{
    switch (move)
    {
        case 'U':
            cube_move_U(cube);
            return 1;

        case 'D':
            cube_move_D(cube);
            return 1;

        case 'L':
            cube_move_L(cube);
            return 1;

        case 'R':
            cube_move_R(cube);
            return 1;

        case 'F':
            cube_move_F(cube);
            return 1;

        case 'B':
            cube_move_B(cube);
            return 1;

        default:
            return 0;
    }
}

int cube_apply_move(
    RubixCube *cube,
    const char *move
)
{
    if (cube == NULL || move == NULL)
        return 0;

    if (move[0] == '\0')
        return 0;

    char face = move[0];

    if (!apply_base_move(cube, face))
        return 0;

    /*
     * Normal move:
     *
     * R
     */
    if (move[1] == '\0')
        return 1;

    /*
     * Double move:
     *
     * R2
     */
    if (move[1] == '2' && move[2] == '\0')
    {
        apply_base_move(cube, face);
        return 1;
    }

    /*
     * Prime move:
     *
     * R'
     *
     * We already performed one clockwise move,
     * so perform two additional clockwise moves.
     */
    if (move[1] == '\'' && move[2] == '\0')
    {
        apply_base_move(cube, face);
        apply_base_move(cube, face);
        return 1;
    }

    return 0;
}

int cube_apply_sequence(
    RubixCube *cube,
    const char *sequence
)
{
    if (cube == NULL || sequence == NULL)
        return 0;

    char token[MOVE_TOKEN_LENGTH];
    int token_length = 0;

    for (size_t i = 0;; i++)
    {
        char c = sequence[i];

        /*
         * End current token at whitespace
         * or end of string.
         */
        if (c == ' ' || c == '\t' ||
            c == '\n' || c == '\0')
        {
            if (token_length > 0)
            {
                token[token_length] = '\0';

                if (!cube_apply_move(cube, token))
                    return 0;

                token_length = 0;
            }

            if (c == '\0')
                break;

            continue;
        }

        if (token_length >= MOVE_TOKEN_LENGTH - 1)
            return 0;

        token[token_length++] = c;
    }

    return 1;
}
