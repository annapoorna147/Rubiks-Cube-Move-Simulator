#ifndef RUBIX_CUBE_STATE_H
#define RUBIX_CUBE_STATE_H

#include "cube.h"

/*
 * Standard cube faces.
 *
 * U = Up
 * D = Down
 * F = Front
 * B = Back
 * L = Left
 * R = Right
 */
typedef enum
{
    FACE_U = 0,
    FACE_D = 1,
    FACE_F = 2,
    FACE_B = 3,
    FACE_L = 4,
    FACE_R = 5
} CubeFace;

/*
 * Represents the 54 stickers detected by
 * the future camera scanner.
 */
typedef struct
{
    char stickers[RUBIX_FACES][RUBIX_SIZE][RUBIX_SIZE];

    int captured_faces;

    int is_complete;
    int is_valid;
} CubeScan;

/* Initialize an empty scan */
void cube_scan_init(CubeScan *scan);

/* Add one scanned face */
int cube_scan_set_face(
    CubeScan *scan,
    CubeFace face,
    const char colors[RUBIX_SIZE][RUBIX_SIZE]
);

/* Check whether all six faces were captured */
int cube_scan_is_complete(
    const CubeScan *scan
);

/* Validate scanned color counts */
int cube_scan_validate(
    CubeScan *scan
);

/* Convert scan into solver cube */
int cube_scan_to_cube(
    const CubeScan *scan,
    RubixCube *cube
);

#endif
