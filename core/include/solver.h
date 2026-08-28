#ifndef RUBIX_SOLVER_H
#define RUBIX_SOLVER_H

#include "cube.h"

#define SOLVER_MAX_MOVES 1000
#define SOLVER_MOVE_LENGTH 4

typedef enum
{
    SOLVER_STEP_WHITE_CROSS = 0,
    SOLVER_STEP_WHITE_CORNERS,
    SOLVER_STEP_SECOND_LAYER,
    SOLVER_STEP_YELLOW_CROSS,
    SOLVER_STEP_YELLOW_FACE,
    SOLVER_STEP_LAST_LAYER_CORNERS,
    SOLVER_STEP_LAST_LAYER_EDGES,
    SOLVER_STEP_SOLVED
} SolverStep;


typedef struct
{
    char moves[SOLVER_MAX_MOVES][SOLVER_MOVE_LENGTH];
    int move_count;
} SolverSolution;


/* ============================================================
   WHITE EDGE LOCATIONS
   ============================================================ */

typedef enum
{
    WHITE_EDGE_NONE = 0,

    WHITE_EDGE_UF,
    WHITE_EDGE_UR,
    WHITE_EDGE_UB,
    WHITE_EDGE_UL,

    WHITE_EDGE_DF,
    WHITE_EDGE_DR,
    WHITE_EDGE_DB,
    WHITE_EDGE_DL,

    WHITE_EDGE_FR,
    WHITE_EDGE_FL,
    WHITE_EDGE_BR,
    WHITE_EDGE_BL
} WhiteEdgeLocation;


/* ============================================================
   SOLVER LIFECYCLE
   ============================================================ */

void solver_solution_init(
    SolverSolution *solution
);


/* ============================================================
   STEP INFORMATION
   ============================================================ */

const char *solver_step_name(
    SolverStep step
);


/* ============================================================
   STEP COMPLETION
   ============================================================ */

int solver_step_complete(
    const RubixCube *cube,
    SolverStep step
);


/* ============================================================
   WHITE CROSS
   ============================================================ */

int solver_white_cross_complete(
    const RubixCube *cube
);


/* ============================================================
   WHITE EDGE LOCATOR
   ============================================================ */

WhiteEdgeLocation solver_find_white_edge(
    const RubixCube *cube
);


/*
 * Find a White edge using its side color.
 *
 * Example:
 *     'G' -> White/Green edge
 *     'R' -> White/Red edge
 *     'B' -> White/Blue edge
 *     'O' -> White/Orange edge
 */
WhiteEdgeLocation solver_find_white_edge_by_color(
    const RubixCube *cube,
    char side_color
);


/*
 * Return a readable edge name.
 */
const char *solver_white_edge_name(
    WhiteEdgeLocation location
);


/*
 * Count White edge pieces.
 */
int solver_count_white_edges(
    const RubixCube *cube
);


/* ============================================================
   WHITE EDGE SOLVED DETECTION
   ============================================================ */

int solver_white_edge_solved(
    const RubixCube *cube,
    WhiteEdgeLocation location
);


/* ============================================================
   WHITE EDGE INFORMATION
   ============================================================ */

typedef struct
{
    WhiteEdgeLocation location;
    char white_color;
    char side_color;
} WhiteEdgeInfo;


WhiteEdgeInfo solver_get_white_edge_info(
    const RubixCube *cube,
    WhiteEdgeLocation location
);


/* ============================================================
   WHITE EDGE MOVE PLANNER
   ============================================================ */

const char *solver_white_edge_next_move(
    WhiteEdgeLocation location
);


/* ============================================================
   WHITE CROSS TARGET
   ============================================================ */

WhiteEdgeLocation solver_white_edge_target(
    const RubixCube *cube,
    WhiteEdgeLocation location
);

#endif
