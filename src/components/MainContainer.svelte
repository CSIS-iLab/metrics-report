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
  let filterByTab = []
  let selectedTab = 'press'
  
  $: yearToShowAverage = ''

  $:if (selectedYear !== '') {
    yearToShowAverage = selectedYear
  } else {
    yearToShowAverage = ($currentYear - 1).toString()
  }

  let searchText
  $: row = { isOpen: false }

  $: currentColNames = () => {
    return dataset.data.tabs.filter( row => row.tab === selectedTab)[0].dataColNames
  }

  $: filteredData = () => {
    return dataset.data.filtered.filter((row) => {
      // new Date().getFullYear()  // returns the current year
      const filteredYear = selectedYear ? selectedYear : row.year
      const filteredMonth = selectedMonth ? selectedMonth : row.month
      const filteredByProgram = $user ? $user : row.program

      return row.year === filteredYear && row.month === filteredMonth && row.program === filteredByProgram
    })
  }

  // Testing new filtering data by current tab. this will output only in the console
  $: filteredDataByTab = () => {
    let filteredByProgram
    return dataset.data.tabs.filter( row => row.tab === selectedTab )[0]
    .dataForm.filter( row => {
      const filteredYear = selectedYear ? selectedYear : row.year
      const filteredMonth = selectedMonth ? selectedMonth : row.month
      filteredByProgram = $user ? $user : row.program
      return row.year === filteredYear && row.month === filteredMonth && row.program === filteredByProgram
    })
  }

  $: filteredDataForAvg = () => {
    let filteredByProgram
    return dataset.data.tabs.filter( row => row.tab === selectedTab )[0]
    .dataForm.filter( row => {
      const filteredYear = selectedYear ? selectedYear : row.year
      filteredByProgram = $user ? $user : row.program
      return row.year === filteredYear && row.program === filteredByProgram
    })
  }

  $: calculatePressAverage = () => {
    const dataFilteredByYear = filteredDataForAvg().filter( row => row.year === yearToShowAverage)
    const totalMentionsAvg= calculateTotalMentionsAvg(dataFilteredByYear).toFixed()
    const TopTierMentionsAvg = calculateTopTierMentionsAvg(dataFilteredByYear).toFixed()
    // return 20
    return {
      totalMentions: totalMentionsAvg,
      topTier: TopTierMentionsAvg
    }
  }

  $: currentProgram = $login
  onMount( async () => {
    // console.log('is mounted')
  })

  onDestroy( async () => {
    // selectedTab = 'press'
  })

  const handleLogOut = () => {
    $login = false
    $user = ''
    $contrasena = ''
    currentProgram = ''
    selectedTab = 'press'
  }

  function calculateTotalMentionsAvg(data){
    const totalMentions = data.map( row => parseInt(row.totalMentions, 10) )
    return totalMentions.reduce( ( a, b ) => a + b ) / totalMentions.length
  }

  function calculateTopTierMentionsAvg(data){
    const topTierMentions = data.map( row => parseInt(row.topTierMentions, 10) )
    return topTierMentions.reduce( ( a, b ) => a + b ) / topTierMentions.length
  }
</script>

{ #if !currentProgram }
  <Login />
{:else}
  <div id="site-content">
    <Header {handleLogOut}/>

    <!-- <IntroContent showingProgram={dataset.data.showingProgram} /> -->
    <IntroContent showingProgram={$user} />

    <section class="table-container">
      <Options
        {dataset}
        filteredData={filteredDataByTab()}
        average={calculatePressAverage()}
        bind:yearToShowAverage
        bind:row
        bind:selectedYear
        bind:selectedMonth
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
