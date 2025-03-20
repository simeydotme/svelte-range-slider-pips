<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  let value = 50;
</script>

<div class="slider-list">
  <h5>Slider with two-way binding on single value</h5>
  <RangeSlider bind:value />

  <div class="controls font-mono">
    <div>
      <label for="value-input"
        >Current value:
        {value}</label
      >
      <input type="number" id="value-input" bind:value />
    </div>
  </div>
</div>
