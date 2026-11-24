// Which page is the main screen (what the site opens on).
// Right now that's the debate stages. Closer to Election Day, set MAIN_SCREEN to 'map',
// or set MAP_TAKES_OVER to a date and the electoral map becomes the main screen on its own that day.
export const MAIN_SCREEN = 'stages'
export const MAP_TAKES_OVER = null // e.g. '2028-08-28' (after both conventions)

export function mainScreen(now = new Date()) {
  if (MAP_TAKES_OVER && now >= new Date(`${MAP_TAKES_OVER}T00:00:00`)) return 'map'
  return MAIN_SCREEN
}
