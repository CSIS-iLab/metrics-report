<script>
  import { auth } from '../store'
  import Input from './Input.svelte'
  let login
  let user
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
    if (!login) {
    $auth.login = !$auth.login
    $auth.user = userInput
    console.log('store is ', $auth.login)
    console.log('store is ', $auth.user)
    handleClear()
    return
    }    
  }
  
  function handleLogOut() {
      $auth.login = false
      $auth.user = ''
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
  {#if !$auth.login}
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

  {#if $auth.login}
    <button on:click={handleLogOut}>Log Out</button>
    <h1>Welcome {$auth.user}</h1>
  {/if}
</div>
