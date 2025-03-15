<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import navData from './test-nav.json';
  import NavItem from './NavItem.svelte';
  import feather from 'feather-icons';

  interface NavItem {
    name: string;
    path?: string; // Make path optional
    children?: NavItem[];
    matched?: boolean;
  }

  // Recursively flatten the navigation tree for search
  function flattenNav(items: NavItem[]): NavItem[] {
    return items.reduce((acc: NavItem[], item: NavItem) => {
      acc.push(item);
      if (item.children) {
        acc.push(...flattenNav(item.children));
      }
      return acc;
    }, []);
  }

  const nav = navData;
  const flatNav = flattenNav(nav);
  let searchTerm = '';
  let matchingPaths = new Set<string>();
  let processedNav: (NavItem & { matched?: boolean })[] = [];

  function isMatch(item: NavItem): boolean {
    if (item.path && matchingPaths.has(item.path)) return true;
    return false;
  }

  // Deep clone the nav data and add matched property
  function processNavWithMatches(items: NavItem[], matchPaths: Set<string>): (NavItem & { matched?: boolean })[] {
    return items.map((item) => {
      // Only consider everything matched when there's no search term
      const matched = (searchTerm === '' && matchPaths.size === 0) || isMatch(item);
      const result = { ...item, matched };

      if (item.children) {
        result.children = processNavWithMatches(item.children, matchPaths);
      }

      return result;
    });
  }

  $: {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      // First find all direct matches
      const matches = flatNav.filter(
        (item) => item.name.toLowerCase().includes(term) || item.path?.toLowerCase().includes(term)
      );

      // Then find all parent paths of matching items
      const allMatchPaths = new Set<string>();
      matches.forEach((item) => {
        allMatchPaths.add(item.path || '');
        // Find and add parent paths for this match
        nav.forEach((parent) => {
          if (parent.children?.some((child) => child.path === item.path)) {
            allMatchPaths.add(parent.path || '');
          }
        });
      });

      matchingPaths = allMatchPaths;
    } else {
      matchingPaths = new Set();
    }

    // Process the nav with match information
    processedNav = processNavWithMatches(nav, matchingPaths);
  }
</script>

<div class="test-navigation">
  <div class="search">
    <input type="text" placeholder="Search tests..." bind:value={searchTerm} />
  </div>

  <nav>
    <ul>
      {#each processedNav as item}
        <NavItem {item} {searchTerm} />
      {/each}
    </ul>
  </nav>
</div>

<style>
  .test-navigation {
    padding: 1rem;
    background: var(--navbg, #f5f5f5);
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .search {
    margin-bottom: 1rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
  }

  nav {
    font-size: 14px;
  }

  nav :global(ul) {
    list-style: none;
    padding-left: 1rem;
    margin: 0;
  }

  /* Move the li and a styles to NavItem.svelte */
  nav :global(li) {
    margin: 0 0;
  }

  nav :global(li.active > a) {
    font-weight: bold;
    color: #4a40d4;
  }

  nav :global(a) {
    text-decoration: none;
    color: #333;
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.25rem 0.5rem;
  }

  nav :global(a:hover) {
    text-decoration: underline;
  }

  nav :global(.faded) {
    opacity: 0.5;
  }

  nav :global(.match) {
    background: rgba(74, 64, 212, 0.1);
    border-radius: 5px;
  }

  nav :global(.match) {
    color: #4a40d4;
  }

  nav :global(span) {
    color: #666;
    cursor: default;
    padding: 0.25rem 0.5rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
  }

  nav :global(.feather) {
    height: 16px;
    width: auto;
  }

  nav :global(.feather-folder) {
    position: relative;
    bottom: 2px;
  }
</style>
