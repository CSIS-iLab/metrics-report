<script>
  export let placeholder = "";
  export let label = "";
  export let description = "";
  export let value = "";
  export let type = "text";

  const handleInput = e => {
    // in here, you can switch on type and implement
    // whatever behaviour you need
    value = type.match(/^(number|range)$/)
      ? +e.target.value
      : e.target.value;
  };
</script>

<input
  class="search__input"
  {type}
  {label}
  {placeholder}
  name="search"
  {value}
  on:input={handleInput}
/>

<style lang="scss">
  @use '../scss/components/search';
</style>
