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
        bind:value={contrasena}
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
