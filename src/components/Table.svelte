<script>
  import { user } from '../store'
  import { onMount } from 'svelte'
  import tooltip from '../js/tooltip'
  import Icon from './Icons.svelte'
  import Icons from './Icons.svelte'

  export let filteredData
  export let monthOrder
  export let headerNames
  export let selectedTab
  export let row

  let sortIconContainer
  // let sortByColumns = []
  $: sortClass = 'inactive'

  // const sortByColumns = ['activity', 'state', 'authority', 'type of resource']
  const sortByColumns = [
    'month',
    'title',
    'publication type',
    'views',
    'video title',
    'total watch time (minutes)',
    'average percentage viewed (%)',
    'podcast',
    'total listens',
    'number of posts',
    'impressions',
    'engagements',
    'total mentions',
    'top tier mentions'
  ]

  // // Define the monthOrder mapping
  // const monthOrder = {
  //   january: 1,
  //   february: 2,
  //   march: 3,
  //   april: 4,
  //   may: 5,
  //   june: 6,
  //   july: 7,
  //   august: 8,
  //   september: 9,
  //   october: 10,
  //   november: 11,
  //   december: 12,
  // }

  // Your sorting function seems fine, just ensure monthOrder is accessible in this context

  // $: if (selectedTab === 'publications') {
  //   // sortByColumns = ['views', 'engagements']
  //   sortByColumns.push('views')
  // } else {
  //   sortByColumns.length = 0
  // }

  // function handleClick(e) {
  //   let title = undefined
  //   let currentRow = undefined
  //   let extraContent = undefined

  //   if (e.target.parentNode.classList.contains('title')) {
  //     title = e.target.parentNode
  //     currentRow = title.nextElementSibling
  //     extraContent = e.target.parentNode.nextElementSibling
  //   } else {
  //     title = e.target.parentNode.parentNode
  //     currentRow = title.nextElementSibling
  //     extraContent = e.target.parentNode.parentNode.nextElementSibling
  //   }

  //   title.classList.toggle('title--active')
  //   title.classList.toggle('table__body__cell--border')
  //   currentRow.classList.toggle('table__body__cell--border')
  //   // Show/Hide extraContent
  //   extraContent.classList.toggle('active')
  //   extraContent.classList.toggle('hide')
  //   row.isOpen ? (row.isOpen = true) : (row.isOpen = !row.isOpen)
  // }

  // const headerNames = filteredNewData.
  // $:console.log(headerNames);
  $: sortBy = { col: 'views', ascending: true }

  $: sort = (e, column) => {
    column = column
      .toLowerCase()
      .replace(/%/g, '') //removes percentage symbol %
      .replace(/\(|\)/g, '') //rm parentheses
      .replace(/\s/g, '_') // replace spaces using regex with undesrscore
    column = column.replace(/_$/, '') //rm last underscore in sentence
    const iconsActive = document.querySelectorAll('.sort-icon--active')
    iconsActive.forEach((icon) => {
      icon.classList.remove('sort-icon--active')
    })
    if (sortBy.col == column) {
      sortBy.ascending = !sortBy.ascending
      sortClass = sortBy.ascending ? 'active' : 'inactive'
    } else {
      sortClass = 'inactive'
      sortBy.col = column
      sortBy.ascending = true
    }

    // Modifier to sorting function for ascending or descending
    let sortModifier = sortBy.ascending ? 1 : -1
    let sort = (a, b) => {
      let valueA = a[column]
      let valueB = b[column]

      // Special handling for 'Months' column
      if (column.toLowerCase() === 'month') {
        valueA = valueA.toLowerCase()
        valueB = valueB.toLowerCase()

        return (monthOrder[valueA] - monthOrder[valueB]) * sortModifier
      }
      // Checking if both values are numbers
      if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
        // Numeric comparison
        return (valueA - valueB) * sortModifier
      } else {
        // String comparison (case-insensitive)
        valueA = valueA.toLowerCase()
        valueB = valueB.toLowerCase()

        if (valueA < valueB) return -1 * sortModifier
        if (valueA > valueB) return 1 * sortModifier
        return 0
      }
    }

    filteredData = filteredData.sort(sort)
    // console.log(filteredData)
  }

  onMount(() => {
    const iconsActive = document.querySelectorAll('.sort-icon--active')
    iconsActive.forEach((icon) => {
      icon.classList.remove('sort-icon--active')
    })
    // const divActivity = document.querySelector('.table__cell--header__container__program');
    // console.log(divActivity);
    // divActivity.children[1].children[1].classList.add('sort-icon--active');
    // Sync horizontal scroll of table header and table body
    // Inspired by https://codepen.io/Goweb/pen/rgrjWx
    const scrollSync = () => {
      const tableHeader = document.querySelector('#table-header')
      const tableBody = document.querySelector('#table-body')

      const bindSyncScrolling = (one, two) => {
        let echo = false
        const sync = (elOne, elTwo) => () =>
          (echo = !echo) &&
          ((elOne.scrollTop = elTwo.scrollTop),
          (elOne.scrollLeft = elTwo.scrollLeft))
        two.onscroll = sync(one, two)
        one.onscroll = sync(two, one)
      }
      bindSyncScrolling(tableHeader, tableBody)
    }
    scrollSync()
  })
