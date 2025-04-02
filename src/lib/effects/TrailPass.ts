import * as THREE from "three";

export class TrailPass extends THREE.Object3D {
  length: number;
  decay: number;
  color: string;
  positions: THREE.Vector3[];

  constructor(
    length: number = 20,
    decay: number = 0.1,
    color: string = "#ff00ff"
  ) {
    super();
    this.length = length;
    this.decay = decay;
    this.color = color;
    this.positions = [];
  }

  onBeforeRender() {
    if (this.parent) {
      this.positions.unshift(this.parent.position.clone());
      if (this.positions.length > Math.abs(this.length)) {
        this.positions.pop();
      }
    }
  }
}
