<script lang="ts">
  import RangeSlider from "svelte-range-slider-pips";
  import css from "./PipExtreme.css?inline";
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  let value = 30;
  const validValues = [2, 6, 15, 73];

  // valid class to hide the pips for invalid values
  $: isValid = validValues.includes(value);

  // here we create a <style> tag which will be inserted into the page
  // and for each valid value, we will create a css rule to show the pip
  $: style = `
    <style>
      ${validValues.map((v) => `#testSlider .pip[data-val="${v}"] { display: block; }`).join("")}
    </style>  
  `;
</script>

<!-- insert the dynamic css into the page-->
{@html style}

<!-- wrap the slider so we can style it as invalid -->
<div class:invalid={!isValid}>
  <!-- give the slider an ID so we can style it -->
  <RangeSlider id="testSlider" bind:value float pips all="label" hoverable pipstep={1} />
</div>

<code data-values title="The output slider values">{value}</code>

<!-- hide -->
{@html renderCss}
<!-- endhide -->
