import { writable } from "svelte/store"

// export const auth = writable( {
//     login: false,
//     user: ''
// })

export const login = writable(false)
export const user = writable('')
export const contrasena = writable('')