<script>
  // import { onMount } from "svelte/internal";
  import Prism from "svelte-prism";
  // import "prism-svelte";
  import RangeSlider from "svelte-range-slider-pips";

  export let active = "view";
  export let values;
</script>

<style>
  .example {
    margin: 2em 0;
  }
  .tabs {
    border-bottom: 1px solid transparent;
    padding: 0 1em;
    display: flex;
    align-content: center;
  }
  .tabs.border {
    border-bottom-color: #434d5a;
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
  .slot.active {
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
  @media screen and (min-width: 56em) {
    .example {
      margin: 1em 0 2em;
    }
    .tabs {
      display: none;
    }
    .slot {
      display: block;
    }
    .slider {
      padding: 1em ;
    }
  }
</style>

<section class="example">

  <div class="tabs" class:border={active === 'view'}>
    <div
      class="tab tab-view"
      class:active={active === 'view'}
      on:click={() => {
        active = 'view';
      }}>
      <img
        src="public/images/icons8-search-100.png"
        alt="icon of a magnifying glass, for viewing the output slider" />
    </div>
    <div
      class="tab tab-code"
      class:active={active === 'code'}
      on:click={() => {
        active = 'code';
      }}>
      <img
        src="public/images/icons8-code-100.png"
        alt="icon of a code editor, for viewing the input code" />
    </div>
  </div>

  <div class="slots">

    <div class="slot code" class:active={active === 'code'}>

      <Prism language="svelte">
        <slot name="code">&lt;RangeSlider /&gt;</slot>
      </Prism>

    </div>

    <div class="slot slider" class:active={active === 'view'}>

      <slot name="slider" v={values}>
        <RangeSlider  />
      </slot>

      {#if values}
      <span class="values">values: <code>[{values}]</code></span>
      {/if}

    </div>
  </div>

</section>
