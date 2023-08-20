<script lang="ts">

  import type { MarkdownHeading } from 'astro';
  import { onMount } from 'svelte';
  import { debounce } from 'lodash-es';

  export let headings:MarkdownHeading[] = [];
  type ItemOffsets = {
    id: string
    topOffset: number
  }

  const contentsId: string = 'on-this-page-heading';
  let tableOfContents: HTMLUListElement;
  let itemOffsets: ItemOffsets[] = [];
  let currentId: string = '';

  /**
   * Set the current heading id when a link is clicked
   * @param event MouseEvent
   */
  const setTarget = (event: MouseEvent) => {
    const target = event.target as HTMLAnchorElement;
    const id = target?.getAttribute("href")?.slice(1) || '';
    if (id) {
      currentId = id;
    }
  }

  const observerOptions: IntersectionObserverInit = {
    // Negative top margin accounts for `scroll-margin`.
    // Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
    rootMargin: '-100px 0% -66%',
    threshold: 1
  }    
  
  const setCurrent: IntersectionObserverCallback = (entries) => {
    for (const entry of entries) {
      if ( entry.isIntersecting ) {
        const { id } = entry.target
        if (id === contentsId) continue
        currentId = entry.target.id
        break
      }
    }
  }

  const headingsObserver: IntersectionObserver = new IntersectionObserver(
    setCurrent,
    observerOptions
  );

  const getItemOffsets = debounce(() => {

    const article = document.querySelector('article');
    const titles = article?.querySelectorAll('h1, h2, h3, h4');
    
    if (titles) {
      itemOffsets = Array.from(titles).map((title) => ({
        id: title.id,
        topOffset: title.getBoundingClientRect().top + window.scrollY
      }))
    }

  }, 250 );

  $: if ( tableOfContents ) {
    
    getItemOffsets();

    const article = document.querySelector('article');
    article?.querySelectorAll('h1, h2, h3, h4')
      .forEach((h) => headingsObserver.observe(h));

  }

</script>

<svelte:window on:resize={getItemOffsets} />

<h2 id={contentsId} class="heading">
  On this page
</h2>

<ul bind:this="{tableOfContents}">
  {#each headings as heading}
    <li 
      class="header-link depth-{heading.depth}"
      class:current-header-link="{currentId === heading.slug}"
    >
      <a href="#{heading.slug}" on:click={setTarget}>
        {heading.text}
      </a>
    </li>
  {/each}
</ul>
