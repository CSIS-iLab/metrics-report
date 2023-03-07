import { writable } from "svelte/store"

export const auth = writable( {
    login: false,
    user: ''
})