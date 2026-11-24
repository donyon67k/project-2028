// How each person's podium sprite is drawn, set by hand from their public portrait.
// hair: 'short' | 'long' | 'bald'   beard: true when they wear one
// suit / shirt / tie: what they wear in the portrait (tie: null = open collar or blouse)
const NAVY = '#1c2848'
const BLACK = '#18181e'
export const LOOKS = {
  harris: { skin: '#c8977d', hairColor: '#2a211c', hair: 'long', suit: NAVY, shirt: NAVY, tie: null },
  newsom: { skin: '#e2b49a', hairColor: '#8a827a', hair: 'short', suit: BLACK, shirt: '#e8e8e8', tie: '#2a2a36' },
  aoc: { skin: '#e6b195', hairColor: '#2b211d', hair: 'long', suit: BLACK, shirt: BLACK, tie: null, lips: '#b0303a' },
  buttigieg: { skin: '#e0ae93', hairColor: '#3a2a20', hair: 'short', suit: NAVY, shirt: '#f0f0f0', tie: '#5b8fd8' },
  shapiro: { skin: '#d9a58a', hairColor: '#4a3a30', hair: 'short', glasses: true, suit: '#22252c', shirt: '#f0f0f0', tie: null },
  pritzker: { skin: '#d8a58c', hairColor: '#2a221e', hair: 'short', suit: '#4a4e55', shirt: '#f0f0f0', tie: '#6b3fa0' },
  whitmer: { skin: '#e8b9a0', hairColor: '#5a3a26', hair: 'long', suit: '#d8287a', shirt: '#d8287a', tie: null },
  beshear: { skin: '#e8b09a', hairColor: '#7a5434', hair: 'short', suit: NAVY, shirt: '#f0f0f0', tie: '#8c1c2c' },
  booker: { skin: '#9a6a50', hairColor: '#9a6a50', hair: 'bald', suit: '#1e2230', shirt: '#f0f0f0', tie: '#5b2a7a' },
  murphy: { skin: '#d8a58c', hairColor: '#6a5040', hair: 'short', beard: '#8a7a6a', suit: NAVY, shirt: '#f0f0f0', tie: '#8ab0e0' },
  khanna: { skin: '#a87256', hairColor: '#1c1414', hair: 'short', suit: '#55585e', shirt: '#f0f0f0', tie: '#7a9ad8' },
  kelly: { skin: '#e0b09a', hairColor: '#e0b09a', hair: 'bald', suit: '#1c2c5c', shirt: '#f0f0f0', tie: '#8ab0e0' },
  emanuel: { skin: '#e0b0a0', hairColor: '#c8c8c8', hair: 'short', suit: '#1c2230', shirt: '#f0f0f0', tie: '#5b8fd8' },
  ossoff: { skin: '#e8b49a', hairColor: '#2a1e18', hair: 'short', suit: BLACK, shirt: '#f0f0f0', tie: '#7a1f2a' },
  moore: { skin: '#7a4e3a', hairColor: '#7a4e3a', hair: 'bald', suit: '#1c2440', shirt: '#f0f0f0', tie: '#9a1f2a' },
  vance: { skin: '#e0ae96', hairColor: '#4a3426', hair: 'short', beard: '#4a3426', suit: '#1c1e26', shirt: '#f0f0f0', tie: '#8c1c22' },
  rubio: { skin: '#c89478', hairColor: '#1e1814', hair: 'short', suit: NAVY, shirt: '#f0f0f0', tie: '#3a5a9a' },
  desantis: { skin: '#d8a084', hairColor: '#2a1e18', hair: 'short', suit: '#2a4a8a', shirt: '#a8c8e8', tie: null },
  cruz: { skin: '#d8a088', hairColor: '#3a2a22', hair: 'short', beard: '#3a2a22', suit: '#1c1c22', shirt: '#f0f0f0', tie: '#8a7a5a' },
  hawley: { skin: '#e8b49a', hairColor: '#4a3222', hair: 'short', suit: '#1a1a20', shirt: '#f0f0f0', tie: '#2a3a5a' },
  trumpjr: { skin: '#d8a088', hairColor: '#2a1e18', hair: 'short', beard: '#3a2a22', suit: NAVY, shirt: '#f0f0f0', tie: null },
  youngkin: { skin: '#e8b49a', hairColor: '#6a5040', hair: 'short', suit: NAVY, shirt: '#f0f0f0', tie: '#c8202a' },
  kemp: { skin: '#e0a890', hairColor: '#b8b0a8', hair: 'short', suit: '#2a3a6a', shirt: '#f0f0f0', tie: '#7ab0e0' },
  mcentee: { skin: '#d8a084', hairColor: '#2a1e18', hair: 'short', suit: '#1c2228', shirt: '#1c2228', tie: null },
  haley: { skin: '#c8947a', hairColor: '#1c1414', hair: 'long', suit: BLACK, shirt: BLACK, tie: null },
}
