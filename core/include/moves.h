#ifndef RUBIX_MOVES_H
#define RUBIX_MOVES_H

#include "cube.h"

/* Apply one standard Rubik's Cube move.
 *
 * Supported:
 * U U' U2
 * D D' D2
 * L L' L2
 * R R' R2
 * F F' F2
 * B B' B2
 *
 * Returns:
 * 1 = valid move
 * 0 = invalid move
 */
int cube_apply_move(
    RubixCube *cube,
    const char *move
);

#endif
