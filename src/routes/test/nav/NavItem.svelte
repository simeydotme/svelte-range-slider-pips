<script lang="ts">
  import { page } from '$app/stores';
  import feather from 'feather-icons';
  import type { NavItem } from './gen-nav.js';

  export let item: NavItem;
  export let searchTerm: string;
</script>

<li class:active={item.path && $page.url.pathname === item.path}>
  {#if item.path}
    <a href={item.path} class:faded={searchTerm && !item.matched} class:match={item.matched && searchTerm}>
      {#if item.children?.length}
        {@html feather.icons.folder.toSvg()}
      {:else}
        {@html feather.icons.file.toSvg()}
      {/if}
      {item.name}
    </a>
  {:else}
    <span class:faded={searchTerm && !item.matched} class:match={item.matched && searchTerm}>
      {#if item.children?.length}
        {@html feather.icons.folder.toSvg()}
      {:else}
        {@html feather.icons.file.toSvg()}
      {/if}
      {item.name}
    </span>
  {/if}

  {#if item.children}
    <ul>
      {#each item.children as child}
        <svelte:self item={child} {searchTerm} />
      {/each}
    </ul>
  {/if}
</li>
