<script>
  import * as d3Fetch from 'd3-fetch'
  import { onMount } from 'svelte'
  import { login, user, contrasena } from '../store'
  import Input from './Input.svelte'

  let contrasenaInput
  let userInput
  let allowed = {}
  
  async function fetchAllowed() {
    const URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7w_KjpjOnWrTBRESsdR4B71EURLp-aFfOTqk5KnA9Y3uZ9FhfHndJtddFkq_jbbp5e1u346r1uG8V/pub?gid=1063007507&single=true&output=csv'
    // return await fetch(allowedURL)
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
      // console.log("can't be empty")
      return
    }
    handleLogIn()
    return {
      user: userInput,
    }
  }

  function handleLogIn() {
    console.log(allowed.programs)
    if (!$login) {
      const userAttemp = allowed.programs.filter( user => user.name === userInput)
      const userWord = allowed.programs.filter( user => user.word === contrasenaInput)
      console.log(userAttemp)
      console.log(userWord)
      if (userAttemp.length > 0 && userWord.length > 0) {
          console.log('grant access')
          $login = !$login
          $user = userInput
          $contrasena = contrasenaInput
          handleClear()
          return
      }
      // console.log('store is ', $login)
      // console.log('store is ', $user)
      alert('Wrong Credentials.')
      return
    }
  }
  
  function handleLogOut() {
      $login = false
      $user = ''
      $contrasena = ''
      handleClear()
  }

  const handleClear = () => {
    if (!userInput && !contrasena) {
      return
    }
    userInput = ''
    contrasenaInput = ''
  }

  onMount( async () => {
    console.log('fetch the allowed programs')
    allowed = await fetchAllowed()
    console.log(allowed)
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
