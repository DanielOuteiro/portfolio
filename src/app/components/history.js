import * as THREE from "three";
import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, useCursor } from "@react-three/drei";
import { EffectComposer, SSR } from "@react-three/postprocessing";

const History = () => (
  <Canvas
    shadows
    gl={{
      logarithmicDepthBuffer: true,
      antialias: false,
      stencil: false,
      depth: false,
    }}
    camera={{ position: [50, 25, 50], fov: 15 }}
  >
    <color attach="background" args={["#fff"]} />
    <hemisphereLight intensity={0.5} />
    <directionalLight position={[0, 2, 5]} castShadow intensity={1} />
    <group position={[2, -2, 0]}>
      <group position={[0, -0.9, -3]}>
        <Plane
          color="black"
          rotation-x={-Math.PI / 2}
          position-z={3}
          scale={[7, 20, 0.2]}
        />
      </group>
      <Video />
    </group>
    <EffectComposer disableNormalPass>
      <SSR />
    </EffectComposer>
  </Canvas>
);


const Plane = ({ color, ...props }) => (
  <RoundedBox
    receiveShadow
    castShadow
    smoothness={10}
    radius={0.015}
    {...props}
  >
    <meshStandardMaterial
      color={color}
      envMapIntensity={0.5}
      roughness={0}
      metalness={0}
    />
  </RoundedBox>
);

const videoSources = [
    "/videos/conversational design_img0.mp4",
    "/videos/coding_img0.mp4",
    "/videos/motion design_img0.mp4",
    "/videos/talks_img0.mp4",
  ];
  
  function Video() {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [video] = useState(() =>
      Object.assign(document.createElement("video"), {
        crossOrigin: "Anonymous",
        loop: true,
        muted: true,
      })
    );
  
    useEffect(() => {
      const playVideo = () => {
        video.src = videoSources[currentVideoIndex];
        video.play();
        setTimeout(() => {
          video.pause();
          setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
        }, 5000);
      };
  
      playVideo();
  
      // Clean up video element on component unmount
      return () => {
        video.pause();
        video.src = "";
      };
    }, [currentVideoIndex, video]);
  
    return (
      <mesh
        position={[-2, 4, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[17, 10, 1]}
      >
        <planeGeometry />
        <meshBasicMaterial toneMapped={false}>
          <videoTexture attach="map" args={[video]} />
        </meshBasicMaterial>
      </mesh>
    );
  }
  

export default History;
