<script>
  import { yearShowing, years, currentYear} from "../store";
  export let handleLogOut

  // const years = [2024,2023]
  // $yearShowing = $currentYear
 // handle the icon
</script>

<header class="header">
  <div class="header__inner">
    <div class="header__inner__left">
      <a
        href="https://www.csis.org"
        alt="CSIS website logo"
        title="Go home"
        aria-label="Go home"
      >
        <span class="header__logo" />
      </a>
      <select
        class="header-select"
        bind:value={ $yearShowing }
        on:change={ () => $yearShowing }
      >
        { #each $years as  year }
          <!-- <option value="{year.toString()}"> -->
          <option value="{year}">
            {year}
          </option>
        {/each}
      </select>
    </div>
    <button on:click={handleLogOut}>Log Out</button>
  </div>
</header>

<style lang="scss">
  @use '../scss/abstracts/' as *;
  @use '../scss/layout/header';

  :global(.header-select) {
    width: 60px;
    z-index: 12;
  }
</style>
