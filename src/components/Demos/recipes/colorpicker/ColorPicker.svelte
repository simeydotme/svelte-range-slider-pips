<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './ColorPicker.css?inline';
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  let color = { h: 40, s: 50, l: 90 };

  $: styles = `
    --hue: ${color.h}deg;
    --saturation: ${color.s}%;
    --lightness: ${color.l}%;
    --color: hsl( var(--hue), var(--saturation), var(--lightness) );
    --picker-color: hsla( var(--hue), 60%, 70%, 1 );
  `;

</script>

<div class="color-ui" style="{styles}">

  <RangeSlider id="h" float prefix="h: " suffix="°" bind:value={color.h} max={360} />
  <RangeSlider id="s" float prefix="s: " suffix="%" bind:value={color.s} max={100} />
  <RangeSlider id="l" float prefix="l: " suffix="%" bind:value={color.l} max={100} />

  {#if styles}
    <div class="color">
      --hue: {color.h}deg;
      --saturation: {color.s}%;
      --lightness: {color.l}%;
    </div>
  {/if}

</div>


<!-- hide -->
{@html renderCss}
<!-- endhide -->