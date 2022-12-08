<script>
  import { onMount } from "svelte"
  import { getData } from "./data"
  import { getSocialMediaData } from "./socialMediaData"
  import MainContainer from "./components/MainContainer.svelte"

  let dataset = {}
  let socialMediaDataset = {}

  onMount(async () => {
    const res = await getData()
    dataset = res

    const resSocialMediaData = await getSocialMediaData()
    // socialMediaDataset = resSocialMediaData.values


    // if (socialMediaDataset) {
    //   console.log(socialMediaDataset)
    // }
  });
</script>

{#if dataset.data && dataset.data.length > 0}
  <MainContainer {dataset} />
{:else}
  <div class="loading-container">
    <div class="loading" />
  </div>
{/if}

<style lang="scss" global>
  @use "./scss/main.scss";
</style>
