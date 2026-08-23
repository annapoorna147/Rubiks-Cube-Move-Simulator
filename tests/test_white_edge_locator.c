#include <stdio.h>

#include "cube.h"
#include "solver.h"


int main(void)
{
    RubixCube cube;

    printf("\n");
    printf("====================================\n");
    printf("        WHITE EDGE LOCATOR\n");
    printf("====================================\n\n");


    /*
     * ========================================================
     * TEST 1
     * Solved cube.
     * ========================================================
     */

    cube_initialize(&cube);

    WhiteEdgeLocation location =
        solver_find_white_edge(&cube);

    printf(
        "First White edge: %s\n",
        solver_white_edge_name(location)
    );

    if (location != WHITE_EDGE_UF)
    {
        printf("FAIL: Expected UF\n");
        return 1;
    }

    printf("PASS: UF White edge detected\n");


    /*
     * ========================================================
     * TEST 2
     * Count all White edges.
     * ========================================================
     */

    int count =
        solver_count_white_edges(&cube);

    printf(
        "White edge count: %d\n",
        count
    );

    if (count != 4)
    {
        printf("FAIL: Expected exactly 4 White edges\n");
        return 1;
    }

    printf("PASS: Four White edges detected\n");


    /*
     * ========================================================
     * TEST 3
     * White Cross recognition.
     * ========================================================
     */

    if (!solver_white_cross_complete(&cube))
    {
        printf("FAIL: White Cross not detected\n");
        return 1;
    }

    printf("PASS: White Cross recognition works\n");


    /*
     * ========================================================
     * TEST 4
     * Remove one White edge completely.
     *
     * This is NOT pretending to move the piece.
     * We simply test that the locator correctly
     * stops counting it as a White edge.
     * ========================================================
     */

    cube.stickers[0][2][1] = 'G';
    cube.stickers[2][0][1] = 'R';

    count =
        solver_count_white_edges(&cube);

    printf(
        "After removing UF White: %d White edges\n",
        count
    );

    if (count != 3)
    {
        printf("FAIL: Expected 3 White edges\n");
        return 1;
    }

    printf("PASS: White edge count updates correctly\n");


    /*
     * ========================================================
     * FINAL RESULT
     * ========================================================
     */

    printf("\n");
    printf("====================================\n");
    printf("       WHITE EDGE LOCATOR OK\n");
    printf("====================================\n\n");

    return 0;
}
