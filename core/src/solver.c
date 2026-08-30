#include <stddef.h>

#include "solver.h"
#include "moves.h"


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


/* ============================================================
   FIND WHITE EDGE BY SIDE COLOR
   ============================================================ */

WhiteEdgeLocation solver_find_white_edge_by_color(
    const RubixCube *cube,
    char side_color
)
{
    if (cube == NULL)
        return WHITE_EDGE_NONE;

    WhiteEdgeLocation locations[] =
    {
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
    };

    int count =
        sizeof(locations) / sizeof(locations[0]);

    for (int i = 0; i < count; i++)
    {
        WhiteEdgeInfo info =
            solver_get_white_edge_info(
                cube,
                locations[i]
            );

        if (info.white_color == 'W' &&
            info.side_color == side_color)
        {
            return locations[i];
        }
    }

    return WHITE_EDGE_NONE;
}


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
   WHITE EDGE INFORMATION
   ============================================================ */

WhiteEdgeInfo solver_get_white_edge_info(
    const RubixCube *cube,
    WhiteEdgeLocation location
)
{
    WhiteEdgeInfo info;

    info.location = location;
    info.white_color = '\0';
    info.side_color = '\0';

    if (cube == NULL)
        return info;

    char a = '\0';
    char b = '\0';

    switch (location)
    {
        case WHITE_EDGE_UF:
            a = cube->stickers[0][2][1];
            b = cube->stickers[2][0][1];
            break;

        case WHITE_EDGE_UR:
            a = cube->stickers[0][1][2];
            b = cube->stickers[5][0][1];
            break;

        case WHITE_EDGE_UB:
            a = cube->stickers[0][0][1];
            b = cube->stickers[3][0][1];
            break;

        case WHITE_EDGE_UL:
            a = cube->stickers[0][1][0];
            b = cube->stickers[4][0][1];
            break;

        case WHITE_EDGE_DF:
            a = cube->stickers[1][0][1];
            b = cube->stickers[2][2][1];
            break;

        case WHITE_EDGE_DR:
            a = cube->stickers[1][1][2];
            b = cube->stickers[5][2][1];
            break;

        case WHITE_EDGE_DB:
            a = cube->stickers[1][2][1];
            b = cube->stickers[3][2][1];
            break;

        case WHITE_EDGE_DL:
            a = cube->stickers[1][1][0];
            b = cube->stickers[4][2][1];
            break;

        case WHITE_EDGE_FR:
            a = cube->stickers[2][1][2];
            b = cube->stickers[5][1][0];
            break;

        case WHITE_EDGE_FL:
            a = cube->stickers[2][1][0];
            b = cube->stickers[4][1][2];
            break;

        case WHITE_EDGE_BR:
            a = cube->stickers[3][1][0];
            b = cube->stickers[5][1][2];
            break;

        case WHITE_EDGE_BL:
            a = cube->stickers[3][1][2];
            b = cube->stickers[4][1][0];
            break;

        case WHITE_EDGE_NONE:
        default:
            return info;
    }

    /*
     * Identify which sticker is White.
     *
     * The other sticker is the side color.
     */
    if (a == 'W')
    {
        info.white_color = a;
        info.side_color = b;
    }
    else if (b == 'W')
    {
        info.white_color = b;
        info.side_color = a;
    }

    return info;
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


/* ============================================================
   WHITE CROSS MOVE PLANNER
   ============================================================ */

const char *solver_white_edge_next_move(
    WhiteEdgeLocation location
)
{
    switch (location)
    {
        case WHITE_EDGE_DF:
            return "F2";

        case WHITE_EDGE_DR:
            return "R2";

        case WHITE_EDGE_DB:
            return "B2";

        case WHITE_EDGE_DL:
            return "L2";

        case WHITE_EDGE_FR:
            return "F";

        case WHITE_EDGE_FL:
            return "F'";

        case WHITE_EDGE_BR:
            return "B";

        case WHITE_EDGE_BL:
            return "B'";

        case WHITE_EDGE_UF:
        case WHITE_EDGE_UR:
        case WHITE_EDGE_UB:
        case WHITE_EDGE_UL:
            return "U";

        case WHITE_EDGE_NONE:
        default:
            return "";
    }
}

/* ============================================================
   WHITE CROSS TARGET
   ============================================================ */

WhiteEdgeLocation solver_white_edge_target(
    const RubixCube *cube,
    WhiteEdgeLocation location
)
{
    if (cube == NULL)
        return WHITE_EDGE_NONE;

    WhiteEdgeInfo info =
        solver_get_white_edge_info(cube, location);

    /*
     * The side color determines the correct
     * White Cross position.
     *
     * Green  -> UF
     * Red    -> UR
     * Blue   -> UB
     * Orange -> UL
     */

    switch (info.side_color)
    {
        case 'G':
            return WHITE_EDGE_UF;

        case 'R':
            return WHITE_EDGE_UR;

        case 'B':
            return WHITE_EDGE_UB;

        case 'O':
            return WHITE_EDGE_UL;

        default:
            return WHITE_EDGE_NONE;
    }
}


/* ============================================================
   WHITE CROSS EDGE PLANNER
   ============================================================ */

/*
 * Determine the first move needed to bring a White edge
 * toward its correct White Cross position.
 *
 * This is the first state-aware planning layer.
 */
const char *solver_white_cross_plan_move(
    const RubixCube *cube,
    char side_color
)
{
    if (cube == NULL)
        return "";

    WhiteEdgeLocation location =
        solver_find_white_edge_by_color(cube, side_color);

    if (location == WHITE_EDGE_NONE)
        return "";

    /*
     * If this White edge is already solved,
     * no move is required.
     */
    if (solver_white_edge_solved(cube, location))
        return "";

    /*
     * For Down-layer edges, a double turn brings
     * the edge toward the White Cross.
     */
    switch (location)
    {
        case WHITE_EDGE_DF:
            return "F2";

        case WHITE_EDGE_DR:
            return "R2";

        case WHITE_EDGE_DB:
            return "B2";

        case WHITE_EDGE_DL:
            return "L2";

        /*
         * Middle-layer edges need to be moved out
         * toward the appropriate face.
         */
        case WHITE_EDGE_FR:
            return "F";

        case WHITE_EDGE_FL:
            return "F'";

        case WHITE_EDGE_BR:
            return "B";

        case WHITE_EDGE_BL:
            return "B'";

        /*
         * Top-layer edges are handled by rotating
         * the U layer toward their target position.
         */
        case WHITE_EDGE_UF:
        case WHITE_EDGE_UR:
        case WHITE_EDGE_UB:
        case WHITE_EDGE_UL:
        {
            WhiteEdgeLocation target =
                solver_white_edge_target(cube, location);

            if (target == location)
                return "";

            switch (target)
            {
                case WHITE_EDGE_UF:
                    return "U";

                case WHITE_EDGE_UR:
                    return "U";

                case WHITE_EDGE_UB:
                    return "U2";

                case WHITE_EDGE_UL:
                    return "U'";

                default:
                    return "";
            }
        }

        case WHITE_EDGE_NONE:
        default:
            return "";
    }
}


/* ============================================================
   WHITE CROSS SOLVER
   ============================================================ */

static int solver_apply_white_cross_move(
    RubixCube *cube,
    SolverSolution *solution,
    char side_color
)
{
    if (cube == NULL || solution == NULL)
        return 0;

    const char *move =
        solver_white_cross_plan_move(cube, side_color);

    if (move == NULL || move[0] == '\0')
    {
        WhiteEdgeLocation location =
            solver_find_white_edge_by_color(cube, side_color);

        if (solver_white_edge_solved(cube, location))
            return 1;

        return 0;
    }

    if (solution->move_count >= SOLVER_MAX_MOVES)
        return 0;

    if (!cube_apply_move(cube, move))
        return 0;

    int i = 0;

    while (move[i] != '\0' &&
           i < SOLVER_MOVE_LENGTH - 1)
    {
        solution->moves[
            solution->move_count
        ][i] = move[i];

        i++;
    }

    solution->moves[
        solution->move_count
    ][i] = '\0';

    solution->move_count++;

    return 1;
}


/* ============================================================
   SOLVE ONE WHITE EDGE
   ============================================================ */

static int solver_solve_white_edge(
    RubixCube *cube,
    SolverSolution *solution,
    char side_color
)
{
    if (cube == NULL || solution == NULL)
        return 0;

    for (int attempt = 0; attempt < 20; attempt++)
    {
        WhiteEdgeLocation location =
            solver_find_white_edge_by_color(
                cube,
                side_color
            );

        if (location == WHITE_EDGE_NONE)
            return 0;

        if (solver_white_edge_solved(
                cube,
                location))
        {
            return 1;
        }

        const char *move =
            solver_white_cross_plan_move(
                cube,
                side_color
            );

        if (move == NULL || move[0] == '\0')
            return 0;

        if (!solver_apply_white_cross_move(
                cube,
                solution,
                side_color))
        {
            return 0;
        }
    }

    return 0;
}


/* ============================================================
   SOLVE WHITE CROSS
   ============================================================ */

int solver_solve_white_cross(
    RubixCube *cube,
    SolverSolution *solution
)
{
    if (cube == NULL || solution == NULL)
        return 0;

    solver_solution_init(solution);

    const char side_colors[4] =
    {
        'G',
        'R',
        'B',
        'O'
    };

    for (int i = 0; i < 4; i++)
    {
        if (!solver_solve_white_edge(
                cube,
                solution,
                side_colors[i]))
        {
            return 0;
        }
    }

    if (!solver_white_cross_complete(cube))
        return 0;

    solution->step = SOLVER_STEP_WHITE_CORNERS;

    return 1;
}


/* ============================================================
   WHITE CORNER RECOGNITION
   ============================================================ */

static int is_white_corner(
    char a,
    char b,
    char c
)
{
    int white_count = 0;

    if (a == 'W')
        white_count++;

    if (b == 'W')
        white_count++;

    if (c == 'W')
        white_count++;

    return white_count == 1;
}


WhiteCornerLocation solver_find_white_corner(
    const RubixCube *cube
)
{
    if (cube == NULL)
        return WHITE_CORNER_NONE;

    /*
     * UFR
     */
    if (is_white_corner(
            cube->stickers[0][2][2],
            cube->stickers[2][0][2],
            cube->stickers[5][0][0]))
    {
        return WHITE_CORNER_UFR;
    }

    /*
     * URB
     */
    if (is_white_corner(
            cube->stickers[0][0][2],
            cube->stickers[5][0][2],
            cube->stickers[3][0][0]))
    {
        return WHITE_CORNER_URB;
    }

    /*
     * UBL
     */
    if (is_white_corner(
            cube->stickers[0][0][0],
            cube->stickers[3][0][2],
            cube->stickers[4][0][0]))
    {
        return WHITE_CORNER_UBL;
    }

    /*
     * ULF
     */
    if (is_white_corner(
            cube->stickers[0][2][0],
            cube->stickers[4][0][2],
            cube->stickers[2][0][0]))
    {
        return WHITE_CORNER_ULF;
    }

    /*
     * DFR
     */
    if (is_white_corner(
            cube->stickers[1][0][2],
            cube->stickers[2][2][2],
            cube->stickers[5][2][0]))
    {
        return WHITE_CORNER_DFR;
    }

    /*
     * DRB
     */
    if (is_white_corner(
            cube->stickers[1][2][2],
            cube->stickers[5][2][2],
            cube->stickers[3][2][0]))
    {
        return WHITE_CORNER_DRB;
    }

    /*
     * DBL
     */
    if (is_white_corner(
            cube->stickers[1][2][0],
            cube->stickers[3][2][2],
            cube->stickers[4][2][0]))
    {
        return WHITE_CORNER_DBL;
    }

    /*
     * DLF
     */
    if (is_white_corner(
            cube->stickers[1][0][0],
            cube->stickers[4][2][2],
            cube->stickers[2][2][0]))
    {
        return WHITE_CORNER_DLF;
    }

    return WHITE_CORNER_NONE;
}


const char *solver_white_corner_name(
    WhiteCornerLocation location
)
{
    switch (location)
    {
        case WHITE_CORNER_UFR:
            return "UFR";

        case WHITE_CORNER_URB:
            return "URB";

        case WHITE_CORNER_UBL:
            return "UBL";

        case WHITE_CORNER_ULF:
            return "ULF";

        case WHITE_CORNER_DFR:
            return "DFR";

        case WHITE_CORNER_DRB:
            return "DRB";

        case WHITE_CORNER_DBL:
            return "DBL";

        case WHITE_CORNER_DLF:
            return "DLF";

        case WHITE_CORNER_NONE:
        default:
            return "NONE";
    }
}



/* ============================================================
   WHITE CORNER BY COLORS
   ============================================================ */

/*
 * Find a White corner containing the requested two side colors.
 *
 * Example:
 *
 *     color1 = G
 *     color2 = R
 *
 * finds the White-Green-Red corner.
 *
 * The order of color1/color2 does not matter.
 */

static int corner_has_colors(
    char a,
    char b,
    char c,
    char color1,
    char color2
)
{
    if (a != 'W' && b != 'W' && c != 'W')
        return 0;

    int found_color1 =
        (a == color1 || b == color1 || c == color1);

    int found_color2 =
        (a == color2 || b == color2 || c == color2);

    return found_color1 && found_color2;
}


WhiteCornerLocation solver_find_white_corner_by_colors(
    const RubixCube *cube,
    char color1,
    char color2
)
{
    if (cube == NULL)
        return WHITE_CORNER_NONE;

    /*
     * UFR = White / Green / Red
     */
    if (corner_has_colors(
            cube->stickers[0][2][2],
            cube->stickers[2][0][2],
            cube->stickers[5][0][0],
            color1,
            color2))
    {
        return WHITE_CORNER_UFR;
    }

    /*
     * URB = White / Red / Blue
     */
    if (corner_has_colors(
            cube->stickers[0][0][2],
            cube->stickers[5][0][2],
            cube->stickers[3][0][0],
            color1,
            color2))
    {
        return WHITE_CORNER_URB;
    }

    /*
     * UBL = White / Blue / Orange
     */
    if (corner_has_colors(
            cube->stickers[0][0][0],
            cube->stickers[3][0][2],
            cube->stickers[4][0][0],
            color1,
            color2))
    {
        return WHITE_CORNER_UBL;
    }

    /*
     * ULF = White / Orange / Green
     */
    if (corner_has_colors(
            cube->stickers[0][2][0],
            cube->stickers[4][0][2],
            cube->stickers[2][0][0],
            color1,
            color2))
    {
        return WHITE_CORNER_ULF;
    }

    /*
     * DFR = White / Green / Red
     */
    if (corner_has_colors(
            cube->stickers[1][0][2],
            cube->stickers[2][2][2],
            cube->stickers[5][2][0],
            color1,
            color2))
    {
        return WHITE_CORNER_DFR;
    }

    /*
     * DRB = White / Red / Blue
     */
    if (corner_has_colors(
            cube->stickers[1][2][2],
            cube->stickers[5][2][2],
            cube->stickers[3][2][0],
            color1,
            color2))
    {
        return WHITE_CORNER_DRB;
    }

    /*
     * DBL = White / Blue / Orange
     */
    if (corner_has_colors(
            cube->stickers[1][2][0],
            cube->stickers[3][2][2],
            cube->stickers[4][2][0],
            color1,
            color2))
    {
        return WHITE_CORNER_DBL;
    }

    /*
     * DLF = White / Orange / Green
     */
    if (corner_has_colors(
            cube->stickers[1][0][0],
            cube->stickers[4][2][2],
            cube->stickers[2][2][0],
            color1,
            color2))
    {
        return WHITE_CORNER_DLF;
    }

    return WHITE_CORNER_NONE;
}


/* ============================================================
   WHITE CORNER SOLVED DETECTION
   ============================================================ */

int solver_white_corner_solved(
    const RubixCube *cube,
    WhiteCornerLocation location
)
{
    if (cube == NULL)
        return 0;

    switch (location)
    {
        case WHITE_CORNER_UFR:
            return
                cube->stickers[0][2][2] == 'W' &&
                cube->stickers[2][0][2] == 'G' &&
                cube->stickers[5][0][0] == 'R';

        case WHITE_CORNER_URB:
            return
                cube->stickers[0][0][2] == 'W' &&
                cube->stickers[5][0][2] == 'R' &&
                cube->stickers[3][0][0] == 'B';

        case WHITE_CORNER_UBL:
            return
                cube->stickers[0][0][0] == 'W' &&
                cube->stickers[3][0][2] == 'B' &&
                cube->stickers[4][0][0] == 'O';

        case WHITE_CORNER_ULF:
            return
                cube->stickers[0][2][0] == 'W' &&
                cube->stickers[4][0][2] == 'O' &&
                cube->stickers[2][0][0] == 'G';

        case WHITE_CORNER_DFR:
        case WHITE_CORNER_DRB:
        case WHITE_CORNER_DBL:
        case WHITE_CORNER_DLF:
        case WHITE_CORNER_NONE:
        default:
            return 0;
    }
}
