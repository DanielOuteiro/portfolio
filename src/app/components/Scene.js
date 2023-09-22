import * as THREE from "three";
import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, createPortal, useThree } from "@react-three/fiber";
import {
  PerspectiveCamera,
  ScreenQuad,
  useGLTF,
  useFBO,
  Environment,
  EffectComposer,
  Bloom,
  DepthOfField,
} from "@react-three/drei";
import { a, useSprings } from "@react-spring/three";
import { CrossFadeMaterial } from "./XFadeMaterial";


const video = document.createElement("video");
video.src = "./3DModels/design system_img0.mp4"; // Replace with the actual path to your video
video.loop = true;
video.muted = true; // Mute the video if needed
video.play();


const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;

// Rotate the video texture by 180 degrees (upside down)
videoTexture.rotation = Math.PI; // 180 degrees in radians

// Optionally, you can also flip the video horizontally if needed
videoTexture.center.set(0.5, 0.5); // Center the texture
videoTexture.repeat.set(-1, 1); // Flip horizontally

const transitions = {
  from: { rotation: [0, -Math.PI / 10, 0], scale: [0.01, 0.01, 0.01] },
  enter: {
    rotation: [0, -1.5, 0],
    scale: [1.2, 1.2, 1.2],
    position: [1, 1.05, 1],
  },
  leave: { rotation: [0, Math.PI / 10, 0], scale: [0.01, 0.01, 0.01] },
};

const enter = transitions.enter;
const leave = transitions.leave;

function Model({ model, videoTexture, fileName, ...props }) {
  const ref = useRef();
  const [rEuler, rQuaternion] = useMemo(
    () => [new THREE.Euler(), new THREE.Quaternion()],
    []
  );

  useFrame((state) => {
    rEuler.set(
      0,
      (state.mouse.x * Math.PI) / 150,
      (-state.mouse.y * Math.PI) / 150
    );
    ref.current.quaternion.slerp(rQuaternion.setFromEuler(rEuler), 0.1);
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      Math.cos(t / 10) / 10 + 0.25,
      0.1
    );
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      Math.sin(t / 10) / 4,
      0.1
    );
    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      Math.sin(t / 10) / 10,
      0.1
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      (-2 + Math.sin(t)) / 10,
      0.05
    );
  });

  useEffect(() => {
    if (model && model.scene) {
      // Traverse through the model's scene and assign the video texture only to "accessibility.gltf"
      model.scene.traverse((child) => {
        if (child.isMesh && child.material.name === "screen.001" && fileName === "motion design.gltf") {
          child.material.map = videoTexture;
          child.material.needsUpdate = true;
        }
      });
    }
  }, [model, videoTexture, fileName]);

  return (
    <group ref={ref}>
      <ambientLight intensity={3.5} color={"#fff"} />
      <directionalLight ref={ref} intensity={1} position={[-1, 0, 50]} shadow-radius={5} castShadow></directionalLight>
      <directionalLight position={[0, 5, -4]} intensity={6} />
      <Environment preset="studio" />
      <a.group {...props} dispose={null}>
        {model && model.scene && (
          <primitive object={model.scene.clone(true)} dispose={null} />
        )}
      </a.group>
    </group>
  );
}


function RenderScene({ target, model, camRef, videoTexture, ...props }) {
  const scene = useMemo(() => new THREE.Scene(), []);
  useFrame((state) => {
    state.gl.setRenderTarget(target);
    state.gl.render(scene, camRef.current);
  }, 0);
  return createPortal(<Model model={model} videoTexture={videoTexture} {...props} />, scene);
}

function Models({ shownIndex, models }) {
  const _models = useGLTF(models);
  const [idxesInScenes] = useState([
    shownIndex,
    (shownIndex + 1) % models.length,
  ]);
  const hiddenTxt = useRef(1);
  const shownTxt = useMemo(() => {
    if (idxesInScenes.indexOf(shownIndex) < 0)
      idxesInScenes[hiddenTxt.current] = shownIndex;
    const idx = idxesInScenes.indexOf(shownIndex);
    hiddenTxt.current = idx ? 0 : 1;
    return idx;
  }, [shownIndex, idxesInScenes]);

  const t0 = useFBO({ stencilBuffer: false, multisample: true });
  const t1 = useFBO({ stencilBuffer: false, multisample: true });
  const targets = [t0, t1];
  const camRef = useRef(null);

  useFrame((state) => {
    state.gl.setRenderTarget(null);
    state.gl.render(state.scene, state.camera);
  }, 1);

  const [springs, api] = useSprings(
    2,
    (i) => transitions[i === 0 ? "enter" : "from"]
  );
  const regress = useThree((state) => state.performance.regress);

  useEffect(() => {
    api.start((i) => {
      const isEntering = i === shownTxt;
      const t = isEntering ? enter : leave;
      return { ...t, onChange: () => regress() };
    });
  }, [api, shownTxt, regress]);

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        position={[-2.71, 1.34, 1.8]}
        rotation={[-0.74, -1.14, -0.7]}
        far={100}
        fov={51}
      />
      <ScreenQuad>
        <CrossFadeMaterial
          attach="material"
          texture1={t0.texture}
          texture2={t1.texture}
          shownTxt={shownTxt}
        />
      </ScreenQuad>
      {springs.map((props, i) => (
        <RenderScene
          key={i}
          target={targets[i]}
          model={_models[idxesInScenes[i]]}
          camRef={camRef}
          videoTexture={videoTexture}
          fileName={models[idxesInScenes[i]].split('/').pop()} // Extract the file name
          {...props}
        />
      ))}
    </>
  );
}

export function Scene({ models, shownIndex = 0, target, videoTexture }) {
  return (
    <Canvas shadows gl={{ antialias: true }} eventSource={target.current}>
      <Models shownIndex={shownIndex} models={models} videoTexture={videoTexture} />
    </Canvas>
  );
}
