import * as THREE from "three";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, createPortal, useThree } from "@react-three/fiber";
import {
  PerspectiveCamera,
  ScreenQuad,
  useGLTF,
  useFBO,
  Environment
} from "@react-three/drei";
import { a, useSprings } from "@react-spring/three";
import { CrossFadeMaterial } from "./XFadeMaterial";

let video; // Declare the video variable outside the conditional block

if (typeof document !== "undefined") {
  video = document.createElement("video");
  video.src = "./3DModels/motion design_img0.mp4";
  video.loop = true;
  video.muted = true;
  video.play();
}

const videoTexture = video ? new THREE.VideoTexture(video) : null; // Check if video is defined before creating videoTexture

if (videoTexture) {
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.rotation = Math.PI;
  videoTexture.center.set(0.5, 0.5);
  videoTexture.repeat.set(-1, 1);
}

let talksVideo;
if (typeof document !== "undefined") {
  talksVideo = document.createElement("video");
  talksVideo.src = "./3DModels/talks_img0.mp4";
  talksVideo.loop = true;
  talksVideo.muted = true;
  talksVideo.play();
}

const talksVideoTexture = talksVideo ? new THREE.VideoTexture(talksVideo) : null;

if (talksVideoTexture) {
  talksVideoTexture.minFilter = THREE.LinearFilter;
  talksVideoTexture.magFilter = THREE.LinearFilter;
  talksVideoTexture.rotation = Math.PI;
  talksVideoTexture.center.set(0.5, 0.5);
  talksVideoTexture.repeat.set(-1, 1);
}


let conversationalDesignVideo;
if (typeof document !== "undefined") {
  conversationalDesignVideo = document.createElement("video");
  conversationalDesignVideo.src = "./3DModels/conversational design_img0.mp4";
  conversationalDesignVideo.loop = true;
  conversationalDesignVideo.muted = true;
  conversationalDesignVideo.play();
}

// Create the conversationalDesignTexture using THREE.VideoTexture
const conversationalDesignTexture = conversationalDesignVideo
  ? new THREE.VideoTexture(conversationalDesignVideo)
  : null;

// Check if conversationalDesignTexture is defined and configure its properties
if (conversationalDesignTexture) {
  conversationalDesignTexture.minFilter = THREE.LinearFilter;
  conversationalDesignTexture.magFilter = THREE.LinearFilter;
  conversationalDesignTexture.rotation = Math.PI;
  conversationalDesignTexture.center.set(0.5, 0.5);
  conversationalDesignTexture.repeat.set(-1, 1);
}



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
      model.scene.traverse((child) => {
        if (
          child.isMesh &&
          child.material.name === "screen.001" &&
          fileName === "talks.gltf"
        ) {
          child.material.map = talksVideoTexture; // Assign talksVideoTexture to talks.gltf
          child.material.needsUpdate = true;
        } else if (
          child.isMesh &&
          child.material.name === "screen.001" &&
          fileName === "motion design.gltf"
        ) {
          child.material.map = videoTexture; // Assign videoTexture to motion design.gltf
          child.material.needsUpdate = true;
        }
      });
    }
  }, [model, videoTexture, talksVideoTexture, fileName]);
  

  

  return (
    <group ref={ref}>
      <ambientLight intensity={3.5} color={"#fff"} />
      <directionalLight
        ref={ref}
        intensity={1}
        position={[-1, 0, 50]}
        shadow-radius={5}
        castShadow
      ></directionalLight>
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
  return createPortal(
    <Model model={model} videoTexture={videoTexture} {...props} />,
    scene
  );
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
          fileName={models[idxesInScenes[i]].split("/").pop()}
          {...props}
        />
      ))}
    </>
  );
}

export function SceneMobile({ models, shownIndex = 0, target, videoTexture }) {
  return (
    <Canvas shadows gl={{ antialias: true }} eventSource={target.current}>
      <Models
        shownIndex={shownIndex}
        models={models}
        videoTexture={videoTexture}
      />
    </Canvas>
  );
}
