#include <stddef.h>

#include "solver.h"


/* ============================================================
   SOLVER LIFECYCLE
   ============================================================ */

void solver_solution_init(SolverSolution *solution)
{
    if (solution == NULL)
        return;

    solution->move_count = 0;

    for (int i = 0; i < SOLVER_MAX_MOVES; i++)
        solution->moves[i][0] = '\0';
}


/* ============================================================
   STEP NAMES
   ============================================================ */

const char *solver_step_name(SolverStep step)
{
    switch (step)
    {
        case SOLVER_STEP_WHITE_CROSS:
            return "White Cross";

        case SOLVER_STEP_WHITE_CORNERS:
            return "White Corners";

        case SOLVER_STEP_SECOND_LAYER:
            return "Second Layer";

        case SOLVER_STEP_YELLOW_CROSS:
            return "Yellow Cross";

        case SOLVER_STEP_YELLOW_FACE:
            return "Yellow Face";

        case SOLVER_STEP_LAST_LAYER_CORNERS:
            return "Last Layer Corners";

        case SOLVER_STEP_LAST_LAYER_EDGES:
            return "Last Layer Edges";

        case SOLVER_STEP_SOLVED:
            return "Cube Solved";

        default:
            return "Unknown Step";
    }
}


/* ============================================================
   WHITE CROSS RECOGNITION
   ============================================================ */

int solver_white_cross_complete(const RubixCube *cube)
{
    if (cube == NULL)
        return 0;

    if (cube->stickers[0][0][1] != 'W')
        return 0;

    if (cube->stickers[0][1][0] != 'W')
        return 0;

    if (cube->stickers[0][1][2] != 'W')
        return 0;

    if (cube->stickers[0][2][1] != 'W')
        return 0;

    if (cube->stickers[2][0][1] !=
        cube->stickers[2][1][1])
        return 0;

    if (cube->stickers[3][0][1] !=
        cube->stickers[3][1][1])
        return 0;

    if (cube->stickers[4][0][1] !=
        cube->stickers[4][1][1])
        return 0;

    if (cube->stickers[5][0][1] !=
        cube->stickers[5][1][1])
        return 0;

    return 1;
}


/* ============================================================
   WHITE CORNERS
   ============================================================ */

static int white_corners_complete(const RubixCube *cube)
{
    if (cube == NULL)
        return 0;

    if (cube->stickers[0][0][0] != 'W')
        return 0;

    if (cube->stickers[0][0][2] != 'W')
        return 0;

    if (cube->stickers[0][2][0] != 'W')
        return 0;

    if (cube->stickers[0][2][2] != 'W')
        return 0;

    return 1;
}


/* ============================================================
   STEP COMPLETION
   ============================================================ */

int solver_step_complete(
    const RubixCube *cube,
    SolverStep step
)
{
    if (cube == NULL)
        return 0;

    switch (step)
    {
        case SOLVER_STEP_WHITE_CROSS:
            return solver_white_cross_complete(cube);

        case SOLVER_STEP_WHITE_CORNERS:
            return white_corners_complete(cube);

        case SOLVER_STEP_SECOND_LAYER:
        case SOLVER_STEP_YELLOW_CROSS:
        case SOLVER_STEP_YELLOW_FACE:
        case SOLVER_STEP_LAST_LAYER_CORNERS:
        case SOLVER_STEP_LAST_LAYER_EDGES:
            return 0;

        case SOLVER_STEP_SOLVED:
            return cube_is_solved(cube);

        default:
            return 0;
    }
}


/* ============================================================
   WHITE EDGE TEST
   ============================================================ */

/*
 * A valid White edge must contain:
 *
 *     exactly one W
 *
 * across its two stickers.
 *
 * This prevents a single White sticker from incorrectly
 * identifying an edge when the other sticker belongs
 * to another physical edge.
 */

static int is_white_edge(char a, char b)
{
    return
        ((a == 'W' && b != 'W') ||
         (a != 'W' && b == 'W'));
}


/* ============================================================
   WHITE EDGE LOCATOR
   ============================================================ */

WhiteEdgeLocation solver_find_white_edge(
    const RubixCube *cube
)
{
    if (cube == NULL)
        return WHITE_EDGE_NONE;


    /*
     * UF
     */

    if (is_white_edge(
            cube->stickers[0][2][1],
            cube->stickers[2][0][1]))
    {
        return WHITE_EDGE_UF;
    }


    /*
     * UR
     */

    if (is_white_edge(
            cube->stickers[0][1][2],
            cube->stickers[5][0][1]))
    {
        return WHITE_EDGE_UR;
    }


    /*
     * UB
     */

    if (is_white_edge(
            cube->stickers[0][0][1],
            cube->stickers[3][0][1]))
    {
        return WHITE_EDGE_UB;
    }


    /*
     * UL
     */

    if (is_white_edge(
            cube->stickers[0][1][0],
            cube->stickers[4][0][1]))
    {
        return WHITE_EDGE_UL;
    }


    /*
     * DF
     */

    if (is_white_edge(
            cube->stickers[1][0][1],
            cube->stickers[2][2][1]))
    {
        return WHITE_EDGE_DF;
    }


    /*
     * DR
     */

    if (is_white_edge(
            cube->stickers[1][1][2],
            cube->stickers[5][2][1]))
    {
        return WHITE_EDGE_DR;
    }


    /*
     * DB
     */

    if (is_white_edge(
            cube->stickers[1][2][1],
            cube->stickers[3][2][1]))
    {
        return WHITE_EDGE_DB;
    }


    /*
     * DL
     */

    if (is_white_edge(
            cube->stickers[1][1][0],
            cube->stickers[4][2][1]))
    {
        return WHITE_EDGE_DL;
    }


    /*
     * FR
     */

    if (is_white_edge(
            cube->stickers[2][1][2],
            cube->stickers[5][1][0]))
    {
        return WHITE_EDGE_FR;
    }


    /*
     * FL
     */

    if (is_white_edge(
            cube->stickers[2][1][0],
            cube->stickers[4][1][2]))
    {
        return WHITE_EDGE_FL;
    }


    /*
     * BR
     */

    if (is_white_edge(
            cube->stickers[3][1][0],
            cube->stickers[5][1][2]))
    {
        return WHITE_EDGE_BR;
    }


    /*
     * BL
     */

    if (is_white_edge(
            cube->stickers[3][1][2],
            cube->stickers[4][1][0]))
    {
        return WHITE_EDGE_BL;
    }


    return WHITE_EDGE_NONE;
}


