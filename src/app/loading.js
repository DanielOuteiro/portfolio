"use client"

import * as THREE from 'three'
import { useState, useRef, useEffect } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight, Html, Text, Effects, Environment, Center, MeshTransmissionMaterial } from '@react-three/drei'
import { WaterPass, GlitchPass } from 'three-stdlib'

extend({ WaterPass, GlitchPass })

export default function Loading() {
  const [textValue, setTextValue] = useState(1)

  useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + 5000 // 5 seconds

    const updateText = () => {
      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      const progress = (elapsedTime / 5000) * 100 // Calculate progress from 0 to 100
      setTextValue(progress.toFixed(0))

      if (currentTime < endTime) {
        requestAnimationFrame(updateText)
      }
    }

    updateText()
  }, [])

  return (

    <Canvas eventPrefix="client" shadows camera={{ position: [1, 0.5, 10] }}>
      <color attach="background" args={['#f0f0f']} />
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} castShadow />
      <pointLight position={[-10, 0, -10]} intensity={2} />
      <group position={[0, -1, -2]}>
        <Text position={[0, 4, -10]} font="/Inter-Regular.woff" fontSize={6}>
          {textValue}
          <meshStandardMaterial color="#000" toneMapped={false} />
        </Text>
      </group>
      <Environment preset="city" />
      <Postpro />
      <Rig />
    </Canvas>
  )
}

function Postpro() {
  const ref = useRef()
  useFrame((state) => (ref.current.time = state.clock.elapsedTime * 3))
  return (
    <Effects>
      <waterPass ref={ref} factor={0.5} />
      <glitchPass />
    </Effects>
  )
}

function Rig({ vec = new THREE.Vector3() }) {
  useFrame((state) => {
    state.camera.position.lerp(vec.set(1 + state.pointer.x, 0.5, 3), 0.01)
    state.camera.lookAt(0, 0, 0)
  })
}

