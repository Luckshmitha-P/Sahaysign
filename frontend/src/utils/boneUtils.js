import * as THREE from 'three'

export function normalizeBoneName(value = '') {
  return String(value)
    .replace(/[_\s-]+/g, '')
    .replace(/\./g, '')
    .toLowerCase()
}

export function collectBoneNames(scene) {
  const names = []

  scene.traverse((object) => {
    if (object.isBone || object.type === 'Bone') {
      names.push(object.name)
    }
  })

  return names
}

export function detectBoneMap(scene) {
  const aliases = {
    leftArm: ['leftarm', 'mixamorigleftarm', 'left_upperarm', 'leftupperarm'],
    rightArm: ['rightarm', 'mixamorigrightarm', 'right_upperarm', 'rightupperarm'],
    leftForeArm: ['leftforearm', 'mixamorigleftforearm', 'leftlowerarm', 'leftlowerarm'],
    rightForeArm: ['rightforearm', 'mixamorigrightforearm', 'rightlowerarm', 'rightlowerarm'],
    leftHand: ['lefthand', 'mixamoriglefthand'],
    rightHand: ['righthand', 'mixamorigrighthand'],
    leftShoulder: ['leftshoulder', 'mixamorigleftshoulder'],
    rightShoulder: ['rightshoulder', 'mixamorigrightshoulder'],
    head: ['head', 'mixamorighead'],
    neck: ['neck', 'mixamorigneck'],
    spine: ['spine', 'spines', 'mixamorigspine', 'mixamorigspine1', 'mixamorigspine2'],
    leftIndex: ['leftindex', 'mixamorigleftindex', 'indexleft'],
    rightIndex: ['rightindex', 'mixamorigrightindex', 'indexright'],
    leftThumb: ['leftthumb', 'mixamorigleftthumb'],
    rightThumb: ['rightthumb', 'mixamorigrightthumb'],
    leftMiddle: ['leftmiddle', 'mixamorigleftmiddle'],
    rightMiddle: ['rightmiddle', 'mixamorigrightmiddle'],
    leftRing: ['leftring', 'mixamorigleftring'],
    rightRing: ['rightring', 'mixamorigrightring'],
    leftPinky: ['leftpinky', 'mixamorigleftpinky'],
    rightPinky: ['rightpinky', 'mixamorigrightpinky'],
  }

  const boneMap = {}

  scene.traverse((object) => {
    if (!(object.isBone || object.type === 'Bone')) return

    const normalized = normalizeBoneName(object.name)

    Object.entries(aliases).forEach(([key, variants]) => {
      const exactMatch = variants.some((variant) => normalized === variant)
      const looseMatch = variants.some((variant) => normalized.includes(variant))
      if (exactMatch || (looseMatch && !boneMap[key])) {
        boneMap[key] = object
      }
    })
  })

  return boneMap
}

export function detectFingerMap(scene) {
  const fingers = { left: {}, right: {} }
  const names = {
    thumb: ['thumb'],
    index: ['index', 'pointer'],
    middle: ['middle'],
    ring: ['ring'],
    little: ['pinky', 'little'],
  }

  scene.traverse((object) => {
    if (!(object.isBone || object.type === 'Bone')) return
    const normalized = normalizeBoneName(object.name)
    const side = normalized.includes('left') ? 'left' : normalized.includes('right') ? 'right' : null
    if (!side) return

    Object.entries(names).forEach(([finger, aliases]) => {
      if (aliases.some((alias) => normalized.includes(`${side}hand${alias}`) || normalized.includes(`${side}${alias}`) || normalized.includes(`${alias}${side}`))) {
        fingers[side][finger] = [...(fingers[side][finger] || []), object]
      }
    })
  })

  return fingers
}

export function applyBoneRotation(bone, rotation = [0, 0, 0], smoothing = 0.12) {
  if (!bone) return

  const target = new THREE.Euler(rotation[0], rotation[1], rotation[2], 'XYZ')
  const next = new THREE.Quaternion().setFromEuler(target)

  bone.quaternion.slerp(next, smoothing)
}

export function buildNeutralPose() {
  return {
    leftArm: { rotation: [0.2, 0.3, 0.2] },
    rightArm: { rotation: [-0.2, -0.3, -0.2] },
    leftForeArm: { rotation: [0.1, 0, 0.05] },
    rightForeArm: { rotation: [-0.1, 0, -0.05] },
    leftHand: { rotation: [0, 0, 0.2] },
    rightHand: { rotation: [0, 0, -0.2] },
    leftShoulder: { rotation: [0.1, -0.1, 0.08] },
    rightShoulder: { rotation: [0.1, 0.1, -0.08] },
    head: { rotation: [0, 0, 0] },
    neck: { rotation: [0, 0, 0] },
    spine: { rotation: [0, 0, 0] },
  }
}
