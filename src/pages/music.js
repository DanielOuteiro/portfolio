import { useRef, useEffect, useState } from "react";
import "../app/globals.css";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Center, Environment, Backdrop, useGLTF } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import {} from "@react-three/drei";


export default function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newProgress = (progress + 1) % 101; 
      setProgress(newProgress);
    }, 1000); 

    return () => clearInterval(interval); 
  }, [progress]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "0",
          left: "25%",
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          marginTop: "-5em",
        }}
      >
        <div
          style={{
            lineHeight: "1em",
            textAlign: "left",
            fontSize: "4.3em",
            wordBreak: "break-word",
            fontFamily: "Aeonik-Regular",
            color: "rgba(255, 255, 255, 1)",
          }}
        >
          Toda Beleza{" "}
        </div>
        <div
          style={{
            lineHeight: "1em",
            textAlign: "left",
            fontSize: "3.2em",
            fontFamily: "Aeonik-Regular",
            color: "rgba(255, 255, 255, 0.5)",
            marginTop: "0.2em",
          }}
        >
          Rubel{" "}
        </div>
        <div
          style={{
            position: "absolute",
            top: "65%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "10%",
            height: "5px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#fff",
              transition: "width s ease", // Add smooth transition animation
            }}
          />
        </div>
      </div>

      <Canvas linear shadows>
        <CombinedMeshes /> 
        <Hand/>
        <Backdrop
          castShadow
          floor={2}
          position={[0, -4.5, 0]}
          scale={[50, 10, 4]}
        >
          <meshStandardMaterial color="#091227" envMapIntensity={6.5} />
        </Backdrop>
        <Environment preset="sunset" background blur={1} />
      </Canvas>
    </div>
  );
}

function easeInQuad(t) {
  return t * t;
}

function easeOutQuad(t) {
  return t * (2 - t);
}

function Hand(props) {
  const { nodes } = useGLTF("./3DModels/hand.gltf");
  const handRef = useRef();
  const scaleRef = useRef(1); // Store the original scale

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() % 4) / 4; // Use 4 as the duration for one complete cycle (up and down)
    let newY;

    // Apply easing functions based on the direction of movement
    if (t < 0.5) {
      // Ease in for downward movement
      newY = -easeInQuad(t * 2) * 1;
    } else {
      // Ease out for upward movement
      newY = easeOutQuad((t - 0.5) * 2) * 1;
    }

    // Check if the hand is moving down (newY is decreasing)
    if (newY < handRef.current.position.y) {
      // Scale it 1.5 times bigger when going down
      if (scaleRef.current !== 1.5) {
        scaleRef.current = 1.5;
        handRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
      }
    } else {
      // Return to the original scale when going up
      if (scaleRef.current !== 1) {
        scaleRef.current = 1;
        handRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
      }
    }

    handRef.current.position.y = newY;
  });

  return (
    <group {...props} dispose={null} ref={handRef}>
      <group scale={0.01}>
        <group
          position={[20, -65, 10]}
          rotation={[-0.415, -0.043, -0.019]}
          scale={0.559}
        >
          <mesh
            geometry={nodes.Cylinder.geometry}
            material={nodes.Cylinder.material}
            position={[18.199, -95.575, 16.796]}
            rotation={[-Math.PI, 0, -Math.PI]}
            scale={[2.027, 2.027, 1.396]}
          />
          <mesh
            geometry={nodes["hand-3"].geometry}
            material={nodes["hand-3"].material}
            position={[23.998, -11.39, 3.544]}
            rotation={[-Math.PI, 0, -Math.PI]}
            scale={1.549}
          />
        </group>
      </group>
    </group>
  );
}

function CombinedMeshes() {
  const ref = useRef();
  const [reverseRotation, setReverseRotation] = useState(false);
  

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Apply an offset to the sin function to control the reversal point
    const offset = 0; // You can adjust this value to fine-tune the reversal point
    const newY = Math.sin(t - offset);

    const isMovingUp = newY > 0;

    // Toggle reverse rotation based on the direction of hand movement
    if (isMovingUp !== reverseRotation) {
      setReverseRotation(isMovingUp);
    }

    
    const positiveMultiplier = 2; // Adjust the multiplier for positive rotation
    const negativeMultiplier = 1; // Adjust the multiplier for negative rotation
    ref.current.children[1].rotation.z = reverseRotation ? -t * negativeMultiplier : t * positiveMultiplier;
    
    ref.current.position.y = -2 - (2 + newY) / 10; // Apply the newY value to position.y
    ref.current.position.x = -3;
    ref.current.scale.set(3.8, 3.8, 3.8);
    ref.current.rotation.y = 0.09;

  });


  const musicPlayerTexture = useLoader(TextureLoader, "Vinyl_Cover-2.png");
  const musicPlayerEnv = useLoader(TextureLoader, "cover_ao 1.png");
  const diskTexture = useLoader(TextureLoader, "disk_texture.png");

  return (
    <group ref={ref}>
      <group>
        <Center top>
          <mesh castShadow>
            <boxGeometry args={[1.3, 1.3, 0.03]} />
            <meshStandardMaterial
              metalness={0.9}
              roughness={0.08}
              map={musicPlayerTexture}
              lightMap={musicPlayerEnv}
              lightMapIntensity={300}
            />
          </mesh>
        </Center>
      </group>

      <group position={[0.4, 0.65, -0.05]}>
        {" "}
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.0, 128]} />
          <meshStandardMaterial
            metalness={0.9}
            roughness={0.08}
            map={diskTexture}
            lightMap={diskTexture}
          />
        </mesh>
      </group>
    </group>
  );
}
