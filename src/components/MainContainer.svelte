<script>
  import Header from "./Header.svelte";
  import IntroContent from "./IntroContent.svelte";
  import Options from "./Options.svelte";
  import Table from "./Table.svelte";
  import About from "./About.svelte";
  import Footer from "./Footer.svelte";

  export let dataset;
  export let newDataset;
  let selectedYear = '';
  let selectedMonth = ''
  let selectedState = "";
  let selectedResourceType = "";
  let selectedAuthority = "";
  let selectedTags = [];
  let selectedPolicyGoal = "";
  let searchText
  $: row = { isOpen: false };

  $: filteredData = () => {
    return dataset.data.filter(
      (row) => {
        const filteredActivity = searchText ? searchText : row.activity.title
        const filteredState = selectedState ? selectedState : row.state
        const filteredResource = selectedResourceType ? selectedResourceType : row.type_of_resource
        const filteredAuthority = selectedAuthority ? selectedAuthority : row.authority
        const filteredTags = selectedTags.length > 0 ? row.tags.some((tag) => selectedTags.includes(tag)) : row.tags
        const filteredPolicyGoal = selectedPolicyGoal ? row.policy_goals.some((policy) => selectedPolicyGoal.includes(policy)) : row.policy_goals

        return (row.activity.title.toLowerCase().includes(filteredActivity.toLowerCase()) ||
          row.state.toLowerCase().includes(filteredActivity.toLowerCase()) || 
          row.type_of_resource.toLowerCase().includes(filteredActivity.toLowerCase()) ||
          row.authority.toLowerCase().includes(filteredActivity.toLowerCase())) &&
          row.state === filteredState &&
          row.type_of_resource === filteredResource &&
          row.authority === filteredAuthority &&
          filteredPolicyGoal &&
          filteredTags
      }
    ).sort(( a, b ) => {
      if (a.activity.title < b.activity.title) {
        return -1;
      } else if (a.activity.title > b.activity.title) {
        return 1;
      } else {
        return 0;
      }
    })
  }

  $:filteredNewData = () => {
    return newDataset.data.filtered.filter( row => {
      // console.log(row);
      // new Date().getFullYear()  // returns the current year
      const filteredYear = selectedYear ? selectedYear : '2022'
      const filteredMonth = selectedMonth ? selectedMonth : row.month

      return (
        row.year === filteredYear &&
        row.month === filteredMonth
      )
    })
  }

  $: console.log('current filteredNewData: ', filteredNewData())
</script>

<div id="site-content">
  <Header />

  <IntroContent filteredData={filteredData()} showingProgram={newDataset.data.showingProgram}/>

  <section class="table-container">
      <Options
        {dataset}
        {newDataset}
        filteredData={filteredData()}
        filteredNewData={filteredNewData()}
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
    <Table filteredData={filteredData()} filteredNewData={filteredNewData()} headerNames={newDataset.data.columnNames}  bind:row />
  </section>
  <About />
  <Footer />
</div>
    
<style lang="scss">
  @use "../scss/components/table-container";
</style>
