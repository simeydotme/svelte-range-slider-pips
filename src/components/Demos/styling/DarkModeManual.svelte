<script>
  import { writable } from 'svelte/store';
  import RangeSlider from 'svelte-range-slider-pips';

  // a site-wide theme store (state) in your app 
  let themeStore = writable('light');
  /* hide */
  $: if (document?.body?.parentElement?.classList?.contains('theme-dark')) {
    themeStore.set('dark');
  }
  // a derived state that will be used to set the darkmode prop
  $: darkmode = $themeStore === 'dark' ? 'force' : false;
  /* hide */
  const toggleDarkmode = (e) => {
    const wrapperEl = e.currentTarget.closest('.demo-wrapper');
    const docEl = document.body.parentElement;
    themeStore.update((value) => {
      const isDark = value === 'dark';
      if (isDark) {
        wrapperEl.classList.remove('theme-dark');
        docEl.classList.remove('theme-dark');
        docEl.classList.add('theme-light');
      } else {
        wrapperEl.classList.add('theme-dark');
        docEl.classList.add('theme-dark');
        docEl.classList.remove('theme-light');
      }
      return isDark ? 'light' : 'dark';
    });
  }
  /* endhide */
</script>

<RangeSlider {darkmode} 
  pips first="label" last="label" range='max' valus={50} limits={[25,100]} />

<!-- hide -->
<button type="button" on:click={toggleDarkmode}>
  Toggle Darkmode
</button>
<!-- endhide -->

<code data-values title="The darkmode prop value">themeStore: {$themeStore} , darkmode: {darkmode}</code>