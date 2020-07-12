<script>
	import RangeSlider from "svelte-range-slider-pips";
	console.log(RangeSlider);
</script>

<style>
  main {
    max-width: 64em;
    margin: auto;
    padding: 1rem;
  }
</style>

<main>

  <h1>Svelte Range Slider & Pips</h1>
  <p></p>

	<RangeSlider values={[0]} />

</main>
