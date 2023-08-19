<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './ColorPicker.css?inline';
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  let color = { h: [122], s: [60], l: [90] };

  $: styles = `
    --hue: ${color.h[0]}deg;
    --saturation: ${color.s[0]}%;
    --lightness: ${color.l[0]}%;
    --color: hsl( var(--hue), var(--saturation), var(--lightness) );
    --range-handle-focus: hsla( var(--hue), 60%, 70%, 1 );
  `;

</script>

<div class="color-ui" style="{styles}">

  <RangeSlider float prefix="h: " suffix="°" bind:values={color.h} max={360} />
  <RangeSlider float prefix="s: " suffix="%" bind:values={color.s} max={100} />
  <RangeSlider float prefix="l: " suffix="%" bind:values={color.l} max={100} />

  {#if styles}
    <div class="color">
      --hue: {color.h[0]}deg;
      --saturation: {color.s[0]}%;
      --lightness: {color.l[0]}%;
    </div>
  {/if}

</div>


<!-- hide -->
{@html renderCss}
<!-- endhide -->