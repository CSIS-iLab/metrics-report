<script>
  import Header from './Header.svelte'
  import IntroContent from './IntroContent.svelte'
  import Options from './Options.svelte'
  import Table from './Table.svelte'
  import About from './About.svelte'
  import Footer from './Footer.svelte'
  // import Login from './Login.svelte'

  export let dataset
  // export let dataset;
  let selectedYear = ''
  let selectedMonth = ''
  let selectedState = ''
  let selectedResourceType = ''
  let selectedAuthority = ''
  let selectedTags = []
  let selectedPolicyGoal = ''
  let searchText
  $: row = { isOpen: false }

  $: filteredData = () => {
    return dataset.data.filtered.filter((row) => {
      // console.log(row);
      // new Date().getFullYear()  // returns the current year
      const filteredYear = selectedYear ? selectedYear : row.year
      const filteredMonth = selectedMonth ? selectedMonth : row.month

      return row.year === filteredYear && row.month === filteredMonth
    })
  }

  $: console.log('current filteredData: ', filteredData())
  $: console.log(dataset.data.showingProgram)
</script>

{#if dataset.data.showingProgram !==  null}
<div id="site-content">
  <Header />

  <IntroContent showingProgram={dataset.data.showingProgram} />

  <section class="table-container">
    <Options
      {dataset}
      filteredData={filteredData()}
      bind:row
      bind:selectedYear
      bind:selectedMonth
      bind:selectedAuthority
      bind:selectedResourceType
      bind:selectedState
      bind:selectedTags
      bind:selectedPolicyGoal
      bind:searchText
    />
    <Table
      filteredData={filteredData()}
      headerNames={dataset.data.columnNames}
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
