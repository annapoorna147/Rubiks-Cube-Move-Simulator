#ifndef RUBIX_SCRAMBLE_H
#define RUBIX_SCRAMBLE_H

#include "cube.h"

#define SCRAMBLE_MAX_LENGTH 100

/*
 * Generate a random scramble.
 *
 * Example:
 * R U2 F' L D B2
 */
int scramble_generate(
    char moves[][4],
    int max_moves,
    unsigned int *seed
);

/*
 * Apply a generated scramble to a cube.
 */
int scramble_apply(
    RubixCube *cube,
    char moves[][4],
    int move_count
);

#endif
