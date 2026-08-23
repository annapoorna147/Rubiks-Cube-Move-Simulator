#ifndef RUBIX_SOLUTION_H
#define RUBIX_SOLUTION_H

#include "cube.h"

/*
 * Create the inverse of a move.
 *
 * R  -> R'
 * R' -> R
 * R2 -> R2
 */
int solution_inverse_move(
    const char *move,
    char *inverse
);

/*
 * Reverse an entire move sequence.
 *
 * Example:
 *
 * R U F'
 *
 * becomes:
 *
 * F U' R'
 */
int solution_inverse_sequence(
    char moves[][4],
    int move_count,
    char output[][4]
);

/*
 * Verify that applying a solution solves a cube.
 */
int solution_verify(
    const RubixCube *scrambled,
    char moves[][4],
    int move_count
);

#endif
