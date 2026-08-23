#include <stdio.h>

#include "cube.h"
#include "solver.h"

int main(void)
{
    RubixCube cube;

    printf("\n====================================\n");
    printf("        WHITE LAYER TEST\n");
    printf("====================================\n\n");

    /* Test 1: solved cube */
    cube_initialize(&cube);

    if (solver_white_corners_complete(&cube))
        printf("PASS: Solved cube has complete White Layer\n");
    else
    {
        printf("FAIL: Solved cube White Layer not detected\n");
        return 1;
    }

    /* Test 2: R move breaks the white face */
    cube_move_R(&cube);

    if (!solver_white_corners_complete(&cube))
        printf("PASS: R move breaks White Layer\n");
    else
    {
        printf("FAIL: R move incorrectly reported complete\n");
        return 1;
    }

    /* Test 3: R' restores it */
    cube_move_R_prime(&cube);

    if (solver_white_corners_complete(&cube))
        printf("PASS: R' restores White Layer\n");
    else
    {
        printf("FAIL: R' did not restore White Layer\n");
        return 1;
    }

    printf("\n====================================\n");
    printf("        WHITE LAYER TEST PASSED\n");
    printf("====================================\n\n");

    return 0;
}
