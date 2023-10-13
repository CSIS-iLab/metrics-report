<script>
  import { onMount } from 'svelte'
  import tooltip from '../js/tooltip'
  import Icon from './Icons.svelte'

  export let filteredData
  export let headerNames
  export let selectedTab
  export let row

  let sortIconContainer
  $: sortClass = 'inactive'

  const sortByColumns = ['activity', 'state', 'authority', 'type of resource']
  const sortByCol = ['Year', 'Month']

  function handleClick(e) {
    let title = undefined
    let currentRow = undefined
    let extraContent = undefined

    if (e.target.parentNode.classList.contains('title')) {
      title = e.target.parentNode
      currentRow = title.nextElementSibling
      extraContent = e.target.parentNode.nextElementSibling
    } else {
      title = e.target.parentNode.parentNode
      currentRow = title.nextElementSibling
      extraContent = e.target.parentNode.parentNode.nextElementSibling
    }

    title.classList.toggle('title--active')
    title.classList.toggle('table__body__cell--border')
    currentRow.classList.toggle('table__body__cell--border')
    // Show/Hide extraContent
    extraContent.classList.toggle('active')
    extraContent.classList.toggle('hide')
    row.isOpen ? (row.isOpen = true) : (row.isOpen = !row.isOpen)
  }

  // const headerNames = filteredNewData.
  // $:console.log(headerNames);
  // $: sortBy = { col: "activity", ascending: true };

  // $: sort = (e, column) => {
  //   column = column.toLowerCase().replace(/\s/g, "_"); // replace spaces using regex with undesrscore
  //   const iconsActive = document.querySelectorAll('.sort-icon--active');
  //   iconsActive.forEach(icon => {
  //     icon.classList.remove('sort-icon--active');
  //   });
  //   if (sortBy.col == column) {
  //     sortBy.ascending = !sortBy.ascending;
  //     sortClass = sortBy.ascending ? 'active' : 'inactive';
  //   } else {
  //     sortClass = 'inactive';
  //     sortBy.col = column;
  //     sortBy.ascending = true;
  //   }

  //   // Modifier to sorting function for ascending or descending
  //   let sortModifier = sortBy.ascending ? 1 : -1;

  //   // Sort by activity title
  //   if (column == "activity") {
  //     return (filteredData = filteredData.sort((a, b) => {
  //       if (a.activity.title < b.activity.title) {
  //         return -1 * sortModifier;
  //       } else if (a.activity.title > b.activity.title) {
  //         return 1 * sortModifier;
  //       } else {
  //         return 0;
  //       }
  //     }));
  //   }

  //   let sort = (a, b) =>
  //     a[column] < b[column]
  //       ? -1 * sortModifier
  //       : a[column] > b[column]
  //       ? 1 * sortModifier
  //       : 0;

  //   filteredData = filteredData.sort(sort);
  // };

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
            <th class="table__cell--header" scope="col">
              <div
                class="table__cell--header__container table__cell--header__container__{name
                  .toLowerCase()
                  .split(' ')
                  .join('-')}"
              >
                <span>{name}</span>
              </div>
            </th>
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
              <td class="table__body__cell table__body__cell--data"
                ><div class="table__body__cell__title-container">
                  <span class="icon-container" />{rows.program}
                </div></td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.totalMentions}</td
              >
              <td class="table__body__cell table__body__cell--data">
                {rows.topTierMentions}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.year}</td
              >
            </tr>
          {:else if selectedTab === 'social_media'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data"
                ><div class="table__body__cell__title-container">
                  <span class="icon-container" />{rows.program}
                </div></td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.numberOfPosts}</td
              >
              <td class="table__body__cell table__body__cell--data">
                {rows.impressions}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.engagements}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.year}</td
              >
            </tr>
          {:else if selectedTab === 'program_sites'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data"
                ><div class="table__body__cell__title-container">
                  <span class="icon-container" />{rows.program}
                </div></td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.website}</td
              >
              <td class="table__body__cell table__body__cell--data">
                {rows.uniqueVisitors}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.pageViews}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.year}</td
              >
            </tr>
          {:else if selectedTab === 'podcasts'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data"
                ><div class="table__body__cell__title-container">
                  <span class="icon-container" />{rows.program}
                </div></td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.podcast}</td
              >
              <td class="table__body__cell table__body__cell--data">
                {rows.totalDownloads}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.year}</td
              >
            </tr>
          {:else if selectedTab === 'videos'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data"
                ><div class="table__body__cell__title-container">
                  <span class="icon-container" />{rows.programTest.join(', ')}
                </div></td
              >
              <td class="table__body__cell table__body__cell--data"
                >
                <div class="link">
                  <a
                    href={rows.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    >{rows.videoTitle}<span class="icon-container"
                      ><Icon name="Icon-open-blank" class="icon" /></span
                    ></a
                  >
                </div>
              </td>
              <td class="table__body__cell table__body__cell--data">
                {rows.totalViews}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.totalWatchTime}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.averagePercentageViewed}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.year}</td
              >
            </tr>
          {:else if selectedTab === 'events'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data"
                ><div class="table__body__cell__title-container">
                  <span class="icon-container" />{rows.program}
                </div></td
              >
              <td class="table__body__cell table__body__cell--data"
                >
                <div class="link">
                  <a
                    href={rows.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    >{rows.videoTitle}<span class="icon-container"
                      ><Icon name="Icon-open-blank" class="icon" /></span
                    ></a
                  >
                </div>
              </td>
              <td class="table__body__cell table__body__cell--data">
                {rows.totalViews}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.totalWatchTime}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.averagePercentageViewed}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.year}</td
              >
            </tr>
          {:else if selectedTab === 'YouTube_shorts'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data"
                ><div class="table__body__cell__title-container">
                  <span class="icon-container" />{rows.program}
                </div></td
              >
              <td class="table__body__cell table__body__cell--data"
                >
                <div class="link">
                  <a
                    href={rows.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    >{rows.videoTitle}<span class="icon-container"
                      ><Icon name="Icon-open-blank" class="icon" /></span
                    ></a
                  >
                </div>
              </td>
              <td class="table__body__cell table__body__cell--data">
                {rows.totalViews}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.totalWatchTime}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.averagePercentageViewed}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.year}</td
              >
            </tr>
          {:else if selectedTab === 'podcasts_(Video)'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data"
                ><div class="table__body__cell__title-container">
                  <span class="icon-container" />{rows.program}
                </div></td
              >
              <td class="table__body__cell table__body__cell--data"
                >
                <div class="link">
                  <a
                    href={rows.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    >{rows.videoTitle}<span class="icon-container"
                      ><Icon name="Icon-open-blank" class="icon" /></span
                    ></a
                  >
                </div>
              </td>
              <td class="table__body__cell table__body__cell--data">
                {rows.totalViews}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.totalWatchTime}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.averagePercentageViewed}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.year}</td
              >
            </tr>
          {:else if selectedTab === 'videos_iLab'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data"
                ><div class="table__body__cell__title-container">
                  <span class="icon-container" />{rows.program}
                </div></td
              >
              <td class="table__body__cell table__body__cell--data"
                >
                <div class="link">
                  <a
                    href={rows.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    >{rows.videoTitle}<span class="icon-container"
                      ><Icon name="Icon-open-blank" class="icon" /></span
                    ></a
                  >
                </div>
              </td>
              <td class="table__body__cell table__body__cell--data">
                {rows.totalViews}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.totalWatchTime}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.averagePercentageViewed}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.year}</td
              >
            </tr>
          {:else if selectedTab === 'publications'}
            <tr class="title table__body__cell--border">
              <td class="table__body__cell table__body__cell--data"
                ><div class="table__body__cell__title-container">
                  <span class="icon-container" />{rows.program}
                </div></td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.page}</td
              >
              <td class="table__body__cell table__body__cell--data">
                {rows.pageType}
              </td>
              <td class="table__body__cell table__body__cell--data"
                >{rows.views}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.eventCount}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.month}</td
              >
              <td class="table__body__cell table__body__cell--data"
                >{rows.year}</td
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
