<script>
  import Icon from './Icons.svelte'

  export let showingProgram
</script>

<div class="wrapper">
  <main class="container intro-content">
    <p class="intro-content__overline--small">Metrics Dashboard</p>
    <p class="intro-content__overline--regular">By The CSIS External Relations Team</p>
    <h1 class="intro-content__title">
      for the {showingProgram}
    </h1>
  </main>
  <div class="container">
  </div>
</div>

<style lang="scss">
  @use '../scss/components/intro-content';
</style>
