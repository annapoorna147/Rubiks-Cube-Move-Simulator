#include <stdio.h>

#include "cube.h"
#include "solver.h"


int main(void)
{
    RubixCube cube;


    printf("\n");
    printf("====================================\n");
    printf("       WHITE CROSS RECOGNITION\n");
    printf("====================================\n\n");


    /*
     * ========================================================
     * TEST 1
     * Solved cube should contain a complete White Cross.
     * ========================================================
     */

    cube_initialize(&cube);

    if (!solver_white_cross_complete(&cube))
    {
        printf("FAIL: Solved White Cross not detected\n");
        return 1;
    }

    printf("PASS: Solved White Cross detected\n");


    /*
     * ========================================================
     * TEST 2
     * Break one White edge.
     * ========================================================
     */

    cube.stickers[0][0][1] = 'R';

    if (solver_white_cross_complete(&cube))
    {
        printf("FAIL: Broken White Cross accepted\n");
        return 1;
    }

    printf("PASS: Broken White Cross detected\n");


    /*
     * Restore the sticker.
     */

    cube.stickers[0][0][1] = 'W';


    /*
     * ========================================================
     * TEST 3
     * Break side alignment.
     * ========================================================
     */

    cube.stickers[2][0][1] = 'R';

    if (solver_white_cross_complete(&cube))
    {
        printf("FAIL: Misaligned White Cross accepted\n");
        return 1;
    }

    printf("PASS: Misaligned White Cross detected\n");


    /*
     * ========================================================
     * TEST 4
     * Restore cube and verify again.
     * ========================================================
     */

    cube_initialize(&cube);

    if (!solver_step_complete(
            &cube,
            SOLVER_STEP_WHITE_CROSS))
    {
        printf("FAIL: Solver step recognition failed\n");
        return 1;
    }

    printf("PASS: Solver step recognition works\n");


    /*
     * ========================================================
     * TEST 5
     * Verify solved step.
     * ========================================================
     */

    if (!solver_step_complete(
            &cube,
            SOLVER_STEP_SOLVED))
    {
        printf("FAIL: Solved step not detected\n");
        return 1;
    }

    printf("PASS: Solved cube detected\n");


    /*
     * ========================================================
     * STEP NAMES
     * ========================================================
     */

    printf("\nSolving stages:\n\n");

    for (int i = 0;
         i <= SOLVER_STEP_SOLVED;
         i++)
    {
        printf(
            "Stage %d: %s\n",
            i + 1,
            solver_step_name(
                (SolverStep)i
            )
        );
    }


    printf("\n");
    printf("====================================\n");
    printf("      WHITE CROSS CHECK PASSED\n");
    printf("====================================\n\n");


    return 0;
}
