<script>
  import Icon from './Icons.svelte'
  import DevelopmentTeam from './DevelopmentTeam.svelte'

  export let aboutContent
</script>

<section class="about" id="about">
  <div class="about__container">
    <h2 class="about__subtitle">About</h2>
    <div class="about__description">
      <p>{aboutContent.content}</p>
      <p />
      <p>
        This dashboard is a product of the <a
          class="about__link"
          href="https://www.csis.org/programs/dracopoulos-ideas-lab"
          target="_blank"
          rel="noreferrer">Andreas C. Dracopoulos iDeas Lab</a
        >, the in-house digital, multimedia, and design agency at the Center for
        Strategic and International Studies. It was produced by José Romero.
      </p>
    </div>

    <div class="back-top-container">
      <a class="back-top-container__link" href="#top"
        ><span>Back to Top</span><span
          class="back-top-container__icon-container back-top__icon-container"
        >
          <Icon class="icon__back-top" name="Icon-arrow-up" />
        </span>
      </a>
    </div>
  </div>
</section>

<style lang="scss">
  @use '../scss/components/about';
</style>
