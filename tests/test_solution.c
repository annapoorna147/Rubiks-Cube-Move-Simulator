#include <stdio.h>

#include "cube.h"
#include "move_parser.h"
#include "solution.h"

int main(void)
{
    RubixCube cube;

    char scramble[][4] =
    {
        "R",
        "U",
        "F'",
        "L2",
        "D",
        "B2"
    };

    char inverse[6][4];

    int scramble_length = 6;

    printf("\n====================================\n");
    printf("       SOLUTION VERIFICATION TEST\n");
    printf("====================================\n\n");

    /*
     * Create solved cube.
     */
    cube_initialize(&cube);

    /*
     * Scramble it.
     */
    if (!cube_apply_move(&cube, "R") ||
        !cube_apply_move(&cube, "U") ||
        !cube_apply_move(&cube, "F'") ||
        !cube_apply_move(&cube, "L2") ||
        !cube_apply_move(&cube, "D") ||
        !cube_apply_move(&cube, "B2"))
    {
        printf("FAIL: Could not create scramble\n");
        return 1;
    }

    if (cube_is_solved(&cube))
    {
        printf("FAIL: Cube was not scrambled\n");
        return 1;
    }

    printf("PASS: Scramble created\n");

    /*
     * Generate inverse.
     */
    if (!solution_inverse_sequence(
            scramble,
            scramble_length,
            inverse))
    {
        printf("FAIL: Could not generate inverse\n");
        return 1;
    }

    printf("\nInverse solution:\n");

    for (int i = 0; i < scramble_length; i++)
    {
        printf("%s", inverse[i]);

        if (i < scramble_length - 1)
            printf(" ");
    }

    printf("\n");

    /*
     * Verify solution.
     */
    if (!solution_verify(
            &cube,
            inverse,
            scramble_length))
    {
        printf("FAIL: Inverse did not solve cube\n");
        return 1;
    }

    printf("\nPASS: Inverse solution solves cube\n");

    /*
     * Check invalid move handling.
     */
    char bad_inverse[4];

    if (solution_inverse_move(
            "X",
            bad_inverse))
    {
        printf("FAIL: Invalid move accepted\n");
        return 1;
    }

    printf("PASS: Invalid move rejected\n");

    printf("\n====================================\n");
    printf("      SOLUTION VERIFICATION OK\n");
    printf("====================================\n\n");

    return 0;
}
