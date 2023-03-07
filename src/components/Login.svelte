<script>
  import { auth } from '../store'
  import Input from './Input.svelte'
  let login
  let user
  let contrasena
  let userInput

  auth.subscribe( value => {
    console.log(value)
    login = value.login
    user = value.user
  })

  function handleClick() {
    if (!userInput || !contrasena) {
      console.log("can't be empty")
      return
    }
    console.log(userInput)
    console.log('store is ', login)
    console.log('store is ', user)
    handleLogIn()
    return {
      user: userInput,
    }
  }

  function handleLogIn() {
    if (!login) {
    $auth.login = !login
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
  {#if !login}
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

  {#if login}
    <button on:click={handleLogOut}>Log Out</button>
    <h1>Welcome {user}</h1>
  {/if}
</div>
