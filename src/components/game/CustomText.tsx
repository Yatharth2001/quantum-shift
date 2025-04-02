import { forwardRef, useMemo, useEffect, useState } from "react";
import { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import helvetikerRegular from "three/examples/fonts/helvetiker_regular.typeface.json";

type TextAnchor = number | "left" | "center" | "right";
type TextAnchorY =
  | number
  | "top"
  | "top-baseline"
  | "middle"
  | "bottom-baseline"
  | "bottom";

interface CustomTextBaseProps {
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  maxWidth?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: "left" | "right" | "center" | "justify";
  font?: string;
  anchorX?: TextAnchor;
  anchorY?: TextAnchorY;
  outlineWidth?: number;
  outlineColor?: string;
  renderOrder?: number;
  characters?: string;
  frustumCulled?: boolean;
}

type CustomTextProps = CustomTextBaseProps &
  Omit<ThreeElements["group"], keyof CustomTextBaseProps>;

export const CustomText = forwardRef<THREE.Group, CustomTextProps>(
  (props, ref) => {
    const {
      frustumCulled = false,
      position,
      rotation,
      scale,
      renderOrder = 1,
      children,
      color = "#ffffff",
      fontSize = 1,
      outlineWidth = 0,
      outlineColor = "#000000",
      ...textProps
    } = props;

    const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

    const groupProps = useMemo(
      () => ({
        position,
        rotation,
        scale,
      }),
      [position, rotation, scale]
    );

    const material = useMemo(() => {
      return new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        side: THREE.DoubleSide,
      });
    }, [color]);

    useEffect(() => {
      const loader = new FontLoader();
      const font = loader.parse(helvetikerRegular);

      const textGeometry = new TextGeometry(children?.toString() || "", {
        font,
        size: fontSize,
        depth: fontSize * 0.1, // Changed from height to depth
        curveSegments: 12,
      });

      textGeometry.computeBoundingBox();
      textGeometry.center();

      setGeometry(textGeometry);

      return () => {
        if (textGeometry) textGeometry.dispose();
      };
    }, [children, fontSize]);

    if (!geometry) {
      return null;
    }

    return (
      <group ref={ref} {...groupProps}>
        <mesh
          geometry={geometry}
          material={material}
          renderOrder={renderOrder}
          frustumCulled={frustumCulled}
        />
      </group>
    );
  }
);

CustomText.displayName = "CustomText";
