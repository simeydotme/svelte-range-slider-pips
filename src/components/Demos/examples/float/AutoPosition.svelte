<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './AutoPosition.css?inline';

  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */
  let value = 80;

</script>

<div class="container">

  <RangeSlider 
    id="auto-position"
    bind:value 
    float
    handleFormatter={value => `Stays Inside Container @ ${(value * -0.6 - 20).toFixed(1)}%`}
  />

  <p>Move the handle from left-right</p>

  <RangeSlider 
    bind:value 
    float
    handleFormatter={value => `Overflows Container @ ${value}%`}
  />

</div>

<code data-values title="The output slider values">{value}</code>

<!-- hide -->
{@html renderCss}
<!-- endhide -->

<style>
  :global(.container .rangeFloat) {
    opacity: 1;
    translate: -50% -20% 0.01px;
  }
</style>