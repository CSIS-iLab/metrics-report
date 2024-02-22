<script>
  import * as d3Fetch from 'd3-fetch'
  import { onMount } from 'svelte'
  import { login, user, contrasena } from '../store'
  import Input from './Input.svelte'

  let contrasenaInput
  let userInput
  let allowed = {}
  
  async function fetchAllowed() {
    // this link is from the spreadsheet 2023 
    // const URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=1063007507&single=true&output=csv'
    // testing new spreadsheet
    const URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSmW5sqT3mHTZOxLfwzHz5UER-pnpYzqasepZZcoF927i9_Q7hKz8Mb2dQgMDhqxGexQ20jJ_MobohY/pub?gid=0&single=true&output=csv'
    const dataPromise = d3Fetch.csv( URL ).then( res => {
      const data = res.map( ( row, index ) => {
        return {
          id: index,
          name: row.name,
          word: row.word
        }
      })
      return {
        programs: data,
      }
    })
    return dataPromise
  }

  function handleClick() {
    if (!userInput || !contrasenaInput) {
      return
    }
    handleLogIn()
    return {
      user: userInput,
    }
  }

  function handleLogIn() {
    if (!$login) {
      const userAttemp = allowed.programs.filter( user => user.name === userInput)
      const userWord = allowed.programs.filter( user => user.word === contrasenaInput)
      if (userAttemp.length > 0 && userWord.length > 0) {
          $login = !$login
          $user = userInput
          $contrasena = contrasenaInput
          handleClear()
          return
      }
      alert('Wrong Credentials.')
      return
    }
  }

  const handleClear = () => {
    if (!userInput && !contrasena) {
      return
    }
    userInput = ''
    contrasenaInput = ''
  }

  onMount( async () => {
    allowed = await fetchAllowed()
  })

</script>
<div id="login" class="login">
  {#if !$login}
    <div class="login__content">
      <input
        type="username"
        name="username"
        id="username"
        placeholder="Username..."
        class="login__input"
        bind:value={userInput}
        required
      />
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password..."
        class="login__input"
        bind:value={contrasenaInput}
        required
      />
      <div class="login__content__button__container">
        <button class="login__button" on:click={handleClick}>Login</button>
        <button class="login__button" on:click={handleClear}>Clear</button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../scss/components/login';
</style>
