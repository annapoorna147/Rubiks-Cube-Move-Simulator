#include <stdio.h>

#include "cube.h"
#include "solver.h"


int main(void)
{
    RubixCube cube;

    printf("\n");
    printf("====================================\n");
    printf("       WHITE EDGE SOLVED TEST\n");
    printf("====================================\n\n");


    /*
     * ========================================================
     * TEST 1
     * A completely solved cube.
     * ========================================================
     */

    cube_initialize(&cube);


    if (!solver_white_edge_solved(
            &cube,
            WHITE_EDGE_UF))
    {
        printf("FAIL: UF should be solved\n");
        return 1;
    }

    printf("PASS: UF solved\n");


    if (!solver_white_edge_solved(
            &cube,
            WHITE_EDGE_UR))
    {
        printf("FAIL: UR should be solved\n");
        return 1;
    }

    printf("PASS: UR solved\n");


    if (!solver_white_edge_solved(
            &cube,
            WHITE_EDGE_UB))
    {
        printf("FAIL: UB should be solved\n");
        return 1;
    }

    printf("PASS: UB solved\n");


    if (!solver_white_edge_solved(
            &cube,
            WHITE_EDGE_UL))
    {
        printf("FAIL: UL should be solved\n");
        return 1;
    }

    printf("PASS: UL solved\n");


    /*
     * ========================================================
     * TEST 2
     *
     * Break the UF edge by changing its side color.
     *
     * White is still on U, but the side sticker no longer
     * matches the Front center.
     * ========================================================
     */

    cube.stickers[2][0][1] = 'R';


    if (solver_white_edge_solved(
            &cube,
            WHITE_EDGE_UF))
    {
        printf(
            "FAIL: UF incorrectly marked solved\n"
        );

        return 1;
    }

    printf(
        "PASS: Incorrectly aligned UF detected\n"
    );


    /*
     * ========================================================
     * TEST 3
     *
     * Restore the correct color.
     * ========================================================
     */

    cube.stickers[2][0][1] =
        cube.stickers[2][1][1];


    if (!solver_white_edge_solved(
            &cube,
            WHITE_EDGE_UF))
    {
        printf(
            "FAIL: UF should be solved after restoration\n"
        );

        return 1;
    }

    printf(
        "PASS: UF solved after restoration\n"
    );


    /*
     * ========================================================
     * TEST 4
     *
     * Down-layer White edge must NOT be considered solved.
     * ========================================================
     */

    if (solver_white_edge_solved(
            &cube,
            WHITE_EDGE_DF))
    {
        printf(
            "FAIL: DF incorrectly marked solved\n"
        );

        return 1;
    }

    printf(
        "PASS: DF correctly identified as unsolved\n"
    );


    /*
     * ========================================================
     * FINAL
     * ========================================================
     */

    printf("\n");
    printf("====================================\n");
    printf("     WHITE EDGE SOLVED TEST OK\n");
    printf("====================================\n\n");

    return 0;
}
