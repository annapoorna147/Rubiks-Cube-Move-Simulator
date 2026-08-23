#ifndef RUBIX_CUBE_H
#define RUBIX_CUBE_H

#define RUBIX_SIZE 3
#define RUBIX_FACES 6

typedef struct
{
    char stickers[RUBIX_FACES][RUBIX_SIZE][RUBIX_SIZE];
} RubixCube;

void cube_initialize(RubixCube *cube);
void cube_reset(RubixCube *cube);

void cube_rotate_face_clockwise(RubixCube *cube, int face);

void cube_move_U(RubixCube *cube);
void cube_move_D(RubixCube *cube);
void cube_move_L(RubixCube *cube);
void cube_move_R(RubixCube *cube);
void cube_move_F(RubixCube *cube);
void cube_move_B(RubixCube *cube);

void cube_move_U_prime(RubixCube *cube);
void cube_move_D_prime(RubixCube *cube);
void cube_move_L_prime(RubixCube *cube);
void cube_move_R_prime(RubixCube *cube);
void cube_move_F_prime(RubixCube *cube);
void cube_move_B_prime(RubixCube *cube);

void cube_move_U2(RubixCube *cube);
void cube_move_D2(RubixCube *cube);
void cube_move_L2(RubixCube *cube);
void cube_move_R2(RubixCube *cube);
void cube_move_F2(RubixCube *cube);
void cube_move_B2(RubixCube *cube);

int cube_is_solved(const RubixCube *cube);


/* Cube-state validation */
int cube_is_valid_color_count(const RubixCube *cube);
#endif
