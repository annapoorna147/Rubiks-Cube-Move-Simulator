#include <stddef.h>

#include "cube_state.h"

void cube_scan_init(CubeScan *scan)
{
    if (scan == NULL)
        return;

    scan->captured_faces = 0;
    scan->is_complete = 0;
    scan->is_valid = 0;

    for (int face = 0; face < RUBIX_FACES; face++)
    {
        for (int row = 0; row < RUBIX_SIZE; row++)
        {
            for (int col = 0; col < RUBIX_SIZE; col++)
            {
                scan->stickers[face][row][col] = '?';
            }
        }
    }
}

int cube_scan_set_face(
    CubeScan *scan,
    CubeFace face,
    const char colors[RUBIX_SIZE][RUBIX_SIZE]
)
{
    if (scan == NULL || colors == NULL)
        return 0;

    if (face < FACE_U || face > FACE_R)
        return 0;

    /*
     * Don't count the same face twice.
     */
    int was_empty =
        scan->stickers[face][0][0] == '?';

    for (int row = 0; row < RUBIX_SIZE; row++)
    {
        for (int col = 0; col < RUBIX_SIZE; col++)
        {
            scan->stickers[face][row][col] =
                colors[row][col];
        }
    }

    if (was_empty)
        scan->captured_faces++;

    scan->is_complete =
        (scan->captured_faces == RUBIX_FACES);

    scan->is_valid = 0;

    return 1;
}

int cube_scan_is_complete(
    const CubeScan *scan
)
{
    if (scan == NULL)
        return 0;

    return scan->captured_faces == RUBIX_FACES;
}

int cube_scan_validate(
    CubeScan *scan
)
{
    if (scan == NULL)
        return 0;

    if (!cube_scan_is_complete(scan))
    {
        scan->is_valid = 0;
        return 0;
    }

    RubixCube cube;

    for (int face = 0; face < RUBIX_FACES; face++)
    {
        for (int row = 0; row < RUBIX_SIZE; row++)
        {
            for (int col = 0; col < RUBIX_SIZE; col++)
            {
                cube.stickers[face][row][col] =
                    scan->stickers[face][row][col];
            }
        }
    }

    scan->is_valid =
        cube_is_valid_color_count(&cube);

    return scan->is_valid;
}

int cube_scan_to_cube(
    const CubeScan *scan,
    RubixCube *cube
)
{
    if (scan == NULL || cube == NULL)
        return 0;

    if (!scan->is_complete || !scan->is_valid)
        return 0;

    for (int face = 0; face < RUBIX_FACES; face++)
    {
        for (int row = 0; row < RUBIX_SIZE; row++)
        {
            for (int col = 0; col < RUBIX_SIZE; col++)
            {
                cube->stickers[face][row][col] =
                    scan->stickers[face][row][col];
            }
        }
    }

    return 1;
}
