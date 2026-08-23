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
    printf("       WHITE CROSS SOLVER TEST\n");
    printf("====================================\n\n");

    /*
     * Already solved White Cross.
     */
    if (solver_solve_white_cross(&cube, &solution))
    {
        printf("PASS: Solver recognizes completed White Cross\n");
    }
    else
    {
        printf("FAIL: Solver rejected completed White Cross\n");
        return 1;
    }

    printf("\nSolver stage: %s\n",
           solver_step_name(solution.step));

    printf("Moves generated: %d\n",
           solution.move_count);

    printf("\n====================================\n");
    printf("       WHITE CROSS PIPELINE OK\n");
    printf("====================================\n\n");

    return 0;
}
