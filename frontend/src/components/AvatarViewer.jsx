import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { detectBoneMap, detectFingerMap } from '../utils/boneUtils'
import { signPoses } from '../data/signPoses'
import { applySignPose } from '../utils/signAnimator'

// All values are local Euler offsets from the GLB's measured rest rotations.
// The target is a signing space 20-30 cm in front of the torso: low elbows,
// bent forearms, separated hands, and palms turned toward the camera.
export const SIGNING_CONFIG = {
  background: '#20b94b',
  camera: { position: [0, 1.45, 3.25], fov: 32, target: [0, 1.35, 0] },
  pose: {
    leftShoulder: [-0.24, -0.58, -0.32],
    rightShoulder: [-0.24, 0.58, 0.32],
    leftArm: [-0.34, -0.48, -0.18],
    rightArm: [-0.34, 0.48, 0.18],
    leftForeArm: [-1.12, -0.14, -0.08],
    rightForeArm: [-1.12, 0.14, 0.08],
    leftHand: [0.16, -0.16, -0.03],
    rightHand: [0.16, 0.16, 0.03],
  },
}

const FRONT_SIGNING_TARGETS = Object.entries(SIGNING_CONFIG.pose).map(([key, rotation]) => ({ key, rotation }))

function AvatarModel({ currentSign = '', debugValues, onBonesReady }) {
  const groupRef = useRef(null)
  const restRotationRef = useRef(new Map())
  const currentSignRef = useRef(currentSign)
  const debugValuesRef = useRef(debugValues)
  const boneMapRef = useRef({})
  const fingerMapRef = useRef({ left: {}, right: {} })
  const { scene } = useGLTF('/models/female-sign-avatar.glb')

  useEffect(() => {
    currentSignRef.current = currentSign
  }, [currentSign])

  useEffect(() => {
    debugValuesRef.current = debugValues
  }, [debugValues])

  useEffect(() => {
    if (!scene) return

    const map = detectBoneMap(scene)
    const fingers = detectFingerMap(scene)
    boneMapRef.current = map
    fingerMapRef.current = fingers
    Object.values(fingers).forEach((sideFingers) => {
      Object.values(sideFingers).forEach((bones) => {
        bones.forEach((bone) => restRotationRef.current.set(bone.uuid, bone.quaternion.clone()))
      })
    })
    Object.values(map).forEach((bone) => {
      if (bone) restRotationRef.current.set(bone.uuid, bone.quaternion.clone())
    })

    if (import.meta.env.DEV) {
      console.log('Detected bones:', Object.keys(map))
      console.table(Object.fromEntries(Object.entries(map).map(([key, bone]) => [key, {
        name: bone.name,
        restQuaternion: bone.quaternion.toArray().map((value) => Number(value.toFixed(4))),
      }])))
      console.log('Detected finger chains:', Object.fromEntries(Object.entries(fingers).map(([side, sideFingers]) => [side, Object.fromEntries(Object.entries(sideFingers).map(([finger, bones]) => [finger, bones.length]))])))
    }
    onBonesReady?.(map)

    scene.scale.set(1.1, 1.1, 1.1)
    scene.position.set(0, -1.2, 0)
    scene.rotation.y = 0
    groupRef.current = scene
  }, [scene])

  useFrame(() => {
    if (!groupRef.current) return

    const activeSign = currentSignRef.current
    for (const { key, rotation } of FRONT_SIGNING_TARGETS) {
      const bone = boneMapRef.current[key]
      if (!bone) continue

      const frontOffset = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation, 'XYZ'))
      const frontTarget = (restRotationRef.current.get(bone.uuid) || new THREE.Quaternion()).clone().multiply(frontOffset)
      bone.quaternion.copy(frontTarget)
    }

    // Debug offsets are deliberately last so they override sign/mixer output.
    Object.entries(debugValuesRef.current).forEach(([key, rotation]) => {
      const bone = boneMapRef.current[key]
      if (!bone) return
      const rest = restRotationRef.current.get(bone.uuid) || new THREE.Quaternion()
      const offset = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation, 'XYZ'))
      bone.quaternion.copy(rest.clone().multiply(offset))
    })

    const targetPose = signPoses[activeSign]
    if (!targetPose) return

    applySignPose({
      letter: activeSign,
      fingerMap: fingerMapRef.current,
      boneMap: boneMapRef.current,
      restRotations: restRotationRef.current,
      neutralHandOffsets: SIGNING_CONFIG.pose,
    })

    // Re-apply arm debug values after finger pose as well, so hand sliders
    // remain authoritative while the selected sign changes.
    Object.entries(debugValuesRef.current).forEach(([key, rotation]) => {
      const bone = boneMapRef.current[key]
      if (!bone) return
      const rest = restRotationRef.current.get(bone.uuid) || new THREE.Quaternion()
      const offset = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation, 'XYZ'))
      bone.quaternion.copy(rest.clone().multiply(offset))
    })
  })

  return (
    <>
      <primitive object={scene} ref={groupRef} />
      <mesh position={[0, -1.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.4, 64]} />
        <meshStandardMaterial color="#f4f5f7" />
      </mesh>
    </>
  )
}

