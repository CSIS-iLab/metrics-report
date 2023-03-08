<script>
  import { login, user } from '../store'
  import Input from './Input.svelte'
  // let login
  let userName
  let contrasena
  let userInput

  function handleClick() {
    if (!userInput || !contrasena) {
      console.log("can't be empty")
      return
    }
    handleLogIn()
    return {
      user: userInput,
    }
  }

  function handleLogIn() {
    if (!$login) {
    $login = !$login
    $user = userInput
    console.log('store is ', $login)
    console.log('store is ', $user)
    handleClear()
    return
    }    
  }
  
  function handleLogOut() {
      $login = false
      $user = ''
      handleClear()
  }

  const handleClear = () => {
    if (!userInput && !contrasena) {
      return
    }
    userInput = ''
    contrasena = ''
  }
</script>
<div id="login">
  {#if !$login}
    <input
      type="username"
      name="username"
      id="username"
      placeholder="Username..."
      bind:value={userInput}
      required
    />
    <input
      type="password"
      name="password"
      id="password"
      placeholder="Password..."
      bind:value={contrasena}
      required
    />
    <button on:click={handleClick}>Login</button>
    <button on:click={handleClear}>Clear</button>
  {/if}
</div>
