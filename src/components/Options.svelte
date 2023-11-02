<script>
  import { onMount } from 'svelte'
  import Search from './Search.svelte'
  import Select from 'svelte-select'
  import Icon from './Icons.svelte'

  export let dataset
  export let filteredData
  export let selectedYear
  export let selectedMonth
  export let selectedPageType
  export let selectedTab
  export let searchText = ''
  export let row
  export let average
  export let yearToShowAverage

  $: totalEntries = filteredData.length

  const optionIdentifier = 'value'
  const labelIdentifier = 'label'

  function updateActiveTab(val) {
    const value = val

    const activeTab = document.querySelector(`.options__btn--tab--active`)
    const tabActivate = document.querySelector(
      `.options__btn--tab[data-tab="${value}"]`
    )
    activeTab.classList.remove(
      'options__btn--tab--active',
      'options__btn--tab--Resilience--active',
      'options__btn--tab--Economic-Development--active',
      'options__btn--tab--Emissions-Reduction--active',
      'options__btn--tab--press--active'
    )
    tabActivate.classList.add(
      'options__btn--tab--active',
      `options__btn--tab--${value}--active`
    )
  }

  function removeRowActiveTitleStyle() {
    const title = document.querySelectorAll('.title--active')
    title.forEach((item) => {
      item.classList.remove('title--active')
    })
  }

  function removeExtraContentStyle() {
    const extraContent = document.querySelectorAll('.extra-content')
    extraContent.forEach((content) => {
      if (content.classList.contains('active')) {
        content.classList.remove('active')
        content.classList.add('hide')
      }
    })
  }

  function switchRowBottomLine() {
    const rowTitle = document.querySelectorAll('.title')
    const extraContent = document.querySelectorAll('.extra-content')
    extraContent.forEach((item) => {
      if (item.classList.contains('table__body__cell--border')) {
        item.classList.remove('table__body__cell--border')
      }
    })
    rowTitle.forEach((item) => {
      if (!item.classList.contains('table__body__cell--border')) {
        item.classList.add('table__body__cell--border')
      }
    })
  }

  function handleSelect(event, selectName) {
    if (row.isOpen) {
      row.isOpen = !row.isOpen
      removeRowActiveTitleStyle()
      removeExtraContentStyle()
      switchRowBottomLine()
    }
    if (selectName === 'Year') {
      selectedYear = event.detail.value
    } else if (selectName === 'Month') {
      selectedMonth = event.detail.value
    } else if (selectName === 'Tab') {
      updateActiveTab(event.target.value)
      selectedTab = event.target.value
    } else {
      selectedPageType = event.detail.value
      console.log('else: ', event.detail.value)
    }
  }

  function handleClear(selectName) {
    if (row.isOpen) {
      row.isOpen = !row.isOpen
      removeRowActiveTitleStyle()
      removeExtraContentStyle()
      switchRowBottomLine()
    }
    if (selectName === 'Year') {
      selectedYear = ''
    } else if (selectName === 'Month') {
      selectedMonth = ''
    } else {
      selectedPageType = ''
      console.log('else of handleClear')
    }
  }

  // handle the icon
  const chevronUp =
    '<svg class="iconUp" width="16" height="10" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M28 15 14 0 0 15h28z" fill="#000"/></svg>'
  const chevronDown =
    '<svg class="iconDown" width="16" height="10" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m0 0 14 15L28 0H0z" fill="#000"/></svg>'
  let chevron = chevronDown
  let isListOpen = false
  let listStateOpen = false

  $: chevron = isListOpen ? chevronUp : chevronDown

  function handleScrollLeft() {
    const tableContainer = document.getElementById('table-body')
    const btnIconLeft = document.querySelector('#icon-scroll-left')
    const btnIconRight = document.querySelector('#icon-scroll-right')

    tableContainer.scrollLeft -= 100
    if (btnIconRight.classList.contains('inactive')) {
      btnIconRight.classList.remove('inactive')
    }
    if (tableContainer.scrollLeft === 0) {
      btnIconLeft.classList.add('inactive')
    }
  }

  function handleScrollRight() {
    const tableContainer = document.getElementById('table-body')
    const table = document.getElementsByClassName('table')[0]
    const btnIconLeft = document.querySelector('#icon-scroll-left')
    const btnIconRight = document.querySelector('#icon-scroll-right')
    tableContainer.scrollLeft += 100
    if (btnIconLeft.classList.contains('inactive')) {
      btnIconLeft.classList.remove('inactive')
    }
    if (
      Math.ceil(tableContainer.scrollLeft) + tableContainer.offsetWidth >=
      table.offsetWidth
    ) {
      btnIconRight.classList.add('inactive')
    }
  }

  const toTitleCase = (metric) => {
    return metric
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ')
  }

  onMount(() => {
    isListOpen = false
    const tableContainer = document.getElementById('table-body')
    const table = document.getElementsByClassName('table')[0]
    const btnIconLeft = document.querySelector('#icon-scroll-left')
    const btnIconRight = document.querySelector('#icon-scroll-right')
    tableContainer.addEventListener('scroll', () => {
      const left = tableContainer.scrollLeft
      if (left > 0) {
        btnIconLeft.classList.remove('inactive')
      }
      if (
        Math.ceil(tableContainer.scrollLeft) + tableContainer.offsetWidth + 2 >=
        table.offsetWidth
      ) {
        btnIconRight.classList.add('inactive')
      }
      if (
        Math.ceil(tableContainer.scrollLeft) + tableContainer.offsetWidth + 2 <=
        table.offsetWidth
      ) {
        btnIconRight.classList.remove('inactive')
      }
      if (left === 0) {
        btnIconLeft.classList.add('inactive')
      }
    })
  })