export default function AvatarViewer({ currentSign, t, focusHand = false }) {
  const [loadError, setLoadError] = useState('')
  const [resolvedBones, setResolvedBones] = useState({})
  const [debugValues, setDebugValues] = useState(() => ({ ...SIGNING_CONFIG.pose }))

  const updateDebugValue = (key, axis, value) => {
    setDebugValues((previous) => ({
      ...previous,
      [key]: previous[key].map((entry, index) => index === axis ? Number(value) : entry),
    }))
  }

  const copyDebugValues = () => {
    const json = JSON.stringify(debugValues, null, 2)
    console.log('SIGNING_DEBUG_VALUES', json)
    navigator.clipboard?.writeText(json)
  }

  const useFrontCameraPose = () => setDebugValues({ ...SIGNING_CONFIG.pose })

  useEffect(() => {
    fetch('/models/female-sign-avatar.glb', { method: 'HEAD' })
      .then((response) => {
        if (!response.ok) {
          setLoadError(t.modelMissing)
        }
      })
      .catch(() => {
        setLoadError(t.modelMissing)
      })
  }, [])

  if (loadError) {
    return (
      <div className="avatar-stage" aria-live="polite">
        <div className="avatar-error-panel">
          <strong>{t.modelUnavailable}</strong>
          <p>{loadError}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="avatar-stage" aria-live="polite">
      <Canvas
        camera={focusHand ? { position: [0, 1.55, 1.8], fov: 24 } : SIGNING_CONFIG.camera}
        shadows
        dpr={[1, 2]}
      >
        <color attach="background" args={[SIGNING_CONFIG.background]} />
        <ambientLight intensity={1.1} />
        <directionalLight castShadow position={[2, 4, 4]} intensity={1.8} shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <spotLight position={[-2, 3, 2]} angle={0.5} intensity={1.2} penumbra={1} />
        <AvatarModel currentSign={currentSign} debugValues={debugValues} onBonesReady={setResolvedBones} />
          <OrbitControls
          target={focusHand ? [0, 1.45, 0] : SIGNING_CONFIG.camera.target}
          enablePan
          enableZoom
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.7}
          zoomSpeed={0.8}
          panSpeed={0.7}
          minDistance={1.4}
          maxDistance={7}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI - 0.15}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
        />
      </Canvas>
      <ArmDebugPanel bones={resolvedBones} values={debugValues} onChange={updateDebugValue} onCopy={copyDebugValues} onFrontPose={useFrontCameraPose} />
    </div>
  )
}

function ArmDebugPanel({ bones, values, onChange, onCopy, onFrontPose }) {
  const entries = ['leftShoulder', 'leftArm', 'leftForeArm', 'leftHand', 'rightShoulder', 'rightArm', 'rightForeArm', 'rightHand']

  return (
    <details className="arm-debug-panel">
      <summary>Arm bone debug controls</summary>
      <div className="arm-debug-status">
        {entries.map((key) => <div key={key} className={bones[key] ? 'bone-found' : 'bone-missing'}>{key}: {bones[key]?.name || 'MISSING'}</div>)}
      </div>
      {entries.map((key) => (
        <fieldset key={key}>
          <legend>{key} <small>{bones[key]?.name || 'MISSING'}</small></legend>
          {[0, 1, 2].map((axis) => <label key={axis}>{['X', 'Y', 'Z'][axis]} <input type="range" min="-3.14" max="3.14" step="0.01" value={values[key][axis]} disabled={!bones[key]} onChange={(event) => onChange(key, axis, event.target.value)} /><output>{values[key][axis].toFixed(2)}</output></label>)}
        </fieldset>
      ))}
      <div className="arm-debug-actions">
        <button type="button" onClick={onFrontPose}>Front camera pose</button>
        <button type="button" onClick={onCopy}>Copy values</button>
      </div>
    </details>
  )
}