</script>

<div class="table__wrapper">
  <div class="table__container table__container--sticky" id="table-header">
    <table class="table">
      <thead>
        <tr class="table__header-row">
          {#each headerNames as name}
            {#if $user !== 'International Security Program' && name === 'Program'}
              <!-- Skip rendering the "Program" column if currentProgram is not "ISP" -->
            {:else}
              <!-- <th
                class="table__cell--header"
                scope="col"
              > -->
              <th
                class="table__cell__header table__cell__header--{name.toLowerCase().split(' ').join('-').replace(/-\([^)]*\)$/, '')}"
                scope="col"
              >
                <div
                  class="table__cell__header__container table__cell__header__container__{name
                    .toLowerCase()
                    .split(' ')
                    .join('-')}"
                  on:click={sortByColumns.includes(name.toLowerCase())
                    ? (e) => sort(e, name)
                    : ''}
                >
                  <span>{name}</span>
                  {#if sortByColumns.includes(name.toLowerCase())}
                    <div
                      class="sort-icons-container"
                      on:click={(e) => sort(e, name)}
                    >
                      <button
                        class="sort-icon sort-icon--{sortBy.col ==
                          name.toLowerCase().split(' ').join('_') &&
                        sortBy.ascending
                          ? 'inactive'
                          : 'active'}">▲</button
                      >
                      <button
                        class="sort-icon sort-icon--{sortBy.col ==
                          name.toLowerCase().split(' ').join('_') &&
                        sortBy.ascending
                          ? 'active'
                          : 'inactive'}">▼</button
                      >
                    </div>
                  {/if}
                </div>
              </th>
            {/if}
          {/each}
        </tr>
      </thead>
    </table>
  </div>
  <div class="table__container" id="table-body">
    <table class="table table__body">
      <tbody>
        {#each filteredData as rows}
          {#if selectedTab === 'press'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data table__body__cell--month"
                >{rows.month}</td
              >
              {#if $user === 'International Security Program'}
                <td class="table__body__cell table__body__cell--data table__body__cell--program"
                  >{rows.program}</td
                >
              {/if}
              <td class="table__body__cell table__body__cell--data table__body__cell--total-mentions"
                >{parseInt(rows.total_mentions).toLocaleString('en-US')}</td
              >
              <td class="table__body__cell table__body__cell--data table__body__cell--top-tier-mentions">
                {parseInt(rows.top_tier_mentions).toLocaleString('en-US')}
              </td>
            </tr>
          {:else if selectedTab === 'social_media'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data table__body__cell--month"
                >{rows.month}</td
              >
              {#if $user === 'International Security Program'}
                <td class="table__body__cell table__body__cell--data table__body__cell--program"
                  >{rows.program}</td
                >
              {/if}
              <td class="table__body__cell table__body__cell--data table__body__cell--number-of-posts"
                >{parseInt(rows.number_of_posts, 10).toLocaleString('en-US')}</td
              >
              <td class="table__body__cell table__body__cell--data table__body__cell--impressions">
                {parseInt(rows.impressions, 10).toLocaleString('en-US')}
              </td>
              <td class="table__body__cell table__body__cell--data table__body__cell--engagements"
                >{parseInt(rows.engagements, 10).toLocaleString('en-US')}</td
              >
            </tr>
          {:else if selectedTab === 'program_sites'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              {#if $user === 'International Security Program'}
                <td class="table__body__cell table__body__cell--ISP"
                  >{rows.program}</td
                >
              {/if}
              <td class="table__body__cell table__body__cell--data"
                >{rows.website}</td
              >
              <td class="table__body__cell table__body__cell--data">
                {rows.uniqueVisitors}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.pageViews}</td
              >
            </tr>
          {:else if selectedTab === 'podcasts'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data table__body__cell--month"
                >{rows.month}</td
              >
              {#if $user === 'International Security Program'}
                <td class="table__body__cell table__body__cell--data table__body__cell--program"
                  >{rows.program}</td
                >
              {/if}
              <td class="table__body__cell table__body__cell--data table__body__cell--podcast"
                >{rows.podcast}</td
              >
              <td class="table__body__cell table__body__cell--data table__body__cell--total-listens">
                {parseInt(rows.total_listens, 10).toLocaleString('en-US')}
              </td>
            </tr>
          {:else if selectedTab === 'videos'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data table__body__cell--month"
                >{rows.month}</td
              >
              {#if $user === 'International Security Program'}
                <td class="table__body__cell table__body__cell--data table__body__cell--program"
                  ><div class="table__body__cell__title-container">
                    {rows.programsVideos.join(
                      ', '
                    )}
                  </div></td
                >
              {/if}
              <td class="table__body__cell table__body__cell--data table__body__cell--video-title">
                <div class="link">
                  <a
                    href={rows.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    >{rows.video_title}<span class="icon-container"
                      ><Icon name="Icon-open-blank" class="icon" /></span
                    ></a
                  >
                </div>
              </td>
              <td class="table__body__cell table__body__cell--data table__body__cell--views">
                {parseInt(rows.views, 10).toLocaleString('en-US')}
              </td>
              <td class="table__body__cell table__body__cell--data table__body__cell--total-watch-time"
                >{parseInt(rows.total_watch_time_minutes, 10).toLocaleString(
                  'en-US'
                )}</td
              >
              <td class="table__body__cell table__body__cell--data table__body__cell--average-percentage-viewed"
                >{rows.average_percentage_viewed}</td
              >
            </tr>
          {:else if selectedTab === 'events'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data table__body__cell--month"
                >{rows.month}</td
              >
              {#if $user === 'International Security Program'}
                <td class="table__body__cell table__body__cell--data table__body__cell--program"
                  ><div class="table__body__cell__title-container">
                    {rows.programsVideos.join(
                      ', '
                    )}
                  </div></td
                >
              {/if}
              <td class="table__body__cell table__body__cell--data table__body__cell--video-title">
                <div class="link">
                  <a
                    href={rows.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    >{rows.video_title}<span class="icon-container"
                      ><Icon name="Icon-open-blank" class="icon" /></span
                    ></a
                  >
                </div>
              </td>
              <td class="table__body__cell table__body__cell--data table__body__cell--views">
                {parseInt(rows.views, 10).toLocaleString('en-US')}
              </td>
              <td class="table__body__cell table__body__cell--data table__body__cell--total-watch-time"
                >{parseInt(rows.total_watch_time_minutes, 10).toLocaleString(
                  'en-US'
                )}</td
              >
              <td class="table__body__cell table__body__cell--data table__body__cell--average-percentage-viewed"
                >{rows.average_percentage_viewed}</td
              >
            </tr>
          {:else if selectedTab === 'YouTube_shorts'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data table__body__cell--month"
                >{rows.month}</td
              >
              {#if $user === 'International Security Program'}
                <td class="table__body__cell table__body__cell--data table__body__cell--program"
                  ><div class="table__body__cell__title-container">
                    {rows.programsVideos.join(
                      ', '
                    )}
                  </div></td
                >
              {/if}
              <td class="table__body__cell table__body__cell--data table__body__cell--video-title">
                <div class="link">
                  <a
                    href={rows.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    >{rows.video_title}<span class="icon-container"
                      ><Icon name="Icon-open-blank" class="icon" /></span
                    ></a
                  >
                </div>
              </td>
              <td class="table__body__cell table__body__cell--data table__body__cell--views">
                {parseInt(rows.views, 10).toLocaleString('en-US')}
              </td>
              <td class="table__body__cell table__body__cell--data table__body__cell--total-watch-time"
                >{parseInt(rows.total_watch_time_minutes, 10).toLocaleString(
                  'en-US'
                )}</td
              >
              <td class="table__body__cell table__body__cell--data table__body__cell--average-percentage-viewed"
                >{rows.average_percentage_viewed}</td
              >
            </tr>
          {:else if selectedTab === 'podcasts_(Video)'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data table__body__cell--month"
                >{rows.month}</td
              >
              {#if $user === 'International Security Program'}
                <td class="table__body__cell table__body__cell--data table__body__cell--program"
                  ><div class="table__body__cell__title-container">
                    {rows.programsVideos.join(
                      ', '
                    )}
                  </div></td
                >
              {/if}
              <td class="table__body__cell table__body__cell--data table__body__cell--video-title">
                <div class="link">
                  <a
                    href={rows.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    >{rows.video_title}<span class="icon-container"
                      ><Icon name="Icon-open-blank" class="icon" /></span
                    ></a
                  >
                </div>
              </td>
              <td class="table__body__cell table__body__cell--data table__body__cell--views">
                {parseInt(rows.views, 10).toLocaleString('en-US')}
              </td>
              <td class="table__body__cell table__body__cell--data table__body__cell--total-watch-time"
                >{parseInt(rows.total_watch_time_minutes, 10).toLocaleString(
                  'en-US'
                )}</td
              >
              <td class="table__body__cell table__body__cell--data table__body__cell--average-percentage-viewed"
                >{rows.average_percentage_viewed}</td
              >
            </tr>
          {:else if selectedTab === 'publications'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data table__body__cell--month"
                >{rows.month}</td
              >
              {#if $user === 'International Security Program'}
                <td class="table__body__cell table__body__cell--data table__body__cell--program"
                  ><div class="table__body__cell__title-container">
                    {rows.programsNames.join(
                      ', '
                    )}
                  </div></td
                >
              {/if}
              <td class="table__body__cell table__body__cell--data table__body__cell--title"
                >
                <div class="link">
                  <a
                    href={rows.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    >{rows.title}<span class="icon-container"
                      ><Icon name="Icon-open-blank" class="icon" /></span
                    ></a
                  >
                </div>  
              </td
              >
              <td class="table__body__cell table__body__cell--data table__body__cell--publication-type">
                {rows.publication_type}
              </td>
              <td class="table__body__cell table__body__cell--data table__body__cell--views"
                >{parseInt(rows.views, 10).toLocaleString('en-US')}</td
              >
            </tr>
          {/if}
        {:else}
          <tr>
            <td class="table__body__cell table__body__cell--no-data" colspan="6"
              ><p class="table__body__cell__no-data__title">0 entries found.</p>
              <p class="table__body__cell__no-data__desc">
                Try changing or removing filters to adjust the results.
              </p>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style lang="scss">
  @use '../scss/abstracts/' as *;
  @use '../scss/components/table';
  :global(.tippy-box[data-theme~='energy']) {
    @extend %text-style-ui-4;
    color: $color-text-gray-500;
    background-color: $color-background-white;
    padding: rem(6) rem(6) rem(8) rem(6);
    filter: drop-shadow(0px 1px 9px rgba(0, 0, 0, 0.06))
      drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
  }

  :global(
      .tippy-box[data-theme~='energy'][data-placement^='top']
        > .tippy-arrow::before,
      .tippy-box[data-theme~='energy'][data-placement^='bottom']
        > .tippy-arrow::before,
      .tippy-box[data-theme~='energy'][data-placement^='left']
        > .tippy-arrow::before,
      .tippy-box[data-theme~='energy'][data-placement^='right']
        > .tippy-arrow::before
    ) {
    border-top-color: $color-background-white;
  }
</style>
