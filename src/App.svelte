<script>
  import { onMount } from 'svelte'
  import { getNewData } from './data'
  import MainContainer from './components/MainContainer.svelte'

  let dataset = {}

  onMount(async () => {
    const res = await getNewData()
    dataset = res
  })
</script>

{#if dataset.data && dataset.data.tabs.length > 0}
  <MainContainer {dataset} />
{:else}
  <div class="loading-container">
    <div class="loading" />
  </div>
{/if}

<style lang="scss" global>
  @use './scss/main.scss';
</style>
