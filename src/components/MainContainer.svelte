<script>
  import { login, user, contrasena, currentYear } from '../store'
  import Login from './Login.svelte'
  import Header from './Header.svelte'
  import IntroContent from './IntroContent.svelte'
  import Options from './Options.svelte'
  import Table from './Table.svelte'
  import About from './About.svelte'
  import Footer from './Footer.svelte'
  import { onDestroy, onMount } from 'svelte'

  export let dataset

  let selectedYear = ''
  let selectedMonth = ''
  let selectedPageType = ''
  let filterByTab = []
  let selectedTab = 'press'
  
  $: yearToShowAverage = ''

  $:if (selectedYear !== '') {
    yearToShowAverage = selectedYear
  } else {
    yearToShowAverage = ($currentYear).toString()
  }

  let searchText
  $: row = { isOpen: false }

  $: currentColNames = () => {
    return dataset.data.tabs.filter( row => row.tab === selectedTab)[0].dataColNames
  }

  $: filteredData = () => {
    return dataset.data.filtered.filter((row) => {
      const filteredYear = selectedYear ? selectedYear : row.year
      const filteredMonth = selectedMonth ? selectedMonth : row.month
      const filteredByProgram = $user ? $user : row.program

      return row.year === filteredYear && row.month === filteredMonth && row.program === filteredByProgram
    })
  }

  // Testing new filtering data by current tab. this will output only in the console
  $: filteredDataByTab = () => {
    let filteredByProgram
    
    let byProgram =  dataset.data.tabs.filter( row => row.tab === selectedTab )[0]
    .dataForm.filter( (row, index ) => {
      const filteredYear = selectedYear ? selectedYear : row.year
      // if (selectedTab == 'videos') {
      //   if (index == 1) {
      //     console.log(row)
      //   }
      // }

      const filteredMonth = selectedMonth ? selectedMonth : row.month
      const filteredByPageType = selectedPageType ? selectedPageType : row.pageType
      return row.year === filteredYear && row.month === filteredMonth && row.pageType === filteredByPageType
    })
    // if (selectedTab == 'videos' || selectedTab == 'podcasts_(Video)' || selectedTab == 'events') {
    //   filteredByProgram = $user
    //   return byProgram.filter( row => row.programsVideos.includes(filteredByProgram))
    // }

    // if ($user === 'International Security Program') {
      
    // }
    filteredByProgram = $user
    if (['videos', 'podcasts_(Video)', 'events', 'YouTube_shorts'].includes(selectedTab)) {
        return byProgram.filter(row => row.programsVideos.includes($user))
    }

    if (selectedTab === 'publications') {
    // if (['publications', 'press', 'social_media', 'podcasts'].includes(selectedTab)) {
      // filteredByProgram = $user
      return byProgram.filter(row => row.programsNames?.includes($user))
    }

    // filteredByProgram = ($user) ? $user : row.program
    if ($user === 'International Security Program') {
      return byProgram.filter( row => row.parentProgram === filteredByProgram)
    }
    return byProgram.filter( row => row.program === filteredByProgram)

  }

  $: filteredDataForAvg = () => {
    let filteredByProgram
    return dataset.data.tabs.filter( row => row.tab === selectedTab )[0]
    .dataForm.filter( row => {
      const filteredYear = selectedYear ? selectedYear : row.year
      filteredByProgram = $user ? $user : row.program
      if (['International Security Program','Middle East Program','Southeast Asia Program'].includes(filteredByProgram)){
        return row.year === filteredYear && row.parentProgram === filteredByProgram
      }
      return row.year === filteredYear && row.program === filteredByProgram
    })
  }

  $: calculateAggregates = () => {
    const dataFilteredByYear = filteredDataForAvg().filter( row => row.year === yearToShowAverage)
    if (dataFilteredByYear.length > 0) {
      const totalMentions = calculateTotalMentions(dataFilteredByYear).toFixed()
      const topTier = calculateTopTierMentions(dataFilteredByYear).toFixed()
      const engagements = calculateEngagements(dataFilteredByYear).toFixed()
      const impressions = calculateImpressions(dataFilteredByYear).toFixed()
      const numberOfPosts = calculateNumberOfPosts(dataFilteredByYear).toFixed()
      // const uniqueVisitors = calculateUniqueVisitors(dataFilteredByYear).toFixed()
      // const pageViews = calculatePageViews(dataFilteredByYear).toFixed()
      // const totalDownloads = calculateTotalDownloads(dataFilteredByYear).toFixed()
      // const totalViewsFirst30DaysPerformance = calculateViewsFirst30DaysPerformance(dataFilteredByYear).toFixed()
      return {
        totalMentions: Number(totalMentions),
        topTier: Number(topTier),
        engagements: Number(engagements),
        impressions: Number(impressions),
        numberOfPosts: Number(numberOfPosts),
        // uniqueVisitors: Number(uniqueVisitors),
        // pageViews: Number(pageViews),
        // totalDownloads: Number(totalDownloads),
        // totalViewsFirst30DaysPerformance: Number(totalViewsFirst30DaysPerformance)
      }
    }
  }

  $: calculateAverages = () => {
    const dataFilteredByYear = filteredDataForAvg().filter( row => row.year === yearToShowAverage)
    if (['press', 'social_media'].includes(selectedTab)){
      if (dataFilteredByYear.length > 0) {
        const totalMentionsAvg= calculateTotalMentionsAvg(dataFilteredByYear).toFixed()
        const TopTierMentionsAvg = calculateTopTierMentionsAvg(dataFilteredByYear).toFixed()
        const engagementsAvg = calculateEngagementsAvg(dataFilteredByYear).toFixed()
        const impressionsAvg = calculateImpressionsAvg(dataFilteredByYear).toFixed()
        const numberOfPostsAvg = calculateNumberOfPostsAvg(dataFilteredByYear).toFixed()
        // const uniqueVisitorsAvg = calculateUniqueVisitorsAvg(dataFilteredByYear).toFixed()
        // const pageViewsAvg = calculatePageViewsAvg(dataFilteredByYear).toFixed()
        // const totalDownloadsAvg = calculateTotalDownloadsAvg(dataFilteredByYear).toFixed()
        // const totalViewsFirst30DaysPerformanceAvg = calculateViewsFirst30DaysPerformanceAvg(dataFilteredByYear).toFixed()
        return {
          totalMentions: Number(totalMentionsAvg),
          topTier: Number(TopTierMentionsAvg),
          numberOfPosts: Number(numberOfPostsAvg),
          impressions: Number(impressionsAvg),
          engagements: Number(engagementsAvg),
          // uniqueVisitors: Number(uniqueVisitorsAvg),
          // pageViews: Number(pageViewsAvg),
          // totalDownloads: Number(totalDownloadsAvg),
          // totalViewsFirst30DaysPerformance: Number(totalViewsFirst30DaysPerformanceAvg)
        }
      }
    }
    return false
  }

  $: currentProgram = $login
  onMount( async () => {
  })

  onDestroy( async () => {
  })

  const handleLogOut = () => {
    $login = false
    $user = ''
    $contrasena = ''
    currentProgram = ''
    selectedTab = 'press'
  }

  function calculateTotalMentionsAvg( data ){
    const totalMentions = data.map( row => parseInt( row.totalMentions, 10 ) )
    return totalMentions.reduce( ( a, b ) => a + b ) / totalMentions.length
  }


  function calculateTotalMentions( data ){
    const totalMentions = data.map( row => parseInt( row.totalMentions, 10 ) )
    return totalMentions.reduce( ( a, b ) => a + b )
  }

  function calculateTopTierMentionsAvg( data ){
    const topTierMentions = data.map( row => parseInt( row.topTierMentions, 10 ) )
    return topTierMentions.reduce( ( a, b ) => a + b ) / topTierMentions.length
  }

  function calculateTopTierMentions( data ){
    const topTierMentions = data.map( row => parseInt( row.topTierMentions, 10 ) )
    return topTierMentions.reduce( ( a, b ) => a + b )
  }

  function calculateNumberOfPostsAvg( data ) {
    const numberOfPosts = data.map( row => parseInt( row.numberOfPosts, 10 ) )
    return numberOfPosts.reduce( ( a, b ) => a + b ) / numberOfPosts.length
  }

  function calculateNumberOfPosts( data ) {
    const numberOfPosts = data.map( row => parseInt( row.numberOfPosts, 10 ) )
    return numberOfPosts.reduce( ( a, b ) => a + b )
  }

  function calculateImpressionsAvg( data ) {
    const impressions = data.map( row => parseInt( row.impressions, 10 ) )
    return impressions.reduce( ( a, b ) => a + b ) / impressions.length
  }

  function calculateImpressions( data ) {
    const impressions = data.map( row => parseInt( row.impressions, 10 ) )
    return impressions.reduce( ( a, b ) => a + b )
  }

  function calculateEngagementsAvg( data ) {
    const engagements = data.map( row => parseInt( row.engagements, 10 ) )
    return engagements.reduce( ( a, b ) => a + b ) / engagements.length  
  }

  function calculateEngagements( data ) {
    const engagements = data.map( row => parseInt( row.engagements, 10 ) )
    return engagements.reduce( ( a, b ) => a + b )
  }

  function calculateUniqueVisitorsAvg( data ) {
    const uniqueVisitors = data.map( row => parseInt( row.uniqueVisitors, 10 ) )
    return uniqueVisitors.reduce( ( a, b ) => a + b ) / uniqueVisitors.length  
  }

  function calculateUniqueVisitors( data ) {
    const uniqueVisitors = data.map( row => parseInt( row.uniqueVisitors, 10 ) )
    return uniqueVisitors.reduce( ( a, b ) => a + b )
  }

  function calculatePageViewsAvg( data ) {
    const pageViews = data.map( row => parseInt( row.pageViews, 10 ) )
    return pageViews.reduce( ( a, b ) => a + b ) / pageViews.length  
  }

  function calculatePageViews( data ) {
    const pageViews = data.map( row => parseInt( row.pageViews, 10 ) )
    return pageViews.reduce( ( a, b ) => a + b )
  }

  function calculateTotalDownloadsAvg( data ) {
    const totalDownloads = data.map( row => parseInt( row.totalDownloads, 10 ) )
    return totalDownloads.reduce( ( a, b ) => a + b ) / totalDownloads.length  
  }

  function calculateTotalDownloads( data ) {
    const totalDownloads = data.map( row => parseInt( row.totalDownloads, 10 ) )
    return totalDownloads.reduce( ( a, b ) => a + b )
  }

  function calculateViewsFirst30DaysPerformanceAvg( data ) {
    const totalViews = data.map( row => parseInt( row.totalViews, 10 ) )
    return totalViews.reduce( ( a, b ) => a + b ) / totalViews.length  
  }

  function calculateViewsFirst30DaysPerformance( data ) {
    const totalViews = data.map( row => parseInt( row.totalViews, 10 ) )
    return totalViews.reduce( ( a, b ) => a + b )
  }
</script>

{ #if !currentProgram }
  <Login />
{:else}
  <div id="site-content">
    <Header {handleLogOut}/>

    <IntroContent showingProgram={$user} />

    <section class="table-container">
      <Options
        {dataset}
        filteredData={filteredDataByTab()}
        aggregate={calculateAggregates()}
        average={calculateAverages()}
        bind:yearToShowAverage
        bind:row
        bind:selectedYear
        bind:selectedMonth
        bind:selectedPageType
        bind:selectedTab
        bind:searchText
      />
      <Table
        filteredData={filteredDataByTab()}
        headerNames={currentColNames()}
        {selectedTab}
        bind:row
      />
    </section>
    <About aboutContent={dataset.data.about.data[0]} />
    <Footer />
  </div>
{/if}

<style lang="scss">
  @use '../scss/components/table-container';
</style>
