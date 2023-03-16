<script>
  import Icon from './Icons.svelte'

  export let showingProgram
</script>

<div class="wrapper">
  <main class="container intro-content">
    <p class="intro-content__overline--small">Metrics Dashboard</p>
    <p class="intro-content__overline--regular">by the Comms teams</p>
    <h1 class="intro-content__title">
      for the {showingProgram}
    </h1>
    <!-- <p class="intro-content__introduction">
      
    </p> -->
  </main>
  <div class="container">
    <!-- <div class="intro-content__graphs ">
      <div class="intro-bar">
        <div class="intro-bar__title">Most Referenced Authorities</div>
        <div class="intro-bar__content">
          <div class="intro-bar__column--labels"> -->
    <!-- iterate and add the most refereced authorities -->
    <!-- {#each mostReferencedAuhorities as authority}
              <div><span>{Object.keys(authority)}</span></div>
            {/each}
          </div>
          <div
            class="intro-bar__column--bars"
            data-total-entries={totalEntries}
          > -->
    <!-- iterate and add the most refereced authorities values -->
    <!-- {#each mostReferencedAuhorities as authority}
              <div class="bar">
                <span
                  style="width: {(Object.values(authority) / totalEntries) *
                    100}%"
                />{Object.values(authority)}
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="intro-bar">
        <div class="intro-bar__title">Top Tags</div>
        <div class="intro-bar__content">
          <div class="intro-bar__column--labels"> -->
    <!-- iterate and add the top tags -->
    <!-- {#each topTags as tag}
              <div><span>{Object.keys(tag)}</span></div>
            {/each}
          </div>
          <div
            class="intro-bar__column--bars"
            data-total-entries={totalEntries}
          > -->
    <!-- iterate and add the top tags values -->
    <!-- {#each topTags as tag}
              <div class="bar">
                <span
                  style="width:  {(Object.values(tag) / totalEntries) * 100}%"
                />{Object.values(tag)}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div> -->
  </div>
</div>

<style lang="scss">
  @use '../scss/components/intro-content';
</style>
