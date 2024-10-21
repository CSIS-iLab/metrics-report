<script>
  import { yearShowing, titleValue, user } from './store'
  import { onMount } from 'svelte'
  import { getNewData } from './data'
  import MainContainer from './components/MainContainer.svelte'

  let dataset = {}

  $: $yearShowing, fetchData()

  async function fetchData() {
    // const res = await getNewData()
    // dataset = res
    dataset = {}
    dataset = await getNewData()
  }

  // This will run on component mount and update when the store changes
  $: document.title = $user
    ? `Metrics for ${$user} | CSIS External Relations`
    : $titleValue
  onMount(fetchData)
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