</script>

<section class="table-container__header">
</section>

<section class="options__container">
  <div class="options__header">
    {#each dataset.data.spreadsheetsTabs as metric, index}
      <button
        class="options__btn options__btn--tab options__btn--tab--{metric} {index ==
        0
          ? `options__btn--tab--active options__btn--tab--${metric}--active`
          : ''}"
        data-tab={metric}
        value={metric}
        on:click={(event) => handleSelect(event, 'Tab')}
        >{toTitleCase(metric)}
      </button>
    {/each}
  </div>
</section>
<div class="options__avg">
  {#if average}
    {#if selectedTab === 'press'}
      <p>
        In {yearToShowAverage}, your program’s Average Total Mentions per Month
        = {average.totalMentions}. Your program’s Average Top Tier Mentions per
        Month = {average.topTier}.
      </p>
      <p />
      <p>
        Total Mentions: the number of times your program is cited across online,
        print, TV, and radio news stories
      </p>
      <p>
        Top Tier Mentions: the number of times your program is cited in print
        and online stories by the world’s top news sources (determined by reach,
        AKA audience size)
      </p>
    {:else if selectedTab === 'social_media'}
      <p>
        Please find below data from ER social media accounts. In {yearToShowAverage}, ER posted about your program an average of {average.numberOfPosts} times per month.
        These posts averaged {average.impressions} Impressions per Month, and {average.engagements} Engagements per Month.</p>
      <p>Impressions: the number of times social media content was viewed</p>
      <p>Engagements: the number of times users interacted with the posts</p>
    {:else if selectedTab === 'videos'}
      <p>“Average percentage viewed” measures how much of a video users watch on average. This metric can be used to gauge how well your videos hold a viewer's attention.</p>
    {:else if selectedTab === 'events'}
      <p>The following data is from event video streams on YouTube only. For other event data (registrations, etc.), please contact the Events team.</p>
    {:else if selectedTab === 'publications'}
      <p>Views = total number of views on a publication page from all web traffic sources</p>
      <p>Engagements = number of additional actions taken from a publication page, such as a share, longer-than-average view time, etc.</p>
      <p>Each row in this tab presents the number of views and engagements a publication has received in the associated month. Views and engagements are not cumulative in this dashboard tab.</p>
    {/if}
  {:else}
    {#if selectedTab === 'podcasts_(Video)' || selectedTab === 'events' || selectedTab === 'YouTube_shorts' || selectedTab === 'videos'  || selectedTab === 'videos_iLab'}
      <p>“Average percentage viewed” measures how much of a video users watch on average. This metric can be used to gauge how well your videos hold a viewer's attention.</p>
    {/if}
  {/if}
</div>
<div class="selects">
  <div class="select-container">
    <div class="label">Year</div>
    <Select
      indicatorSvg={chevron}
      showChevron={true}
      bind:listOpen={isListOpen}
      {optionIdentifier}
      {labelIdentifier}
      items={dataset.data.years}
      placeholder="Select Year"
      on:select={(event) => handleSelect(event, 'Year')}
      on:clear={() => handleClear('Year')}
    />
  </div>

  <div class="select-container">
    <div class="label">Month</div>
    <Select
      indicatorSvg={chevron}
      showChevron={true}
      {optionIdentifier}
      {labelIdentifier}
      items={dataset.data.months}
      placeholder="Select Month"
      on:select={(event) => handleSelect(event, 'Month')}
      on:clear={() => handleClear('Month')}
    />
  </div>
  {#if selectedTab === 'publications'}
  <div class="select-container">
    <div class="label">Page Type</div>
    <Select
      indicatorSvg={chevron}
      showChevron={true}
      {optionIdentifier}
      {labelIdentifier}
      items={dataset.data.pageType}
      placeholder="Select Page Type"
      on:select={(event) => handleSelect(event, 'Page Type')}
      on:clear={() => handleClear('Page Type')}
    />
  </div>
  {/if}
</div>
<div class="options options__container options__container--sticky">
  <section class="options__navigation">
    <Search bind:searchText />
    <div class="options__navigation-inner">
      <span class="options__table-total-entries"
        >Showing {totalEntries} {totalEntries > 1 ? 'entries' : 'entry'}</span
      >
      <button
        id="btn-scroll-left"
        class="btn btn--scroll btn--scroll--left inactive"
        aria-label="Scroll table to the left"
        on:click={handleScrollLeft}
        ><Icon
          id="icon-scroll-left"
          name="Icon-left"
          class="icon inactive"
        /></button
      >
      <button
        id="btn-scroll-right"
        class="btn btn--scroll btn--scroll--right"
        aria-label="Scroll table to the right"
        on:click={handleScrollRight}
        ><Icon id="icon-scroll-right" name="Icon-right" class="icon" /></button
      >
    </div>
  </section>
</div>

<style lang="scss">
  @use '../scss/abstracts/' as *;
  @use '../scss/components/table-container';
  @use '../scss/components/button';
  @use '../scss/components/label';
  @use '../scss/components/select';
  @use '../scss/components/options';

  :global(.selectContainer) {
    &:hover {
      --borderRadius: 0;
      --background: #{$color-background-gray-100};
    }
  }

  :global(.selectContainer .item.active) {
    position: relative;
    --itemIsActiveBG: transparent;
    --itemIsActiveColor: $color-text-gray-500;
    --itemHoverBG: $color-background-gray-100;

    &::before {
      content: 'L';
      font-family: arial;
      -ms-transform: scaleX(-1) rotate(-35deg); /* IE 9 */
      -webkit-transform: scaleX(-1) rotate(-35deg); /* Chrome, Safari, Opera */
      transform: scaleX(-1) rotate(-35deg);
      display: inline-block;
      line-height: 1rem;
      color: $color-brand-blue-600;
      text-align: center;
      font-size: 14px;
      position: absolute;
      left: 16px;
      top: 10px;
    }
  }

  :global(.selectContainer) {
    --internalPadding: 0 4px !important;
    --itemFirstBorderRadius: 2px;
  }

  :global(.selectContainer .item) {
    --itemPadding: #{rem(8)} #{rem(40)} #{rem(12)};
    text-overflow: unset !important;
    overflow: unset !important;
    white-space: unset !important;
  }
  :global(.listContainer) {
    --listBorderRadius: rem(2);
    --listZIndex: 15;
    --listMaxHeight: #{rem(450)};
    --height: 1.2;
    min-width: 250px !important;
  }

  :global(.iconDown) {
    pointer-events: none;
    filter: invert(29%) sepia(13%) saturate(765%) hue-rotate(181deg)
      brightness(95%) contrast(89%);

    &:hover,
    &:focus {
      // color brand blue 600
      filter: invert(39%) sepia(72%) saturate(6596%) hue-rotate(200deg)
        brightness(100%) contrast(84%);
    }
  }

  :global(.iconUp) {
    pointer-events: none;
    filter: invert(29%) sepia(13%) saturate(765%) hue-rotate(181deg)
      brightness(95%) contrast(89%);

    &:hover,
    &:focus {
      // color brand blue 600
      filter: invert(39%) sepia(72%) saturate(6596%) hue-rotate(200deg)
        brightness(100%) contrast(84%);
    }
  }

  :global(.clearSelect) {
    width: rem(16);
    height: rem(16);
  }

  :global(.selectContainer > input) {
    --inputPadding: 0 28px 0 4px;
  }

  :global(.indicator) {
    --indicatorRight: 4px;
    top: auto !important;
  }

  :global(.selectedItem) {
    color: $color-brand-blue-600;
  }
  .select-container :global(.selectContainer:hover .indicator) {
    // color brand blue 600
    filter: invert(39%) sepia(72%) saturate(6596%) hue-rotate(200deg)
      brightness(100%) contrast(84%);
  }

  .select-container :global(.selectContainer:focus-within .indicator) {
    // color brand blue 600
    filter: invert(39%) sepia(72%) saturate(6596%) hue-rotate(200deg)
      brightness(100%) contrast(84%);
  }
</style>
