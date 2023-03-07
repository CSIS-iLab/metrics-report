<script>
  import Input from './Input.svelte'
  export let user
  export let contrasena

  function handleClick() {
    if (!user || !contrasena) {
      console.log("can't be empty")
      return
    }
    console.log(user)
    return {
      user: user,
    }
  }

  const handleClear = () => {
    if (!user && !contrasena) {
      return
    }
    user = ''
    contrasena = ''
  }
</script>

<div id="login">
  <input
    type="username"
    name="username"
    id="username"
    placeholder="Username..."
    bind:value={user}
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
</div>
