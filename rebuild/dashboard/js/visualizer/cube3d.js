import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const COLORS = {
  U: 0xffffff,
  D: 0xffd500,
  F: 0x009b48,
  B: 0x0046ad,
  R: 0xb71234,
  L: 0xff5800,
  INNER: 0x111111
};

const FACE_NORMALS = {
  U: [0, 1, 0],
  D: [0, -1, 0],
  F: [0, 0, 1],
  B: [0, 0, -1],
  R: [1, 0, 0],
  L: [-1, 0, 0]
};

const SPACING = 1.04;
const CUBIE_SIZE = 1;

function rotateGrid(grid, axis, turns = 1) {
  let result = { ...grid };

  for (let i = 0; i < turns % 4; i++) {
    const vector = [result.x, result.y, result.z];

    const cross = [
      axis[1] * vector[2] - axis[2] * vector[1],
      axis[2] * vector[0] - axis[0] * vector[2],
      axis[0] * vector[1] - axis[1] * vector[0]
    ];

    const projection =
      axis[0] * vector[0] +
      axis[1] * vector[1] +
      axis[2] * vector[2];

    result = {
      x: -cross[0] + axis[0] * projection,
      y: -cross[1] + axis[1] * projection,
      z: -cross[2] + axis[2] * projection
    };
  }

  return result;
}

export class Cube3D {
  constructor(container) {
    if (!container) {
      throw new Error("Cube3D requires a valid container element.");
    }

    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1020);

    this.camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    this.camera.position.set(5, 5, 7);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enablePan = false;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 12;
    this.controls.target.set(0, 0, 0);

    this.cubeGroup = new THREE.Group();
    this.scene.add(this.cubeGroup);

    this.scene.add(new THREE.AmbientLight(0xffffff, 2));

    const light = new THREE.DirectionalLight(0xffffff, 2.5);
    light.position.set(5, 8, 10);
    this.scene.add(light);

    this.cubelets = [];
    this.createCube();

    this.moveQueue = Promise.resolve();

    this.animate = this.animate.bind(this);
    this.animationId = null;
    this.animate();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
  }

  createCube() {
    const geometry = new THREE.BoxGeometry(
      CUBIE_SIZE,
      CUBIE_SIZE,
      CUBIE_SIZE
    );

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const materials = [
            new THREE.MeshStandardMaterial({
              color: x === 1 ? COLORS.R : COLORS.INNER,
              roughness: 0.38
            }),
            new THREE.MeshStandardMaterial({
              color: x === -1 ? COLORS.L : COLORS.INNER,
              roughness: 0.38
            }),
            new THREE.MeshStandardMaterial({
              color: y === 1 ? COLORS.U : COLORS.INNER,
              roughness: 0.38
            }),
            new THREE.MeshStandardMaterial({
              color: y === -1 ? COLORS.D : COLORS.INNER,
              roughness: 0.38
            }),
            new THREE.MeshStandardMaterial({
              color: z === 1 ? COLORS.F : COLORS.INNER,
              roughness: 0.38
            }),
            new THREE.MeshStandardMaterial({
              color: z === -1 ? COLORS.B : COLORS.INNER,
              roughness: 0.38
            })
          ];

          const cubelet = new THREE.Mesh(geometry, materials);

          cubelet.position.set(
            x * SPACING,
            y * SPACING,
            z * SPACING
          );

          cubelet.userData.grid = { x, y, z };

          this.cubeGroup.add(cubelet);
          this.cubelets.push(cubelet);
        }
      }
    }
  }

  turnFace(face, turns = 1, duration = 250) {
    if (!FACE_NORMALS[face]) {
      return Promise.reject(new Error(`Invalid face: ${face}`));
    }

    if (![1, 2, 3].includes(turns)) {
      return Promise.reject(new Error("Turns must be 1, 2, or 3."));
    }

    const performMove = () =>
      this.animateFaceTurn(face, turns, duration);

    this.moveQueue = this.moveQueue.then(performMove);

    return this.moveQueue;
  }

  animateFaceTurn(face, turns, duration) {
    const axisValues = FACE_NORMALS[face];
    const axis = new THREE.Vector3(...axisValues);

    const selected = this.cubelets.filter(cubelet => {
      const grid = cubelet.userData.grid;

      return (
        grid.x * axisValues[0] +
        grid.y * axisValues[1] +
        grid.z * axisValues[2]
      ) === 1;
    });

    if (selected.length !== 9) {
      return Promise.reject(
        new Error(`Expected 9 cubelets for ${face}, found ${selected.length}.`)
      );
    }

    const pivot = new THREE.Group();
    this.cubeGroup.add(pivot);

    selected.forEach(cubelet => pivot.attach(cubelet));

    const startTime = performance.now();
    const angle = -turns * Math.PI / 2;

    return new Promise(resolve => {
      const animateTurn = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        pivot.rotation.set(0, 0, 0);
        pivot.rotateOnAxis(axis, angle * eased);

        if (progress < 1) {
          requestAnimationFrame(animateTurn);
          return;
        }

        selected.forEach(cubelet => {
          const newGrid = rotateGrid(
            cubelet.userData.grid,
            axisValues,
            turns
          );

          cubelet.userData.grid = newGrid;
          this.cubeGroup.attach(cubelet);

          cubelet.position.set(
            newGrid.x * SPACING,
            newGrid.y * SPACING,
            newGrid.z * SPACING
          );

        });

        this.cubeGroup.remove(pivot);
        resolve();
      };

      requestAnimationFrame(animateTurn);
    });
  }

  resetToSolved() {
    const performReset = () => {
      const geometry = this.cubelets[0]?.geometry;

      for (const cubelet of this.cubelets) {
        for (const material of cubelet.material) {
          material.dispose();
        }
        this.cubeGroup.remove(cubelet);
      }

      geometry?.dispose();
      this.cubelets = [];
      this.createCube();
    };

    this.moveQueue = this.moveQueue.then(performReset);
    return this.moveQueue;
  }

  playSequence(notation, duration = 120) {
    const moves = notation.trim().split(/\s+/).filter(Boolean);

    const performSequence = async () => {
      for (const move of moves) {
        const face = move[0];
        const suffix = move.slice(1);
        const turns = suffix === "'" ? 3 : suffix === "2" ? 2 : 1;

        await this.animateFaceTurn(face, turns, duration);
      }
    };

    this.moveQueue = this.moveQueue.then(performSequence);
    return this.moveQueue;
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    if (!width || !height) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    this.resizeObserver?.disconnect();
    this.controls?.dispose();

    this.cubeGroup.traverse(object => {
      if (!object.isMesh) return;

      object.geometry.dispose();

      for (const material of object.material) {
        material.dispose();
      }
    });

    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
