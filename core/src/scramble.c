#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

#include "scramble.h"
#include "move_parser.h"

static const char FACES[] = {
    'U', 'D', 'L', 'R', 'F', 'B'
};

static const char *SUFFIXES[] = {
    "",
    "'",
    "2"
};

int scramble_generate(
    char moves[][4],
    int max_moves,
    unsigned int *seed
)
{
    if (moves == NULL || max_moves <= 0 || seed == NULL)
        return 0;

    int previous_face = -1;

    for (int i = 0; i < max_moves; i++)
    {
        int face;

        /*
         * Prevent consecutive moves on the same face.
         */
        do
        {
            *seed = (*seed * 1103515245u) + 12345u;
            face = (int)((*seed >> 16) % 6);
        }
        while (face == previous_face);

        *seed = (*seed * 1103515245u) + 12345u;

        int suffix =
            (int)((*seed >> 16) % 3);

        snprintf(
            moves[i],
            4,
            "%c%s",
            FACES[face],
            SUFFIXES[suffix]
        );

        previous_face = face;
    }

    return max_moves;
}

int scramble_apply(
    RubixCube *cube,
    char moves[][4],
    int move_count
)
{
    if (cube == NULL || moves == NULL)
        return 0;

    if (move_count < 0)
        return 0;

    for (int i = 0; i < move_count; i++)
    {
        if (!cube_apply_move(cube, moves[i]))
            return 0;
    }

    return 1;
}
