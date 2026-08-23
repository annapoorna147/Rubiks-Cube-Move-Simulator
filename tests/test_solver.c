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
    printf("        RUBIX SOLVER TEST\n");
    printf("====================================\n\n");

    printf("Initial step: %s\n",
           solver_step_name(solution.step));

    printf("Total solving stages: 8\n\n");

    for (int i = SOLVER_STEP_WHITE_CROSS;
         i <= SOLVER_STEP_COMPLETE;
         i++)
    {
        printf("Stage %d: %s\n",
               i + 1,
               solver_step_name((SolverStep)i));
    }

    printf("\n");

    if (solver_step_complete(
            &cube,
            SOLVER_STEP_COMPLETE))
    {
        printf("PASS: Solved cube detected\n");
    }
    else
    {
        printf("FAIL: Solved cube not detected\n");
        return 1;
    }

    printf("\n====================================\n");
    printf("        SOLVER FOUNDATION OK\n");
    printf("====================================\n\n");

    return 0;
}
