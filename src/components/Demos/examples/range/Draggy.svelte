<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [30,70];

  const echo = (e) => {
    // view your console to see the difference in event 
    // details when dragging the range area
    console.log(e.detail);
  }
</script>

<!-- hide -->
 <div data-grid>
<!-- endhide -->


<span hide>Draggy</span>

<RangeSlider range draggy pips bind:values on:change={echo} />
<span hide>Not Draggy</span>
<RangeSlider range pips bind:values on:change={echo} />

<!-- hide -->
</div>
<strong><em>Try dragging the range between handles.</em></strong>
<!-- endhide -->

<style hide>
  [data-grid] {
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-gap: 10px;
    align-items: center;
    margin: 2rem;
  }
  [data-grid] span {
    display: block;
    justify-self: right;
  }
  [data-grid] span + :global(.rangeSlider) {
    margin: 1rem;
  }
</style>

<code data-values title="The output slider values">{values}</code>