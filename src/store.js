import { readable, writable } from "svelte/store"

export const login = writable(false)
export const user = writable('')
export const contrasena = writable('')
export const currentYear = readable(new Date().getFullYear())
