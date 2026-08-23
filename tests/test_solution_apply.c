#include <stdio.h>

#include "cube.h"
#include "solver.h"

int main(void)
{
    RubixCube cube;
    SolverSolution solution;

    cube_initialize(&cube);
    solver_solution_init(&solution);

    printf("\n====================================\n");
    printf("      SOLUTION EXECUTION TEST\n");
    printf("====================================\n\n");

    /*
     * Create a sequence that scrambles the cube.
     */
    solver_add_move(&solution, "R");
    solver_add_move(&solution, "U");
    solver_add_move(&solution, "R'");
    solver_add_move(&solution, "U'");

    printf("Applying:\n");

    for (int i = 0; i < solution.move_count; i++)
    {
        printf("%d. %s\n",
               i + 1,
               solver_get_move(&solution, i));
    }

    if (!solver_apply_solution(&cube, &solution))
    {
        printf("\nFAIL: Could not apply solution\n");
        return 1;
    }

    if (!cube_is_solved(&cube))
    {
        printf("\nPASS: Solution sequence changed cube\n");
    }
    else
    {
        printf("\nFAIL: Cube unexpectedly remained solved\n");
        return 1;
    }

    /*
     * Apply inverse sequence.
     */
    SolverSolution inverse;

    solver_solution_init(&inverse);

    solver_add_move(&inverse, "U");
    solver_add_move(&inverse, "R");
    solver_add_move(&inverse, "U'");
    solver_add_move(&inverse, "R'");

    if (!solver_apply_solution(&cube, &inverse))
    {
        printf("FAIL: Could not apply inverse sequence\n");
        return 1;
    }

    if (cube_is_solved(&cube))
    {
        printf("PASS: Inverse sequence restored cube\n");
    }
    else
    {
        printf("FAIL: Inverse sequence did not restore cube\n");
        return 1;
    }

    printf("\n====================================\n");
    printf("      SOLUTION EXECUTION PASSED\n");
    printf("====================================\n\n");

    return 0;
}
