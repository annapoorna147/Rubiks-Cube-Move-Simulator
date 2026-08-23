#include <stdio.h>

#include "cube.h"

int main(void)
{
    RubixCube cube;

    printf("\n====================================\n");
    printf("        CUBE VALIDATION TEST\n");
    printf("====================================\n\n");

    /* Test 1: solved cube */
    cube_initialize(&cube);

    if (cube_is_valid_color_count(&cube))
        printf("PASS: Solved cube has valid color counts\n");
    else
    {
        printf("FAIL: Solved cube rejected\n");
        return 1;
    }

    /* Test 2: moves preserve color counts */
    cube_move_R(&cube);
    cube_move_U(&cube);
    cube_move_F(&cube);

    if (cube_is_valid_color_count(&cube))
        printf("PASS: Scrambled cube has valid color counts\n");
    else
    {
        printf("FAIL: Scrambled cube rejected\n");
        return 1;
    }

    /* Test 3: deliberately corrupt one sticker */
    cube.stickers[0][0][0] = 'R';

    if (!cube_is_valid_color_count(&cube))
        printf("PASS: Invalid color count detected\n");
    else
    {
        printf("FAIL: Invalid color count accepted\n");
        return 1;
    }

    printf("\n====================================\n");
    printf("        VALIDATION TEST PASSED\n");
    printf("====================================\n\n");

    return 0;
}
