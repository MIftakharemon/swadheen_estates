'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF, useTexture } from '@react-three/drei'
import { BackSide } from 'three'
import { useMotionPreferences } from '@/experience/motion/motion-provider'

function LoadingLabel({ label }: { label: string }) {
  return (
    <Html center>
      <div className="rounded-full border border-white/20 bg-ink/70 px-3 py-2 text-[10px] font-bold text-white backdrop-blur">
        {label}
      </div>
    </Html>
  )
}

function BuildingModel() {
  return (
    <group rotation={[0, -0.5, 0]} position={[0, -0.4, 0]}>
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[5.8, 0.2, 4.1]} />
        <meshStandardMaterial color="#b3a389" />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[5.2, 2.2, 3.6]} />
        <meshStandardMaterial color="#e8deca" roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[5.6, 0.2, 4]} />
        <meshStandardMaterial color="#7f6755" roughness={0.7} />
      </mesh>
      <mesh position={[0.9, 0.1, 1.82]}>
        <boxGeometry args={[1.8, 1.2, 0.05]} />
        <meshStandardMaterial color="#8db6c0" metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[-1.65, 0.1, 1.82]}>
        <boxGeometry args={[1.2, 1.2, 0.05]} />
        <meshStandardMaterial color="#8db6c0" metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh position={[1.7, -0.2, 1.84]}>
        <boxGeometry args={[0.75, 1.7, 0.06]} />
        <meshStandardMaterial color="#5d4c3c" roughness={0.55} />
      </mesh>
      <mesh position={[-2.15, -0.8, -0.4]} rotation={[0, 0.25, 0]}>
        <boxGeometry args={[1.4, 0.25, 1.1]} />
        <meshStandardMaterial color="#6d856e" roughness={1} />
      </mesh>
      <mesh position={[2.25, -0.7, -0.3]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[1.6, 0.25, 1.2]} />
        <meshStandardMaterial color="#a96a50" roughness={1} />
      </mesh>
    </group>
  )
}

function LoadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.8} position={[0, -1, 0]} />
}

export function HouseModelCanvas({ modelUrl }: { modelUrl?: string }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop="demand"
      camera={{ position: [7, 4.5, 7], fov: 34 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      className="touch-none cursor-grab active:cursor-grabbing"
    >
      <color attach="background" args={['#dfe3df']} />
      <ambientLight intensity={1.5} />
      <directionalLight castShadow position={[4, 8, 5]} intensity={3.2} shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, -4]} intensity={0.7} color="#d2a75f" />
      <Suspense fallback={<LoadingLabel label="Loading model…" />}>
        {modelUrl ? <LoadedModel url={modelUrl} /> : <BuildingModel />}
      </Suspense>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        enableZoom
        zoomSpeed={0.75}
        rotateSpeed={0.65}
        minDistance={5}
        maxDistance={14}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}

function PanoramaSphere({ url }: { url: string }) {
  const texture = useTexture(url)
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[18, 64, 32]} />
      <meshBasicMaterial map={texture} side={BackSide} />
    </mesh>
  )
}

export function TourCanvas({ panoramaUrl }: { panoramaUrl: string }) {
  const { reducedMotion, timeScale } = useMotionPreferences()
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 0.1], fov: 70 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      className="touch-none cursor-grab active:cursor-grabbing"
    >
      <Suspense fallback={<LoadingLabel label="Loading panorama…" />}>
        <PanoramaSphere url={panoramaUrl} />
      </Suspense>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enableZoom
        zoomSpeed={0.35}
        rotateSpeed={0.6}
        minDistance={0.04}
        maxDistance={0.25}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.35 * timeScale}
      />
    </Canvas>
  )
}
