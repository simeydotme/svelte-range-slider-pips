<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<h2>RangeSlider Darkmode Test Page</h2>

<section>
  <h3>Darkmode: false (default)</h3>
  <RangeSlider id="slider-light" darkmode={false} pips all="label" />
</section>

<section>
  <h3>Darkmode: auto (system)</h3>
  <RangeSlider id="slider-auto" darkmode="auto" pips all="label" />
</section>

<section>
  <h3>Darkmode: force</h3>
  <RangeSlider id="slider-dark" darkmode="force" pips all="label" />
</section>
