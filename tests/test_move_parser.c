#include <stdio.h>

#include "cube.h"
#include "move_parser.h"

int main(void)
{
    RubixCube cube;

    printf("\n====================================\n");
    printf("        MOVE PARSER TEST\n");
    printf("====================================\n\n");

    /*
     * Test R followed by R' should return
     * to the original state.
     */
    cube_initialize(&cube);

    if (!cube_apply_sequence(
            &cube,
            "R R'"))
    {
        printf("FAIL: Could not execute R R'\n");
        return 1;
    }

    if (!cube_is_solved(&cube))
    {
        printf("FAIL: R R' did not restore cube\n");
        return 1;
    }

    printf("PASS: R R' restores cube\n");

    /*
     * R2 R2 should also restore the cube.
     */
    cube_initialize(&cube);

    if (!cube_apply_sequence(
            &cube,
            "R2 R2"))
    {
        printf("FAIL: Could not execute R2 R2\n");
        return 1;
    }

    if (!cube_is_solved(&cube))
    {
        printf("FAIL: R2 R2 did not restore cube\n");
        return 1;
    }

    printf("PASS: R2 R2 restores cube\n");

    /*
     * Standard beginner algorithm.
     */
    cube_initialize(&cube);

    if (!cube_apply_sequence(
            &cube,
            "R U R' U'"))
    {
        printf("FAIL: Algorithm rejected\n");
        return 1;
    }

    if (cube_is_solved(&cube))
    {
        printf("FAIL: Algorithm should scramble cube\n");
        return 1;
    }

    printf("PASS: R U R' U' executed correctly\n");

    /*
     * Invalid move.
     */
    cube_initialize(&cube);

    if (cube_apply_move(&cube, "X"))
    {
        printf("FAIL: Invalid move accepted\n");
        return 1;
    }

    printf("PASS: Invalid move rejected\n");

    printf("\n====================================\n");
    printf("        MOVE PARSER TEST PASSED\n");
    printf("====================================\n\n");

    return 0;
}
