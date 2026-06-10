// The 16 real host cities / stadiums of the 2026 World Cup, used purely for
// atmosphere (a venue + attendance line on each match). Edit freely.
export interface Venue {
  city: string
  stadium: string
  cap: number
}

export const VENUES: Venue[] = [
  { city: 'New York / New Jersey', stadium: 'MetLife Stadium', cap: 82500 },
  { city: 'Los Angeles', stadium: 'SoFi Stadium', cap: 70240 },
  { city: 'Dallas', stadium: 'AT&T Stadium', cap: 80000 },
  { city: 'Mexico City', stadium: 'Estadio Azteca', cap: 83264 },
  { city: 'Atlanta', stadium: 'Mercedes-Benz Stadium', cap: 71000 },
  { city: 'Miami', stadium: 'Hard Rock Stadium', cap: 65326 },
  { city: 'Seattle', stadium: 'Lumen Field', cap: 69000 },
  { city: 'San Francisco Bay Area', stadium: "Levi's Stadium", cap: 68500 },
  { city: 'Toronto', stadium: 'BMO Field', cap: 45736 },
  { city: 'Vancouver', stadium: 'BC Place', cap: 54500 },
  { city: 'Kansas City', stadium: 'Arrowhead Stadium', cap: 76416 },
  { city: 'Houston', stadium: 'NRG Stadium', cap: 72220 },
  { city: 'Boston', stadium: 'Gillette Stadium', cap: 65878 },
  { city: 'Philadelphia', stadium: 'Lincoln Financial Field', cap: 69596 },
  { city: 'Guadalajara', stadium: 'Estadio Akron', cap: 49850 },
  { city: 'Monterrey', stadium: 'Estadio BBVA', cap: 53500 },
]

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Deterministic venue + attendance for a given match (stable across renders).
export function venueFor(key: string): { venue: Venue; attendance: number } {
  const h = hash(key)
  const venue = VENUES[h % VENUES.length]
  const fill = 0.9 + ((h >> 8) % 10) / 100 // 90–99% full
  return { venue, attendance: Math.round((venue.cap * fill) / 100) * 100 }
}
