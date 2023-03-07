<script>
  import { onMount } from "svelte"
  import { getNewData } from "./data"
  import Login from "./components/Login.svelte"
  import { auth } from "./store"
  import MainContainer from "./components/MainContainer.svelte"

  let dataset = {}


  onMount(async () => {
    const res = await getNewData()
    dataset = res

    if (dataset) {
      console.log(dataset)
    }

  });
</script>
{ #if !$auth.login }
  { #if dataset.data && dataset.data.filtered.length > 0}
    <MainContainer {dataset} />
  {:else}
    <div class="loading-container">
      <div class="loading" />
    </div>
  {/if}
{/if}
  <Login />
<style lang="scss" global>
  @use "./scss/main.scss";
</style>
