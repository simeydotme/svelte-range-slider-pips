<script lang="ts">

  import '~styles/forms.scss'
  import { safeId } from '~lib/safe-id';
  import Icon from '@iconify/svelte';
  import ShortUniqueId from 'short-unique-id';

  export let name: string = '';
  export let label: string = 'Example Svelte Range Slider demonstration';
  export let panel: Panel = 'svelte';

  let displayName: string = '';
  
  if ( !name ) {
    const uid = new ShortUniqueId({ length: 5 });
    name = uid()
  } else {
    displayName = name;
    name = safeId( name );
  }
  
  type Panel = 'svelte' | 'css' | 'vanilla' | 'vue' | 'react';
  const panels: Panel[] = ['svelte', 'css', 'vanilla', 'vue', 'react'];
  const defaultPanel: number = panels.indexOf( panel );
  const iconMap: Record<Panel, string> = {
    svelte: 'svelte',
    css: 'css3',
    vanilla: 'javascript',
    vue: 'vuejs',
    react: 'react',
  };

  let tablist: HTMLDivElement;
  let selected: number = defaultPanel;
  let hasInteracted: boolean = false;
  $: expanded = panels[selected];

  const nextPanel = () => {
    selected = (selected + 1) % panels.length;
    hasInteracted = true;
  };

  const prevPanel = () => {
    selected = (selected - 1 + panels.length) % panels.length;
    hasInteracted = true;
  };

  const handleClick = (index: number) => {
    selected = index;
    hasInteracted = true;
  };

  $: if ( hasInteracted ) {
    document.getElementById( `${ name }-${ panels[ selected ] }-tab` )?.focus();
    console.log( "focus", `${ name }-${ panels[ selected ] }-tab`, document.getElementById( `${ name }-${ panels[ selected ] }-tab` ) )
  }

</script>

<section class="slider-demo {name}">

  {#if $$slots.svelte || $$slots.css || $$slots.vanilla || $$slots.vue || $$slots.react }
    
    <div class="tabs">

      <div role="tablist" aria-label={label} bind:this={tablist}>

        {#each panels as panel, index}
          {#if $$slots[panel]}
            <button
              id="{name}-{panel}-tab"
              role="tab"
              aria-selected="{expanded === panel}"
              aria-expanded="{expanded === panel}"
              aria-controls="{name}-{panel}-panel"
              tabindex="{expanded === panel ? 0 : -1}"
              on:click="{() => handleClick(index)}"
              on:keydown={e => {
                if (e.key === 'ArrowRight') nextPanel();
                if (e.key === 'ArrowLeft') prevPanel();
              }}
            >
              <Icon icon="devicon:{iconMap[panel]}" />
              {panel}
            </button>
          {/if}
        {/each}

      </div>

      <div class="tab-panels">

        {#if $$slots.svelte}
          <div
            id="{name}-svelte-panel"
            role="tabpanel"
            aria-labelledby="svelte-tab"
            aria-hidden="{expanded !== 'svelte'}"
            tabindex="{expanded === 'svelte' ? 0 : -1}"
            hidden="{expanded !== 'svelte'}"
          >
            <slot name="svelte" />
          </div>
        {/if}

        {#if $$slots.css}
          <div
            id="{name}-css-panel"
            role="tabpanel"
            aria-labelledby="css-tab"
            aria-hidden="{expanded !== 'css'}"
            tabindex="{expanded === 'css' ? 0 : -1}"
            hidden="{expanded !== 'css'}"
          >
            <slot name="css" />
          </div>
        {/if}

        {#if $$slots.vanilla}
          <div
            id="{name}-vanilla-panel"
            role="tabpanel"
            aria-labelledby="vanilla-tab"
            aria-hidden="{expanded !== 'vanilla'}"
            tabindex="{expanded === 'vanilla' ? 0 : -1}"
            hidden="{expanded !== 'vanilla'}"
          >
            <slot name="vanilla" />
          </div>
        {/if}

        {#if $$slots.vue}
          <div
            id="{name}-vue-panel"
            role="tabpanel"
            aria-labelledby="vue-tab"
            aria-hidden="{expanded !== 'vue'}"
            tabindex="{expanded === 'vue' ? 0 : -1}"
            hidden="{expanded !== 'vue'}"
          >
            <slot name="vue" />
          </div>
        {/if}

        {#if $$slots.react}
          <div
            id="{name}-react-panel"
            role="tabpanel"
            aria-labelledby="react-tab"
            aria-hidden="{expanded !== 'react'}"
            tabindex="{expanded === 'react' ? 0 : -1}"
            hidden="{expanded !== 'react'}"
          >
            <slot name="react" />
          </div>
        {/if}

      </div>

    </div>

  {/if}

  {#if $$slots.default}
    <form class="slider-container">
      <fieldset>
        <legend>{ displayName || 'Range Slider Demo' }</legend>
        <slot></slot>
      </fieldset>
    </form>
  {/if}

</section>



<style>

  .slider-demo {
    margin-block: 2rem;
  }
  .slider-container {
    text-align: center;
    margin-block: 2rem;
    margin-inline: -1rem;
    border-radius: 0;
    position: relative;
  }
  @media (min-width: 37.75em) {
    .slider-container {
      margin-inline: -.5rem;
      padding: .5rem;
      border-radius: 1rem;
    }
  }
  .slider-container :global( fieldset ) {
    border: none;
  }
  .slider-container :global( legend ) {
    margin-left: -1rem;
  }

  .slider-container :global( .rangeSlider ) {
    margin: 3rem 2rem;
  }

  .slider-container :global( .rangeSlider.pips ) {
    margin: 3rem 2rem 4.5rem;
  }

  .slider-container :global( code[data-values] ) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    border-radius: 1rem;
    padding: .25rem .5rem;
  }

  .tabs {
    border-image: url(/public/frame3.png);
    border-image-slice: 20 14 0 19 fill;
    border-image-width: 20px 14px 0px 19px;
    border-image-outset: 10px 10px 0px 10px;
    border-image-repeat: repeat repeat;

    --padding-block: 1rem;
    --padding-inline: 2rem;
    padding-inline: var(--padding-inline);
    padding-inline-end: calc(var(--padding-inline) * 2);
    margin-inline: calc(var(--padding-inline) * -1);
  }
  
  @media (min-width: 37.75em) {
    .tabs {
      padding: 0;
      margin-left: 0;
      margin-right: 0;
    }
  }

  .tabs [role="tablist"] {

    display: flex;
    gap: .5rem;
    padding-inline: .5rem;
    padding-block-end: .5rem;
    margin-inline: 0;
    list-style: none;
    color: var(--theme-code-text);
    border-bottom: 1px solid hsla(var(--color-base-white), 30%, 1);
    position: relative;
    z-index: 2;

  }

  .tabs [role="tab"] {
    background: transparent;
    color: inherit;
    opacity: .5;
    filter: grayscale(1);
    transition: all 0.33s cubic-bezier(0.85, 0, 0.15, 1);
  }

  .tabs [role="tab"]:hover {
    filter: none;
    opacity: .75;
  }

  .tabs [role="tab"]:focus,
  .tabs [role="tab"]:active ,
  .tabs [role="tab"][aria-selected="true"] {
    filter: none;
    opacity: 1;
    color: hsla( var(--color-simey-dark), 1);
    background: hsla( var(--color-simey), .7);
  }

  .tabs :global( .astro-code ) {
    margin-block: 0;
  }

</style>
