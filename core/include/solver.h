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


/* ============================================================
   SOLVER SOLUTION
   ============================================================ */

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
   WHITE EDGE INFORMATION
   ============================================================ */

typedef struct
{
    WhiteEdgeLocation location;

    char white_color;
    char side_color;

} WhiteEdgeInfo;


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
   WHITE CROSS RECOGNITION
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

const char *solver_white_edge_name(
    WhiteEdgeLocation location
);

int solver_count_white_edges(
    const RubixCube *cube
);


/* ============================================================
   WHITE EDGE INFORMATION
   ============================================================ */

WhiteEdgeInfo solver_get_white_edge_info(
    const RubixCube *cube,
    WhiteEdgeLocation location
);


/* ============================================================
   WHITE EDGE SOLVED DETECTION
   ============================================================ */

int solver_white_edge_solved(
    const RubixCube *cube,
    WhiteEdgeLocation location
);


/* ============================================================
   WHITE CROSS TARGET
   ============================================================ */

/*
 * Determine the correct White Cross slot for a White edge.
 *
 * Example:
 *
 * White + Green  -> UF
 * White + Red    -> UR
 * White + Blue   -> UB
 * White + Orange -> UL
 *
 * Returns WHITE_EDGE_NONE if the target cannot be determined.
 */
WhiteEdgeLocation solver_white_edge_target(
    const RubixCube *cube,
    WhiteEdgeLocation location
);


/* ============================================================
   WHITE CROSS MOVE PLANNER
   ============================================================ */

/*
 * Return the basic move associated with a White edge location.
 *
 * This is an initial planning interface.
 * Full state-aware planning will be added later.
 */
const char *solver_white_edge_next_move(
    WhiteEdgeLocation location
);


#endif
