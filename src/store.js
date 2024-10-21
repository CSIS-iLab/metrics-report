import { readable, writable } from 'svelte/store'

export const login = writable(false)
export const user = writable('')
export const contrasena = writable('')
export const titleValue = writable('Metrics Dashboard | CSIS External Relations')
export const currentYear = readable(new Date().getFullYear())
// export const yearShowing = writable(2023)
export const yearShowing = writable(2024) // todo: find a way to get the current year
export const years = readable([2024, 2023])
export const ispSubPrograms = readable([
  'International Security Program',
  'Aerospace Security Project',
  'Arleigh A. Burke Chair in Strategy',
  // 'Defending Democratic Institutions',
  'Defense-Industrial Initiatives Group',
  // 'Defense Budget Analysis',
  'Emeritus Chair in Strategy',
  'Missile Defense Project',
  // 'Project on Fragility and Mobility',
  'Project on Nuclear Issues',
  'Smart Women, Smart Power',
  'Transnational Threats Project',
  'Intelligence, National Security, and Technology Program',
  'Warfare, Irregular Threats, and Terrorism Program',
  'Defending Democratic Institutions',
  'Futures Lab'
])
