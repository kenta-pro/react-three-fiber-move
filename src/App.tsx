import {
  // GizmoHelper,
  // GizmoViewport,
  OrbitControls,
  Stars,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import ShaderObj from "./ShaderObj";

const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{
          position: [0, 0, 2],
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 2000,
          fov: 50,
        }}
      >
        <Stars />
        <color attach="background" args={["#000"]} />
        <OrbitControls attach={"orbitControls"} />
        <ShaderObj />
        {/* <axesHelper args={[0.5]} />
        <GizmoHelper
          alignment="bottom-left"
          margin={[80, 80]}
          onUpdate={() => {}}
        >
          <GizmoViewport
            axisColors={["#f00", "#398400", "#00f"]}
            labelColor="#fff"
          />
        </GizmoHelper> */}
      </Canvas>
    </div>
  );
};

export default App;
