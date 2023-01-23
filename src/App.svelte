<script>
  import { onMount } from "svelte"
  import { getData } from "./data"
  import { getSocialMediaData } from "./socialMediaData"
  import { getPodcastData } from "./podcasts"
  import MainContainer from "./components/MainContainer.svelte"

  let dataset = {}
  let socialMediaDataset = {}
  let podcastsDataset = {}


  onMount(async () => {
    const res = await getData()
    dataset = res

    const resSocialMediaData = await getSocialMediaData()
    socialMediaDataset = resSocialMediaData

    const resPodcasts = await getPodcastData()
    podcastsDataset = resPodcasts


    if (socialMediaDataset) {
      console.log(socialMediaDataset)
    }

    if (podcastsDataset) {
      console.log(podcastsDataset)
    }
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
