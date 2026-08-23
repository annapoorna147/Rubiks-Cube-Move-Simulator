#include <stdio.h>
#include "cube.h"

static int test_inverse_move(
    const char *name,
    void (*move)(RubixCube *),
    void (*inverse)(RubixCube *)
)
{
    RubixCube cube;

    cube_initialize(&cube);

    if (!cube_is_solved(&cube))
    {
        printf("FAIL: %s - cube not initially solved\n", name);
        return 0;
    }

    move(&cube);

    if (cube_is_solved(&cube))
    {
        printf("FAIL: %s - move did not change cube\n", name);
        return 0;
    }

    inverse(&cube);

    if (!cube_is_solved(&cube))
    {
        printf("FAIL: %s - inverse did not restore cube\n", name);
        return 0;
    }

    printf("PASS: %s + inverse\n", name);
    return 1;
}

int main(void)
{
    int passed = 0;
    int total = 6;

    printf("\n====================================\n");
    printf("       RUBIX CORE TEST SUITE\n");
    printf("====================================\n\n");

    passed += test_inverse_move(
        "R",
        cube_move_R,
        cube_move_R_prime
    );

    passed += test_inverse_move(
        "L",
        cube_move_L,
        cube_move_L_prime
    );

    passed += test_inverse_move(
        "U",
        cube_move_U,
        cube_move_U_prime
    );

    passed += test_inverse_move(
        "D",
        cube_move_D,
        cube_move_D_prime
    );

    passed += test_inverse_move(
        "F",
        cube_move_F,
        cube_move_F_prime
    );

    passed += test_inverse_move(
        "B",
        cube_move_B,
        cube_move_B_prime
    );

    printf("\n====================================\n");
    printf("RESULT: %d/%d tests passed\n", passed, total);
    printf("====================================\n\n");

    return passed == total ? 0 : 1;
}
