import React, { useMemo } from "react";
import * as THREE from "three";
import { folder, useControls } from "leva";
import { ThreeEvent } from "@react-three/fiber";
import { gsap, Linear } from "gsap";

const ShaderObj: React.FC = () => {
  // コントローラー
  const datas = useControls({
    geometry: { options: ["plane", "sphere", "square"] },
    inner: true,
    uniforms: folder({
      range: { value: 0.1, min: 0, max: 1, step: 0.1 },
      scale: { value: 0.05, min: 0, max: 0.2, step: 0.01 },
    }),
  });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          mouse: { value: [0, 0, 0] },
          range: { value: datas.range },
          scale: { value: 0 },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        wireframe: true,
      }),
    [datas.range]
  );

  const geometry = useMemo(() => {
    let obj: THREE.BufferGeometry;
    switch (datas.geometry) {
      case "plane":
        obj = new THREE.PlaneGeometry(1, 1, 20, 20);
        break;
      case "sphere":
        obj = new THREE.IcosahedronGeometry(0.5, 10);
        break;
      case "square":
        obj = new THREE.BoxGeometry(1, 1, 1, 20, 20, 20);
        break;
      default:
        obj = new THREE.PlaneGeometry(1, 1, 20, 20);
    }
    return obj;
  }, [datas.geometry]);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    material.uniforms.scale.value = datas.scale;
    material.uniforms.mouse.value = e.point;
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    const gsapOptions: gsap.TweenVars = {
      ease: Linear.easeOut,
      duration: 0.3,
    };
    gsap.to(material.uniforms.scale, { value: 0, ...gsapOptions });
  };

  return (
    <>
      <mesh
        geometry={geometry}
        material={material}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerOut}
      />
      {datas.inner &&
        (datas.geometry === "sphere" || datas.geometry === "square") && (
          <mesh geometry={geometry} scale={0.98}>
            <meshBasicMaterial color="#000" />
          </mesh>
        )}
    </>
  );
};

// shader

const fragmentShader = `
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    gl_FragColor = vec4(vUv, 0.0, 1.);
  }
  `;

const vertexShader = `
  uniform vec3 mouse;
  uniform float range;
  uniform float scale;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vec3 pos = position;
    if (0.0 < scale){
      float dist = distance(mouse, pos);
      dist = clamp(dist, 0.0, range);
      vec3 vecDir = normalize(pos - mouse);
      pos += vecDir * (range - dist) / range * scale;
    }
    vPosition = pos;  
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `;

export default ShaderObj;
