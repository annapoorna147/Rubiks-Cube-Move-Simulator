#include <stdio.h>

#include "cube_state.h"

int main(void)
{
    CubeScan scan;

    cube_scan_init(&scan);

    printf("\n====================================\n");
    printf("       CUBE STATE SCAN TEST\n");
    printf("====================================\n\n");

    printf("Initial captured faces: %d\n",
           scan.captured_faces);

    if (cube_scan_is_complete(&scan))
    {
        printf("FAIL: Empty scan reported complete\n");
        return 1;
    }

    /*
     * Create a solved cube and copy each face
     * into the simulated camera scanner.
     */
    RubixCube solved;

    cube_initialize(&solved);

    for (int face = 0; face < RUBIX_FACES; face++)
    {
        if (!cube_scan_set_face(
                &scan,
                (CubeFace)face,
                solved.stickers[face]))
        {
            printf("FAIL: Could not capture face %d\n",
                   face);
            return 1;
        }
    }

    printf("Captured faces: %d\n",
           scan.captured_faces);

    if (!cube_scan_is_complete(&scan))
    {
        printf("FAIL: Six faces not detected\n");
        return 1;
    }

    printf("PASS: Six faces captured\n");

    if (!cube_scan_validate(&scan))
    {
        printf("FAIL: Valid scanned cube rejected\n");
        return 1;
    }

    printf("PASS: Scanned cube validated\n");

    RubixCube reconstructed;

    if (!cube_scan_to_cube(
            &scan,
            &reconstructed))
    {
        printf("FAIL: Could not reconstruct cube\n");
        return 1;
    }

    if (!cube_is_solved(&reconstructed))
    {
        printf("FAIL: Reconstructed cube incorrect\n");
        return 1;
    }

    printf("PASS: Cube reconstructed successfully\n");

    printf("\n====================================\n");
    printf("       CAMERA STATE FOUNDATION OK\n");
    printf("====================================\n\n");

    return 0;
}
