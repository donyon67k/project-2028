// Electoral votes for 2028 (2020 census apportionment, same as 2024) and the 2024 statewide winner.
// Maine and Nebraska split by district: ME 3 D + 1 R (ME-2), NE 4 R + 1 D (NE-2).
export const EV = {
  AL: 9, AK: 3, AZ: 11, AR: 6, CA: 54, CO: 10, CT: 7, DE: 3, DC: 3, FL: 30, GA: 16, HI: 4, ID: 4, IL: 19, IN: 11,
  IA: 6, KS: 6, KY: 8, LA: 8, ME: 4, MD: 10, MA: 11, MI: 15, MN: 10, MS: 6, MO: 10, MT: 4, NE: 5, NV: 6, NH: 4,
  NJ: 14, NM: 5, NY: 28, NC: 16, ND: 3, OH: 17, OK: 7, OR: 8, PA: 19, RI: 4, SC: 9, SD: 3, TN: 11, TX: 40, UT: 6,
  VT: 3, VA: 13, WA: 12, WV: 4, WI: 10, WY: 3,
}

const D24 = ['CA', 'CO', 'CT', 'DE', 'DC', 'HI', 'IL', 'ME', 'MD', 'MA', 'MN', 'NH', 'NJ', 'NM', 'NY', 'OR', 'RI', 'VT', 'VA', 'WA']
export const WON_2024 = Object.fromEntries(Object.keys(EV).map((s) => [s, D24.includes(s) ? 'D' : 'R']))
export const SPLITS_2024 = { ME: { D: 3, R: 1 }, NE: { D: 1, R: 4 } }

// The seven states decided by under 9 points in 2024 that both campaigns contested.
export const BATTLEGROUNDS = ['AZ', 'GA', 'MI', 'NV', 'NC', 'PA', 'WI']

export function evTotals() {
  const t = { D: 0, R: 0 }
  for (const [s, n] of Object.entries(EV)) {
    if (SPLITS_2024[s]) { t.D += SPLITS_2024[s].D; t.R += SPLITS_2024[s].R } else t[WON_2024[s]] += n
  }
  return t
}
