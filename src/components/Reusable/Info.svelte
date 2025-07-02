<script lang="ts">
  import Icon from '@iconify/svelte';

  interface Props {
    type?: 'info' | 'warning';
    className?: string;
  }

  export let type: Props['type'] = 'info';
  export let className: Props['className'] = '';
  export { className as class };
</script>

<p class="note {className}" data-type={type}>
  {#if type === 'info'}
    <Icon icon="fluent:info-24-filled" />
  {:else}
    <Icon icon="fluent:warning-24-filled" />
  {/if}
  <slot />
</p>

<style>
  .note {
    font-style: italic;
    font-size: 0.925rem;
    padding: 0.25rem 0.5rem;
    margin: 1rem -0.5rem 0;
  }

  .note :global(+ .note) {
    margin-top: 0;
  }

  :global(.note :global(svg.iconify)) {
    margin-right: 0.5em;
  }

  .note[data-type="info"] :global(svg.iconify) {
    color: hsla(var(--color-base-simey-dark), 40%, 1);
  }

  .note[data-type="warning"] :global(svg.iconify) {
    color: hsla(var(--color-base-red), 40%, 1);
  }

  :global(.theme-dark .note[data-type="warning"] svg.iconify) {
    color: hsla(var(--color-base-red), 70%, 1);
  }
</style> 