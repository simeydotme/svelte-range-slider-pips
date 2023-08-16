<script lang="ts">

  // TODO: Implement DOCSEARCH, somehow. lol.
  
  import { onMount, writable } from 'svelte';
  import * as docSearchReact from '@docsearch/react';
  import '@docsearch/css';
  import '~styles/search.scss';

  let isOpen = false;
  let initialQuery = '';
  let searchButton;
  const ALGOLIA = import('../../consts');

  const DocSearchModal =
    docSearchReact.DocSearchModal ||
    (docSearchReact as any).default.DocSearchModal;

  const openModal = () => {
    isOpen = true;
  };

  const closeModal = () => {
    isOpen = false;
  };

  const onInput = (e) => {
    isOpen = true;
    initialQuery = e.key;
  };

  onMount(() => {
    document.addEventListener("keydown", (event) => {
      if (!isOpen && event.key === "/") {
        openModal();
      }
    });
  });
</script>

<button
  type="button"
  bind:this={searchButton}
  on:click={openModal}
  class="search-input"
>
  <svg width="24" height="24" fill="none">
    <path
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

  <span>Search</span>

  <span class="search-hint">
    <span class="sr-only">Press </span>

    <kbd>/</kbd>

    <span class="sr-only"> to search</span>
  </span>
</button>

{#if isOpen}
  <svelte:component
    this={DocSearchModal}
    initialQuery={initialQuery}
    initialScrollY={window.scrollY}
    onClose={closeModal}
    indexName={ALGOLIA.indexName}
    appId={ALGOLIA.appId}
    apiKey={ALGOLIA.apiKey}
    transformItems={(items) => {
      return items.map((item) => {
        const a = document.createElement('a')
        a.href = item.url
        const hash = a.hash === '#overview' ? '' : a.hash
        return {
          ...item,
          url: `${a.pathname}${hash}`
        }
      })
    }}
  />
{/if}