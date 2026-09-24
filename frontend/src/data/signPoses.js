const hand = (thumb, index, middle, ring, little, options = {}) => ({
  thumb,
  index,
  middle,
  ring,
  little,
  spread: options.spread || 0,
  wrist: options.wrist || [0, 0, 0],
  direction: options.direction || [0, 0, 0],
  thumbDirection: options.thumbDirection || options.direction || [0, 0, 0],
})

// Values are rig targets: 0 = extended and 1 = curled. The right/left
// definitions mirror the supplied alphabet reference image.
export const signPoses = {
  A: { right: hand(0.15, 1, 1, 1, 1, { thumbDirection: [0, -0.35, 0] }), left: hand(0.15, 1, 1, 1, 1, { thumbDirection: [0, 0.35, 0] }) },
  B: { right: hand(0.25, 0.25, 0.25, 0.25, 0.25, { spread: 0.1 }), left: hand(0.25, 0.25, 0.25, 0.25, 0.25, { spread: -0.1 }) },
  C: { right: hand(0.1, 0.2, 0.2, 0.2, 0.2, { direction: [0, 0.25, 0] }), left: null },
  D: { right: hand(0.2, 0, 0.2, 1, 1, { direction: [-0.1, 0, 0] }), left: null },
  E: { right: hand(0, 0, 1, 1, 1, { direction: [0, -0.35, 0] }), left: hand(0.2, 0, 1, 1, 1, { direction: [-0.2, 0, 0] }) },
  F: { right: hand(0.15, 0.2, 1, 1, 1), left: hand(0.15, 0, 0, 0, 0, { direction: [-0.25, 0, 0] }) },
  G: { right: hand(0.1, 1, 1, 1, 1, { thumbDirection: [0, -0.5, 0] }), left: hand(0.1, 1, 1, 1, 1, { thumbDirection: [0, 0.5, 0] }) },
  H: { right: hand(1, 0, 0, 1, 1, { spread: 0.12, direction: [0, 0.15, 0] }), left: hand(1, 0.7, 1, 1, 1, { spread: -0.15, direction: [0, -0.15, 0] }) },
  I: { right: hand(1, 1, 1, 1, 0, { direction: [0, -0.35, 0] }), left: hand(1, 0, 1, 1, 1, { direction: [-0.15, 0, 0] }) },
  J: { right: hand(0.15, 1, 1, 1, 0, { direction: [-0.25, -0.25, 0] }), left: hand(1, 0, 1, 1, 1, { direction: [-0.15, 0, 0] }) },
  K: { right: hand(0.2, 0, 0.2, 1, 1, { spread: 0.18 }), left: hand(0.2, 0, 1, 1, 1, { direction: [0, 0.2, 0] }) },
  L: { right: hand(0, 0, 1, 1, 1, { spread: 0.25, thumbDirection: [0, -0.45, 0], direction: [0, -0.4, 0] }), left: null },
  M: { right: hand(1, 1, 1, 1, 1, { direction: [0, 0.3, 0] }), left: hand(0.15, 0, 0, 0, 0, { direction: [0, -0.4, 0] }) },
  N: { right: hand(1, 1, 1, 1, 1, { direction: [0, 0.3, 0] }), left: hand(0.15, 0, 0, 1, 1, { direction: [0, -0.4, 0] }) },
  O: { right: hand(0.25, 0.25, 0.25, 0.25, 0.25), left: null },
  P: { right: hand(0.2, 0, 0.25, 1, 1, { direction: [0, 0.3, 0] }), left: null },
  Q: { right: hand(0.2, 0.25, 0.25, 0.25, 0.25, { direction: [0, 0.45, 0] }), left: hand(0.2, 0, 1, 1, 1, { direction: [0, -0.35, 0] }) },
  R: { right: hand(1, 0, 0, 1, 1, { spread: 0.08 }), left: hand(0.15, 0, 0.25, 1, 1, { direction: [0, 0.25, 0] }) },
  S: { right: hand(0.8, 1, 1, 1, 1, { thumbDirection: [0, 0.45, 0] }), left: hand(0, 1, 1, 1, 0, { thumbDirection: [0, 0.45, 0], direction: [0, -0.25, 0] }) },
  T: { right: hand(0.65, 0, 1, 1, 1, { direction: [0, -0.4, 0] }), left: hand(0.2, 0, 1, 1, 1, { direction: [0, -0.35, 0] }) },
  U: { right: hand(1, 0, 0, 1, 1, { spread: 0.1, direction: [0, -0.35, 0] }), left: null },
  V: { right: hand(1, 0, 0, 1, 1, { spread: 0.32, direction: [0, -0.35, 0] }), left: null },
  W: { right: hand(1, 0, 0, 0, 1, { spread: 0.2, direction: [0, -0.25, 0] }), left: hand(1, 0, 0, 0, 1, { spread: -0.2, direction: [0, -0.25, 0] }) },
  X: { right: hand(1, 0.65, 1, 1, 1, { direction: [0, 0.25, 0] }), left: hand(1, 0.65, 1, 1, 1, { direction: [0, -0.25, 0] }) },
  Y: { right: hand(0, 1, 1, 1, 0, { spread: 0.2, direction: [0, -0.35, 0] }), left: hand(1, 0, 1, 1, 1, { direction: [0, -0.25, 0] }) },
  Z: { right: hand(1, 0, 1, 1, 1, { direction: [0, 0.4, 0] }), left: hand(0.15, 0, 0, 0, 0, { direction: [0, -0.35, 0] }) },
}

export default signPoses
