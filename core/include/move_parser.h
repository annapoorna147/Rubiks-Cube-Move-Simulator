#ifndef RUBIX_MOVE_PARSER_H
#define RUBIX_MOVE_PARSER_H

#include "cube.h"

#define MOVE_TOKEN_LENGTH 4
#define MOVE_SEQUENCE_MAX 1000

/*
 * Apply one move:
 *
 * U  D  L  R  F  B
 * U' D' L' R' F' B'
 * U2 D2 L2 R2 F2 B2
 */
int cube_apply_move(
    RubixCube *cube,
    const char *move
);

/*
 * Apply a complete move sequence.
 *
 * Example:
 * "R U R' U'"
 */
int cube_apply_sequence(
    RubixCube *cube,
    const char *sequence
);

#endif
