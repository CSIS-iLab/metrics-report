<script>
  import { onMount } from "svelte"
  import { getNewData } from "./data"
  import { getSocialMediaData } from "./socialMediaData"
  import { getPodcastData } from "./podcasts"
  import { getPressData } from "./press"
  import { getHelperData } from "./helper"
  import MainContainer from "./components/MainContainer.svelte"

  // let newDataset = {}
  let dataset = {}
  let socialMediaDataset = {}
  let podcastsDataset = {}
  let pressDataset = {}
  let pressDatasetFor = {}
  let helperDataset = {}


  onMount(async () => {
    const res = await getNewData()
    dataset = res

    if (dataset) {
      console.log(dataset)
    }

  });
</script>

{ #if dataset.data && dataset.data.filtered.length > 0}
  <MainContainer {dataset} />
{:else}
  <div class="loading-container">
    <div class="loading" />
  </div>
{/if}

<style lang="scss" global>
  @use "./scss/main.scss";
</style>