/* ============================================================
   WHITE EDGE NAME
   ============================================================ */

const char *solver_white_edge_name(
    WhiteEdgeLocation location
)
{
    switch (location)
    {
        case WHITE_EDGE_UF:
            return "UF";

        case WHITE_EDGE_UR:
            return "UR";

        case WHITE_EDGE_UB:
            return "UB";

        case WHITE_EDGE_UL:
            return "UL";

        case WHITE_EDGE_DF:
            return "DF";

        case WHITE_EDGE_DR:
            return "DR";

        case WHITE_EDGE_DB:
            return "DB";

        case WHITE_EDGE_DL:
            return "DL";

        case WHITE_EDGE_FR:
            return "FR";

        case WHITE_EDGE_FL:
            return "FL";

        case WHITE_EDGE_BR:
            return "BR";

        case WHITE_EDGE_BL:
            return "BL";

        default:
            return "NONE";
    }
}


/* ============================================================
   COUNT WHITE EDGES
   ============================================================ */

int solver_count_white_edges(
    const RubixCube *cube
)
{
    if (cube == NULL)
        return 0;

    int count = 0;

    if (is_white_edge(
            cube->stickers[0][2][1],
            cube->stickers[2][0][1]))
        count++;

    if (is_white_edge(
            cube->stickers[0][1][2],
            cube->stickers[5][0][1]))
        count++;

    if (is_white_edge(
            cube->stickers[0][0][1],
            cube->stickers[3][0][1]))
        count++;

    if (is_white_edge(
            cube->stickers[0][1][0],
            cube->stickers[4][0][1]))
        count++;

    if (is_white_edge(
            cube->stickers[1][0][1],
            cube->stickers[2][2][1]))
        count++;

    if (is_white_edge(
            cube->stickers[1][1][2],
            cube->stickers[5][2][1]))
        count++;

    if (is_white_edge(
            cube->stickers[1][2][1],
            cube->stickers[3][2][1]))
        count++;

    if (is_white_edge(
            cube->stickers[1][1][0],
            cube->stickers[4][2][1]))
        count++;

    if (is_white_edge(
            cube->stickers[2][1][2],
            cube->stickers[5][1][0]))
        count++;

    if (is_white_edge(
            cube->stickers[2][1][0],
            cube->stickers[4][1][2]))
        count++;

    if (is_white_edge(
            cube->stickers[3][1][0],
            cube->stickers[5][1][2]))
        count++;

    if (is_white_edge(
            cube->stickers[3][1][2],
            cube->stickers[4][1][0]))
        count++;

    return count;
}


/* ============================================================
   WHITE EDGE SOLVED DETECTION
   ============================================================ */

int solver_white_edge_solved(
    const RubixCube *cube,
    WhiteEdgeLocation location
)
{
    if (cube == NULL)
        return 0;

    switch (location)
    {
        /*
         * UF
         *
         * U[2][1] = White
         * F[0][1] = Front center
         */

        case WHITE_EDGE_UF:

            return
                cube->stickers[0][2][1] == 'W' &&
                cube->stickers[2][0][1] ==
                cube->stickers[2][1][1];


        /*
         * UR
         */

        case WHITE_EDGE_UR:

            return
                cube->stickers[0][1][2] == 'W' &&
                cube->stickers[5][0][1] ==
                cube->stickers[5][1][1];


        /*
         * UB
         */

        case WHITE_EDGE_UB:

            return
                cube->stickers[0][0][1] == 'W' &&
                cube->stickers[3][0][1] ==
                cube->stickers[3][1][1];


        /*
         * UL
         */

        case WHITE_EDGE_UL:

            return
                cube->stickers[0][1][0] == 'W' &&
                cube->stickers[4][0][1] ==
                cube->stickers[4][1][1];


        /*
         * A White edge in the Down or Middle layer
         * is not part of the completed White Cross.
         */

        case WHITE_EDGE_DF:
        case WHITE_EDGE_DR:
        case WHITE_EDGE_DB:
        case WHITE_EDGE_DL:
        case WHITE_EDGE_FR:
        case WHITE_EDGE_FL:
        case WHITE_EDGE_BR:
        case WHITE_EDGE_BL:

            return 0;


        case WHITE_EDGE_NONE:
        default:

            return 0;
    }
}
