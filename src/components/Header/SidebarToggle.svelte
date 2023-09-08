<script>
  let sidebarShown = false
  function toggleSidebar() {
    sidebarShown = !sidebarShown
    if (sidebarShown) {
      document.querySelector('body').classList.add('mobile-sidebar-toggle')
    } else {
      document.querySelector('body').classList.remove('mobile-sidebar-toggle')
    }
  }
</script>

<button
  type="button"
  aria-pressed={sidebarShown ? 'true' : 'false'}
  id="menu-toggle"
  on:click={toggleSidebar}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
  <span class="sr-only">Toggle sidebar</span>
</button>

<style>

  #menu-toggle {
    padding: 1rem;
    margin-right: -1rem;
    background: transparent;
  }
  #menu-toggle svg {
    width: calc( var(--theme-navbar-height) / 2);
    height: 100%;
  }
  
</style>
