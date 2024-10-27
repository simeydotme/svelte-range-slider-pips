<script lang="ts">
  import RangeSlider from "svelte-range-slider-pips";
  import css from "./PipExtreme.css?inline";
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  let value = 30;
  let validValues = [10, 30, 90];

  /** 
   * function to generate a random array of values. In reality
   * you would have more reasonable logic to generate the values
   */
  const randomize = () => {
    const count = 3 + Math.floor(Math.random() * 3);
    const valuesArray = new Array(count).fill(0).map((_, i) => Math.floor(Math.random() * 100));
    return valuesArray;
  };

  const setPipValues = () => (validValues = randomize());

  // valid class to display a red handle if invalid
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

<button type="button" on:click={setPipValues}>Randomize</button>

<code data-values title="The output slider values">{value}</code>

<!-- hide -->
{@html renderCss}
<!-- endhide -->
