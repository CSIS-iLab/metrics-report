<script>
  import { onMount } from 'svelte'
  import { user } from '../store'

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
  export let aggregate
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
      // console.log('else: ', event.detail.value)
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
      // console.log('else of handleClear')
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

<section class="table-container__header"></section>

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
      {#if $user === 'International Security Program'}
        <p>
          <strong
            >Please find below data on your program’s media citations.
          </strong><em
            >Note: Press metrics for line item "International Security Program"
            represent only those mentions that do not also include the name of a
            specific sub-program/project or expert. This category is intended to
            capture all additional mentions of ISP in the media.</em
          >
        </p>
        <p>
          <strong>CUMULATIVE (YEAR TO DATE):</strong> In {yearToShowAverage},
          ISP and ISP sub-programs/projects' Total Mentions = {aggregate.totalMentions.toLocaleString(
            'en-US'
          )}. ISP and ISP sub-programs/projects' Top Tier Mentions = {aggregate.topTier.toLocaleString(
            'en-US'
          )}.
        </p>
        <p><strong>KEY</strong></p>
        <p>
          Total Mentions: the number of times your program and experts were
          cited across online, print, TV, and radio news stories
        </p>
        <p>
          Top Tier Mentions: the number of times your program and experts were
          cited in print and online stories by the world’s top news sources
          (“top sources” are those in the 10% of news sources by reach, AKA
          audience size)
        </p>
      {:else}
        <p>
          <strong
            >Please find below data on your program’s media citations.</strong
          >
        </p>
        <p>
          <strong>CUMULATIVE (YEAR TO DATE):</strong> In {yearToShowAverage},
          your program’s Total Mentions = {aggregate.totalMentions.toLocaleString(
            'en-US'
          )}. Your program’s Top Tier Mentions = {aggregate.topTier.toLocaleString(
            'en-US'
          )}.
        </p>
        <p>
          <strong>AVERAGE (YEAR TO DATE):</strong> In {yearToShowAverage}, your
          program’s Average Total Mentions per Month = {average.totalMentions.toLocaleString(
            'en-US'
          )}. Your program’s Average Top Tier Mentions per Month = {average.topTier.toLocaleString(
            'en-US'
          )}.
        </p>
        <p><strong>KEY</strong></p>
        <p>
          Total Mentions: the number of times your program and experts were
          cited across online, print, TV, and radio news stories
        </p>
        <p>
          Top Tier Mentions: the number of times your program and experts were
          cited in print and online stories by the world’s top news sources
          (“top sources” are those in the 10% of news sources by reach, AKA
          audience size)
        </p>
      {/if}
    {:else if selectedTab === 'social_media'}
      {#if $user === 'International Security Program'}
        <p>
          <strong
            >Please find below data from main CSIS social media accounts. <em
              >Note: Data from individual program accounts is not included on
              this dashboard. Please also note: Social media metrics for line
              item "International Security Program" represent only ISP general
              content (i.e., does not include content also tagged to a specific
              sub-program/project).</em
            ></strong
          >
        </p>
        <p>
          <strong>CUMULATIVE (YEAR TO DATE):</strong> In {yearToShowAverage},
          CSIS’s main social media accounts posted about ISP and ISP
          sub-programs/projects {aggregate.numberOfPosts.toLocaleString(
            'en-US'
          )} times, and these posts received a total of {aggregate.impressions.toLocaleString(
            'en-US'
          )} Impressions and {aggregate.engagements.toLocaleString('en-US')} Engagements.
        </p>
        <p><strong>KEY</strong></p>
        <p>Impressions: the number of times social media content was viewed</p>
        <p>
          Engagements: the number of times users interacted with the posts
          through likes, comments, shares, or clicks
        </p>
      {:else}
        <p>
          <strong
            >Please find below data from main CSIS social media accounts. <em
              >Please note: Data from individual program accounts is not
              included on this dashboard.</em
            ></strong
          >
        </p>
        <p>
          <strong>CUMULATIVE (YEAR TO DATE):</strong> In {yearToShowAverage},
          CSIS’s main social media accounts posted about your program {aggregate.numberOfPosts.toLocaleString(
            'en-US'
          )}
          times, and these posts received a total of {aggregate.impressions.toLocaleString(
            'en-US'
          )} Impressions and {aggregate.engagements.toLocaleString('en-US')} Engagements.
        </p>
        <p>
          <strong>AVERAGE (YEAR TO DATE):</strong> In {yearToShowAverage},
          CSIS’s main social media accounts posted about your program an average
          of {average.numberOfPosts.toLocaleString('en-US')} times per month. These
          posts averaged {average.impressions.toLocaleString('en-US')}
          Impressions per Month, and {average.engagements.toLocaleString(
            'en-US'
          )} Engagements per Month.
        </p>
        <p><strong>KEY</strong></p>
        <p>Impressions: the number of times social media content was viewed</p>
        <p>
          Engagements: the number of times users interacted with the posts
          through likes, comments, shares, or clicks
        </p>
      {/if}
      <p>
        <em
          >Note: Impressions and engagements in a selected month include
          impressions and engagements for social media posts published on any
          date, not just those published within that month (i.e., months with
          zero new posts may still include impressions and engagements from old
          posts).</em
        >
      </p>
      <!-- {:else if selectedTab === 'videos'}
      <p>
        <strong
          >Please find below data on iLab videos produced with your program,
          including What’s Happening, Testify, and other short videos.</strong
        >
      </p>
      <p>
        <em
          >Note: "Views," "Total Watch Time," and "Average Percent Viewed"
          reflect performance only in the month the video was posted. Videos
          posted later in the month will show fewer "Views," "Total Watch Time,"
          and "Average Percent Viewed." Please click through linked video titles
          to see up-to-date view counts on YouTube.</em
        >
      </p>
    {:else if selectedTab === 'events'}
      <p>
        <strong
          >Please find below data on your program’s public events (note: this
          tab only includes events that have been posted to YouTube).</strong
        >
      </p>
      <p>
        <em
          >Note: "Views," "Total Watch Time," and "Average Percent Viewed"
          reflect performance only in the month the event video was posted.
          Event videos posted later in the month will show fewer "Views," "Total
          Watch Time," and "Average Percent Viewed." Please click through linked
          event video titles to see up-to-date view counts on YouTube.</em
        >
      </p> -->
      <!-- {:else if selectedTab === 'podcasts'}
      <p>
        Please find below data on your program’s CSIS podcast(s), if applicable.
      </p> -->
    {/if}
  {:else if selectedTab === 'podcasts'}
    <p>
      <strong
        >Please find below data on your program’s CSIS podcast(s), if
        applicable.</strong
      >
    </p>
    <p>
      <em
        >Note: This tab includes listens in the selected month for all episodes
        of the associated podcast, not just those released within the selected
        month.</em
      >
    </p>
  {:else if selectedTab === 'podcasts_(Video)'}
    <p>
      <strong
        >Please find below data on your program’s CSIS podcast(s) that have been
        posted to YouTube as videos, if applicable.</strong
      >
    </p>
    <p>
      <em
        >Note: "Views," "Total Watch Time," and "Average Percent Viewed" reflect
        performance only in the month the event video was posted. Podcasts
        (video) posted later in the month will show fewer "Views," "Total Watch
        Time," and "Average Percent Viewed." Please click through linked podcast
        (video) titles to see up-to-date view counts on YouTube.</em
      >
    </p>
  {:else if selectedTab === 'videos'}
    <p>
      <strong
        >Please find below data on iLab videos produced with your program,
        including What’s Happening, Testify, and other short videos.</strong
      >
    </p>
    <p>
      <em
        >Note: "Views," "Total Watch Time," and "Average Percent Viewed" reflect
        performance only in the month the video was posted. Videos posted later
        in the month will show fewer "Views," "Total Watch Time," and "Average
        Percent Viewed." Please click through linked video titles to see
        up-to-date view counts on YouTube.</em
      >
    </p>
  {:else if selectedTab === 'YouTube_shorts'}
    <p>
      <strong
        >Please find below data on YouTube Shorts produced with your program,
        including Asked & Answered videos.</strong
      >
    </p>
    <p>
      <em
        >Note: "Views," "Total Watch Time," and "Average Percent Viewed" reflect
        performance only in the month the YouTube Short was posted. YouTube
        Shorts posted later in the month will show fewer "Views," "Total Watch
        Time," and "Average Percent Viewed." Please click through linked YouTube
        Short titles to see up-to-date view counts on YouTube.</em
      >
    </p>
  {:else if selectedTab === 'events'}
    <p>
      <strong
        >Please find below data on your program’s public events (note: this tab
        only includes events that have been posted to YouTube).</strong
      >
    </p>
    <p>
      <em
        >Note: "Views," "Total Watch Time," and "Average Percent Viewed" reflect
        performance only in the month the event video was posted. Event videos
        posted later in the month will show fewer "Views," "Total Watch Time,"
        and "Average Percent Viewed." Please click through linked event video
        titles to see up-to-date view counts on YouTube.</em
      >
    </p>
  {:else if selectedTab === 'publications'}
    <p>
      <strong
        >Please see below data for your program’s CSIS publications (reports,
        briefs, commentaries, and critical questions).</strong
      >
    </p>
    <p>
      Each row in this tab shows the number of views a publication has received
      in the associated month.
    </p>
    <p>
      Data in this tab can be sorted by month, publication type, and number of
      views.
    </p>
    <p>
      <em
        >Notes: This tab includes views received in the selected month for
        publications published on any date, not just those published within the
        selected month. This data is presented on a month-by-month basis, so
        views are not cumulative, and only represent data from the selected
        month.</em
      >
    </p>
  {:else}
    <p>
      <strong
        >Please find below data on your program’s CSIS podcast(s), if
        applicable.</strong
      >
    </p>
  {/if}
</div>
<div class="selects">
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
      <div class="label">Publication Type</div>
      <Select
        indicatorSvg={chevron}
        showChevron={true}
        {optionIdentifier}
        {labelIdentifier}
        items={dataset.data.pageType}
        placeholder="Select Publication Type"
        on:select={(event) => handleSelect(event, 'Publication Type')}
        on:clear={() => handleClear('Publication Type')}
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
