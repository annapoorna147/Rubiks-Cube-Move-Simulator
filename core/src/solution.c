#include <stddef.h>
#include <string.h>

#include "solution.h"
#include "move_parser.h"

int solution_inverse_move(
    const char *move,
    char *inverse
)
{
    if (move == NULL || inverse == NULL)
        return 0;

    if (move[0] == '\0')
        return 0;

    char face = move[0];

    if (face != 'U' &&
        face != 'D' &&
        face != 'L' &&
        face != 'R' &&
        face != 'F' &&
        face != 'B')
    {
        return 0;
    }

    /*
     * Normal move:
     *
     * R -> R'
     */
    if (move[1] == '\0')
    {
        inverse[0] = face;
        inverse[1] = '\'';
        inverse[2] = '\0';

        return 1;
    }

    /*
     * Prime move:
     *
     * R' -> R
     */
    if (move[1] == '\'' &&
        move[2] == '\0')
    {
        inverse[0] = face;
        inverse[1] = '\0';

        return 1;
    }

    /*
     * Double move:
     *
     * R2 -> R2
     */
    if (move[1] == '2' &&
        move[2] == '\0')
    {
        inverse[0] = face;
        inverse[1] = '2';
        inverse[2] = '\0';

        return 1;
    }

    return 0;
}

int solution_inverse_sequence(
    char moves[][4],
    int move_count,
    char output[][4]
)
{
    if (moves == NULL || output == NULL)
        return 0;

    if (move_count < 0)
        return 0;

    for (int i = 0; i < move_count; i++)
    {
        int source = move_count - 1 - i;

        if (!solution_inverse_move(
                moves[source],
                output[i]))
        {
            return 0;
        }
    }

    return 1;
}

int solution_verify(
    const RubixCube *scrambled,
    char moves[][4],
    int move_count
)
{
    if (scrambled == NULL || moves == NULL)
        return 0;

    if (move_count < 0)
        return 0;

    RubixCube test_cube = *scrambled;

    for (int i = 0; i < move_count; i++)
    {
        if (!cube_apply_move(
                &test_cube,
                moves[i]))
        {
            return 0;
        }
    }

    return cube_is_solved(&test_cube);
}
