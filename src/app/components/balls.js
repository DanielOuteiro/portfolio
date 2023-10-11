import * as THREE from "three";
import { useRef } from "react"; 
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Text,
} from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
} from "@react-three/rapier";

THREE.ColorManagement.enabled = false;
const baubleMaterials = [];

// Load textures
const textureLoader = typeof window !== 'undefined' ? new THREE.TextureLoader() : null;

if (textureLoader) {
  for (let i = 1; i <= 17; i++) {
    const texture = textureLoader.load(`/balltextures/texture${i}.jpg`);
    const roughness = 0.1; // Adjust this value to control roughness
    const metalness = 0.00001; // Adjust this value to control metalness
    const emissiveColor = new THREE.Color(0x000000); // Adjust emissive color if needed

    baubleMaterials.push(
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: roughness,
        metalness: metalness,
        emissive: emissiveColor,
        emissiveIntensity: 0.1, // Adjust emissive intensity if needed
      })
    );
  }
}

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);
const baubles = [...Array(17)].map(() => ({
  scale: [0.5, 0.5, 1, 1, 1.25][3],
}));

function Bauble({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
}) {
  const api = useRef(null); // Initialize the ref with null

  const materialIndex = Math.floor(Math.random() * baubleMaterials.length);
  const baubleMaterial = baubleMaterials[materialIndex];

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta);

    // Check if api.current is not null before applying impulse
    if (api.current) {
      api.current.applyImpulse(
        vec
          .copy(api.current.translation())
          .normalize()
          .multiply({
            x: -50 * delta * scale,
            y: -150 * delta * scale,
            z: -50 * delta * scale,
          })
      );
    }
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
      dispose={null}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={baubleMaterial}
      />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef();
  useFrame(({ mouse, viewport }) => {
    vec.lerp(
      {
        x: (mouse.x * viewport.width) / 2,
        y: (mouse.y * viewport.height) / 2,
        z: 0,
      },
      0.1
    );
    ref.current?.setNextKinematicTranslation(vec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
      castShadow
      receiveShadow
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

export const Balls = () => (
  <Canvas
    shadows
    gl={{ logarithmicDepthBuffer: true }}
    camera={{ position: [0, 0, 30], fov: 35, near: 1, far: 40 }}
  >
    <color attach="background" args={["#fff"]} />
    <Text
      position={[0, 0, -10]}
      letterSpacing={-0.05}
      fontSize={2}
      color="black"
      material-toneMapped={false}
      material-fog={false}
      anchorX="center"
      anchorY="middle"
      maxWidth={30}
    >
      {`Figma . Spline . Webflow . NextJS . Lottie . Maze . Retool . Rive . After Effects . Storybook . Jira . Blender . Cinema4D . Python . Unreal Engine . Framer . Flutterflow . R3F . Tableau `}
    </Text>

    <Physics gravity={[0, 0, 0]}>
      <Pointer />
      {
        baubles.map((props, i) => <Bauble key={i} {...props} />) /* prettier-ignore */
      }
    </Physics>
    <Environment preset="warehouse" blur={1000} />
  </Canvas>
);

export default Balls;
