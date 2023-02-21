<script>
  import { onMount } from "svelte"
  import { getData } from "./newData"
  import { getSocialMediaData } from "./socialMediaData"
  import { getPodcastData } from "./podcasts"
  import { getPressData, gettPressData } from "./press"
  import { getHelperData } from "./helper"
  import MainContainer from "./components/MainContainer.svelte"

  let dataset = {}
  let socialMediaDataset = {}
  let podcastsDataset = {}
  let pressDataset = {}
  let pressDatasetFor = {}
  let helperDataset = {}


  onMount(async () => {
    const res = await getData()
    dataset = res

    const resSocialMediaData = await getSocialMediaData()
    socialMediaDataset = resSocialMediaData

    const resPodcasts = await getPodcastData()
    podcastsDataset = resPodcasts

    const resPress = await gettPressData()
    pressDataset = resPress

    const resPressFor = await getPressData()
    pressDatasetFor = resPressFor

    const resHelper = await getHelperData()
    helperDataset = resHelper

    if (socialMediaDataset) {
      // console.log(socialMediaDataset)
    }

    if (podcastsDataset) {
      // console.log(podcastsDataset)
    }

    if (pressDataset) {
      console.log(pressDataset)
    }

    if (pressDatasetFor) {
      console.log(pressDatasetFor)
    }

    if (dataset) {
      // console.log(dataset)
    }

  });
</script>

{ #if dataset.data && dataset.data.length > 0 }
  <MainContainer {dataset} />
{:else}
  <div class="loading-container">
    <div class="loading" />
  </div>
{/if}

<style lang="scss" global>
  @use "./scss/main.scss";
</style>
