#include <stdio.h>

#include "cube.h"
#include "scramble.h"

int main(void)
{
    RubixCube cube;

    char moves[20][4];

    unsigned int seed = 12345;

    printf("\n====================================\n");
    printf("         SCRAMBLE ENGINE TEST\n");
    printf("====================================\n\n");

    int count = scramble_generate(
        moves,
        20,
        &seed
    );

    if (count != 20)
    {
        printf("FAIL: Scramble generation failed\n");
        return 1;
    }

    printf("Generated scramble:\n\n");

    for (int i = 0; i < count; i++)
    {
        printf("%s", moves[i]);

        if (i < count - 1)
            printf(" ");
    }

    printf("\n\n");

    cube_initialize(&cube);

    if (!scramble_apply(
            &cube,
            moves,
            count))
    {
        printf("FAIL: Scramble could not be applied\n");
        return 1;
    }

    if (cube_is_solved(&cube))
    {
        printf("FAIL: Scramble left cube solved\n");
        return 1;
    }

    printf("PASS: Scramble generated\n");
    printf("PASS: Scramble applied\n");
    printf("PASS: Cube is scrambled\n");

    printf("\n====================================\n");
    printf("        SCRAMBLE ENGINE PASSED\n");
    printf("====================================\n\n");

    return 0;
}
