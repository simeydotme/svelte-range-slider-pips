<script lang="ts">
  import { writable } from 'svelte/store';
  import Navigation from '../nav/Navigation.svelte';
  import { clickOutside } from '../nav/clickOutside.ts';
  import feather from 'feather-icons';

  const isNavVisible = writable(false);
</script>

<div
  class="panel"
  class:active={$isNavVisible}
  use:clickOutside={{ enabled: $isNavVisible }}
  on:clickOutside={() => ($isNavVisible = false)}
>
  <Navigation />

  <button on:click={() => ($isNavVisible = !$isNavVisible)}>
    {@html feather.icons.menu.toSvg()}
  </button>
</div>

<slot />

<style>
  :global(.slider-list) {
    display: flex;
    flex-direction: column;
    gap: 4rem;
  }

  .panel {
    --navbg: rgb(210 214 221 / 0.5);

    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 33svw;
    z-index: 1000;
    background-color: var(--navbg);
    translate: -100% 0;
    transition: all 0.5s ease;
    backdrop-filter: blur(6px);
  }

  .panel :global(.test-navigation) {
    background: transparent;
  }

  .panel.active {
    translate: 0 0;
  }

  button {
    position: absolute;
    top: 20px;
    right: 0;
    translate: 100% 0;
    padding: 0;
    margin: 0;
    border-radius: 12px;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    aspect-ratio: 1;
    width: 60px;
    height: 60px;
    display: grid;
    place-content: center;
    background: inherit;
    border: none;
    backdrop-filter: inherit;
  }

  :global(main) {
    width: 1000px;
    margin: 0 auto;
    padding: 100px 0;
  }

  :global(main .rangeSlider) {
    width: 100%;
    padding: 0;
    margin: 0;
  }
</style>
