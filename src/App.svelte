<script>
  import RangeSlider from "svelte-range-slider-pips";
  import Example from "./Components/Example.svelte";
</script>

<style>
  main {
    max-width: 80em;
    margin: auto;
    padding: 1rem;
  }
  .soon {
    margin: 8em auto;
    text-align: center;
  }
  .soon img {
    display: inline-block;
  }
  .credit {
    display: block;
    text-align: right;
  }
</style>

<main>

  <h1>Svelte Range Slider & Pips</h1>
  <p>Find a long list of possible options and examples below</p>

  <h2>Default Example</h2>
  
  <Example />
  
  <h2>Example with Pips</h2>

  <Example>
    <div slot="code">{"<RangeSlider pips />"}</div>
    <div slot="slider"><RangeSlider pips /></div>
  </Example>

  <div class="soon">
    <img
      src="public/images/icons8-under-construction-100.png"
      alt="icon of a magnifying glass, for viewing the output slider" />
    <p>More coming soon</p>
  </div>

  <small class="credit">
    <a target="_blank" href="https://icons8.com/icons/set/search">Search</a>, <a target="_blank" href="https://icons8.com/icons/set/code">Code</a> and other icons by <a target="_blank" href="https://icons8.com">Icons8</a>
  </small>

</main>
