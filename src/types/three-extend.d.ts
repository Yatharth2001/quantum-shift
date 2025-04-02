import { MaterialNode, Object3DNode } from "@react-three/fiber";
import { ShaderMaterial } from "three";

interface TimeShaderMaterialType extends ShaderMaterial {
  transparent?: boolean;
}

interface TrailPassType {
  attachArray: string;
  length: number;
  decay: number;
  color: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      timeShaderMaterial: MaterialNode<
        TimeShaderMaterialType,
        typeof TimeShaderMaterialType
      >;
      trailPass: Object3DNode<TrailPassType, typeof TrailPassType>;
    }
  }
}
