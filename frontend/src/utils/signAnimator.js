import * as THREE from 'three'
import { signPoses } from '../data/signPoses'

function restQuaternion(restRotations, bone) {
  return (restRotations.get(bone.uuid) || new THREE.Quaternion()).clone()
}

export function applySignPose({ letter, fingerMap, boneMap, restRotations, neutralHandOffsets = {}, smoothing = 0.12 }) {
  const targetPose = signPoses[String(letter || '').toUpperCase()]
  if (!targetPose) return false

  Object.entries(fingerMap).forEach(([side, fingers]) => {
    const sidePose = targetPose[side] || targetPose
    if (!sidePose) return

    const handBone = boneMap[`${side}Hand`]
    if (handBone && sidePose.wrist) {
      const neutralOffset = neutralHandOffsets[`${side}Hand`] || [0, 0, 0]
      const neutralQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(...neutralOffset, 'XYZ'))
      const wristOffset = new THREE.Quaternion().setFromEuler(new THREE.Euler(...sidePose.wrist, 'XYZ'))
      handBone.quaternion.slerp(restQuaternion(restRotations, handBone).multiply(neutralQuaternion).multiply(wristOffset), smoothing)
    }

    Object.entries(fingers).forEach(([finger, bones]) => {
      const curl = sidePose[finger]
      if (typeof curl !== 'number') return

      bones.forEach((bone, index) => {
        const segmentCurl = curl * (0.65 + Math.min(index, 2) * 0.16)
        const sideDirection = side === 'left' ? -1 : 1
        const direction = (finger === 'thumb' ? sidePose.thumbDirection : sidePose.direction) || [0, 0, 0]
        const offset = new THREE.Quaternion().setFromEuler(new THREE.Euler(
          segmentCurl * 1.35 + direction[0],
          direction[1] + sidePose.spread * sideDirection,
          direction[2],
          'XYZ',
        ))
        bone.quaternion.slerp(restQuaternion(restRotations, bone).multiply(offset), smoothing)
      })
    })
  })

  return true
}

export function resetPose({ boneMap, fingerMap, restRotations, smoothing = 0.16 }) {
  const bones = new Set([
    ...Object.values(boneMap),
    ...Object.values(fingerMap).flatMap((fingers) => Object.values(fingers).flat()),
  ])

  bones.forEach((bone) => {
    if (bone) bone.quaternion.slerp(restQuaternion(restRotations, bone), smoothing)
  })
}

export function animateSignSequence(text, onLetter, options = {}) {
  const words = String(text || '').toUpperCase().match(/[A-Z]+/g) || []
  const letters = words.flatMap((word) => Array.from(word))
  const wordEnds = new Set()
  let offset = 0
  words.slice(0, -1).forEach((word) => {
    offset += word.length
    wordEnds.add(offset - 1)
  })
  const holdMs = options.holdMs || 900
  const wordPauseMs = options.wordPauseMs || 1500
  let cancelled = false
  let timer
  let index = 0

  const playNext = () => {
    if (cancelled || index >= letters.length) return
    const letter = letters[index]
    onLetter?.(letter, index, letters)
    const nextDelay = wordEnds.has(index) ? wordPauseMs : holdMs
    index += 1
    timer = setTimeout(playNext, nextDelay)
  }

  playNext()
  return () => {
    cancelled = true
    clearTimeout(timer)
  }
}