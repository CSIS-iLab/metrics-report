<script>
  import { login, user, contrasena } from '../store'
  import Login from './Login.svelte'
  import Header from './Header.svelte'
  import IntroContent from './IntroContent.svelte'
  import Options from './Options.svelte'
  import Table from './Table.svelte'
  import About from './About.svelte'
  import Footer from './Footer.svelte'
  import { onMount } from 'svelte'

  export let dataset

  let selectedYear = ''
  let selectedMonth = ''
  let filterByTab = []
  // $: selectedTab = 'press'
  let selectedTab = 'press'

  let searchText
  $: row = { isOpen: false }
  // $: currentTab = 'press'

  $: currentColNames = () => {
    return dataset.data.tabs.filter( row => row.tab === selectedTab)[0].dataColNames
  }
  $: filteredData = () => {
    return dataset.data.filtered.filter((row) => {
      // console.log(row);
      // new Date().getFullYear()  // returns the current year
      const filteredYear = selectedYear ? selectedYear : row.year
      const filteredMonth = selectedMonth ? selectedMonth : row.month
      const filteredByProgram = $user ? $user : row.program

      return row.year === filteredYear && row.month === filteredMonth && row.program === filteredByProgram
    })
  }

  // Testing new filtering data by current tab. this will output only in the console
  $: filteredDataByTab = () => {
    // console.log(dataset.data.tabs)
    // filterByTab = dataset.data.tabs.filter( row => row.tab === selectedTab)[0]
    // console.log(filterByTab)
    
    let filteredByProgram
    return dataset.data.tabs.filter( row => row.tab === selectedTab )[0]
    .dataForm.filter( row => {
      const filteredYear = selectedYear ? selectedYear : row.year
      const filteredMonth = selectedMonth ? selectedMonth : row.month
      if (typeof row.program === 'string') {
        filteredByProgram = $user ? $user : row.program
      // return row.year === filteredYear && row.month === filteredMonth && row.program === filteredByProgram


      } else {
        console.log(row.program)
        // filteredByProgram = $user ? row.program.filter( p => p === $user)[0] : row.program
        filteredByProgram = row.program.includes($user) ? $user : row.program
      // return row.year === filteredYear && row.month === filteredMonth && row.program === filteredByProgram[0]

      }
      console.log('row program ', row.program)
      console.log('filtered by program ', filteredByProgram)
      return row.year === filteredYear && row.month === filteredMonth && row.program === filteredByProgram
    })
  }

  $: currentProgram = $login
  // $: console.log('current filteredData: ', filteredData())
  // $: console.log(dataset.data.showingProgram)
  // $: console.log(selectedTab)
  // $: console.log(filteredDataByTab())
  onMount( async () => {
    // console.log('is mounted')
  })

  // function handleLogOut() {
  //     $login = false
  //     $user = ''
  //     currentProgram = ''
  //     handleClear()
  // }
  const handleLogOut = () => {
    $login = false
    $user = ''
    $contrasena = ''
    currentProgram = ''
    // handleClear() 
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
