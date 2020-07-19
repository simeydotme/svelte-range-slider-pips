<script>
  // import { onMount } from "svelte/internal";
  import Prism from "svelte-prism";
  // import "prism-svelte";
  import RangeSlider from "svelte-range-slider-pips";

  export let active = "code";
  export let code = true;
  export let css = false;
  export let values;

</script>

<style>
  .example + .example,
  p + .example {
    margin: 2em 0 0;
  }
  .tabs {
    padding: 0 1em;
    display: flex;
    align-content: center;
    position: relative;
  }
  .tabs.hide {
    display: none;
  }
  .tabs.border:after {
    content: "";
    position: absolute;
    left: 5px;
    right: 5px;
    bottom: -1px;
    height: 1px;
    background: #434d5a;
  }
  .tab {
    padding: 0.5em 1.5em;
    border-radius: 5px 5px 0 0;
  }
  .tab.active {
    background: #434d5a;
  }
  .tabs img {
    width: 24px;
    display: block;
  }
  .slot {
    display: none;
  }
  .slot.active,
  .slot.slider {
    display: block;
  }
  .slider {
    padding: 2em .5em;
  }
  .values {
    font-size: 0.875em;
    text-align: right;
    display: block;
  }
  .values code {
    color: rgb(255, 0, 76);
  }
  .example :global(pre) {
    margin: 0;
  }
</style>

<section class="example">

  <div class="tabs border" class:hide={ !css }>

    <div
      class="tab tab-code"
      class:active={active === 'code'}
      on:click={() => {
        active = 'code';
      }}>
      <img
        src="public/images/icons8-svelte-100.png"
        alt="icon of the svelte logo, for viewing the input code" />
    </div>

    <div
      class="tab tab-css"
      class:active={active === 'css'}
      on:click={() => {
        active = 'css';
      }}>
      <img
        src="public/images/icons8-css3-100.png"
        alt="icon of the css3 logo, for viewing the css code" />
    </div>

  </div>

  <div class="slots">

    <div class="slot code" class:active={active === 'code'}>

      {#if code}
      <Prism language="svelte">
        <slot name="code"></slot>
      </Prism>
      {/if}

    </div>

    <div class="slot css" class:active={active === 'css'}>

      {#if css}
      <Prism language="css">
        <slot name="css"></slot>
      </Prism>
      {/if}

    </div>

    <div class="slot slider">

      <slot name="slider" v={values}>
        <RangeSlider  />
      </slot>

      {#if values}
      <span class="values">values: <code>[{values}]</code></span>
      {/if}

    </div>

  </div>

</section>
