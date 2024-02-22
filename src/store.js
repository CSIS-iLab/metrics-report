import { readable, writable } from "svelte/store"

export const login = writable(false)
export const user = writable('')
export const contrasena = writable('')
export const currentYear = readable(new Date().getFullYear())
// export const yearShowing = writable(2023)
export const yearShowing = writable(2024)
export const years = readable([2024, 2023])
