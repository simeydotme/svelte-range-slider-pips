
<script>
  import { onMount } from 'svelte'
  import { persisted } from 'svelte-persisted-store';
  import RangeSlider from 'svelte-range-slider-pips';
  import ResetLabel from './ResetLabel.svelte';
  import Demo from '~components/Reusable/Demo.svelte';
  import Info from '~components/Reusable/Info.svelte';
  import ResetButton from './ResetButton.svelte';
  
  import { handleTypes } from './options';
  import {
    aestheticsStore,
    trackStyle,
    handleStyle,
    floatStyle,
    pipsStyle,
  } from "./aestheticsStore";
  import { colorsStore, lightThemeColors, darkThemeColors, presets, selectedPresetStore, colorsPartsStore, overrideOutput } from "./colorsStore";
  import { settingsStore } from "./configStore";

  export let configStore;
  export let configProps;

  let sliderEl;
  let sliderDarkEl;
  let sliderOverrideEl;
  let sliderOverrideDarkEl;
  const focusSlider = (focus = true, slider = sliderEl, sliderDark = sliderDarkEl) => {
    sliderEl.classList.remove('rsFocus');
    sliderDarkEl.classList.remove('rsFocus');
    sliderOverrideEl?.classList.remove('rsFocus');
    sliderOverrideDarkEl?.classList.remove('rsFocus');
    sliderEl?.querySelector('.rangeHandle:nth-of-type(1)')?.classList.remove('rsActive');
    sliderDarkEl?.querySelector('.rangeHandle:nth-of-type(1)')?.classList.remove('rsActive');
    sliderOverrideEl?.querySelector('.rangeHandle:nth-of-type(1)')?.classList.remove('rsActive');
    sliderOverrideDarkEl?.querySelector('.rangeHandle:nth-of-type(1)')?.classList.remove('rsActive');

    if ( focus ) {
      slider?.classList.add('rsFocus');
      slider?.querySelector('.rangeHandle:nth-of-type(1)')?.classList.add('rsActive');
      sliderDark?.classList.add('rsFocus');
      sliderDark?.querySelector('.rangeHandle:nth-of-type(1)')?.classList.add('rsActive');
    }
  }

  let isColorsReset = false;
  let resetTimeout;
  const resetColors = () => {
    clearTimeout(resetTimeout);
    if ( isColorsReset ) {
      updatePreset('Default');
      isColorsReset = false;
    } else {
      resetTimeout = setTimeout(() => {
        isColorsReset = false;
      }, 3000);
      isColorsReset = true;
    }
  }

  let isColorsPartsReset = false;
  colorsPartsStore.isConfirmingReset((v) => (isColorsPartsReset = v));

  const updatePreset = (preset) => {
    selectedPresetStore.set(preset);
    colorsStore.set({...presets[preset]});
  }
  
  $: sliderStyle = `
    ${$trackStyle} 
    ${$handleStyle} 
    ${$floatStyle} 
    ${$pipsStyle}

    ${$lightThemeColors}
    ${$darkThemeColors}
  `;

  $: overrideStyle = overrideOutput($colorsPartsStore);

  $: plural = configProps.values.length > 1 ? "s" : "";

  let isMounted = false;
  onMount(() => {
    isMounted = true;
  });

</script>




<Demo name=' ' leftAlign>
  <h2 class='configurator-title' id='colors'>Colors - Theming</h2>

  <p>To make changing the style of your slider easy, here's a few different preset themes. Additionally, I've
    made it so that you can modify the different theme variables to your liking!
  </p>

  <Info type="warning">For super fine-grained color control, <a href="#colors-parts">you can use the <strong>color variables editor</strong>!</a></Info>

  <div config-grid>

    <h3>Presets</h3>
    <ul config-list>
      {#each Object.keys(presets) as preset}
        <li>
          <input type="radio" name="preset" id={preset} value={preset} checked={$selectedPresetStore === preset} on:change={() => updatePreset(preset)} />
          <label for={preset}>{preset}</label>
        </li>
      {/each}
      <li class="full" style="margin-bottom: 2rem;">
        <Info>Presets are just very simple palette swaps to take the workload off you.</Info>
      </li>
    </ul>

    <h3>Light Theme:</h3>
    <ul config-list>
      <li title="The background color for the slider">
        <input type="color" bind:value={$colorsStore["--slider-light-bg"]} on:focus={() => focusSlider(false)} />
        <ResetLabel store={colorsStore} key="--slider-light-bg" name="Background">
          <code>--slider-light-bg</code>
        </ResetLabel>
      </li>
      <li title="The foreground color for the slider (selected pips)">
        <input type="color" bind:value={$colorsStore["--slider-light-fg"]} on:focus={() => focusSlider(false)} />
        <ResetLabel store={colorsStore} key="--slider-light-fg" name="Foreground">
          <code>--slider-light-fg</code>
        </ResetLabel>
      </li>
      <li title="The base color for the slider (inactive range, handles & floats, unselected pips)">
        <input type="color" bind:value={$colorsStore["--slider-light-base"]} on:focus={() => focusSlider(false)} />
        <ResetLabel store={colorsStore} key="--slider-light-base" name="Base">
          <code>--slider-light-base</code>
        </ResetLabel>
      </li>
      <li title="The lighter base color for the slider (limits, out-of-limit pips)">
        <input type="color" bind:value={$colorsStore["--slider-light-base-100"]} on:focus={() => focusSlider(false)} />
        <ResetLabel store={colorsStore} key="--slider-light-base-100" name="Base 100">
          <code>--slider-light-base-100</code>
        </ResetLabel>
      </li>
      <li title="The accent color for the slider (active range, handles & floats)">
        <input type="color" bind:value={$colorsStore["--slider-light-accent"]} on:focus={focusSlider} />
        <ResetLabel store={colorsStore} key="--slider-light-accent" name="Accent">
          <code>--slider-light-accent</code>
        </ResetLabel>
      </li>
      <li title="The lighter accent color for the slider (hovered handles & range)">
        <input type="color" bind:value={$colorsStore["--slider-light-accent-100"]} on:focus={focusSlider} />
        <ResetLabel store={colorsStore} key="--slider-light-accent-100" name="Accent 100">
          <code>--slider-light-accent-100</code>
        </ResetLabel>
      </li>
      <li title="The text accent color for the slider (floats)">
        <input type="color" bind:value={$colorsStore["--slider-light-accent-text"]} on:focus={focusSlider} />
        <ResetLabel store={colorsStore} key="--slider-light-accent-text" name="Accent Text">
          <code>--slider-light-accent-text</code>
        </ResetLabel>
      </li>
      <li class="full">
        <Info>Here's a <a href="https://coolors.co/d7dada-3f3e4f-99a2a2-b9c2c2-4a40d4-838de7" target="_blank">link to the default palette @ coolors</a>, if you want to edit it!</Info>
      </li>
    </ul>
    
    <h3>Dark Theme:</h3>
    <ul config-list>
      <li title="The background color for the slider">
        <input type="color" bind:value={$colorsStore["--slider-dark-bg"]} on:focus={() => focusSlider(false)} />
        <ResetLabel store={colorsStore} key="--slider-dark-bg" name="Background">
          <code>--slider-dark-bg</code>
        </ResetLabel>
      </li>
      <li title="The foreground color for the slider (selected pips)">
        <input type="color" bind:value={$colorsStore["--slider-dark-fg"]} on:focus={() => focusSlider(false)} />
        <ResetLabel store={colorsStore} key="--slider-dark-fg" name="Foreground">
          <code>--slider-dark-fg</code>
        </ResetLabel>
      </li>
      <li title="The base color for the slider (inactive range, handles & floats, unselected pips)">
        <input type="color" bind:value={$colorsStore["--slider-dark-base"]} on:focus={() => focusSlider(false)} />
        <ResetLabel store={colorsStore} key="--slider-dark-base" name="Base">
          <code>--slider-dark-base</code>
        </ResetLabel>
      </li>
      <li title="The lighter base color for the slider (limits, out-of-limit pips)">
        <input type="color" bind:value={$colorsStore["--slider-dark-base-100"]} on:focus={() => focusSlider(false)} />
        <ResetLabel store={colorsStore} key="--slider-dark-base-100" name="Base 100">
          <code>--slider-dark-base-100</code>
        </ResetLabel>
      </li>
      <li title="The accent color for the slider (active range, handles & floats)">
        <input type="color" bind:value={$colorsStore["--slider-dark-accent"]} on:focus={focusSlider} />
        <ResetLabel store={colorsStore} key="--slider-dark-accent" name="Accent">
          <code>--slider-dark-accent</code>
        </ResetLabel>
      </li>
      <li title="The lighter accent color for the slider (hovered handles & range)">
        <input type="color" bind:value={$colorsStore["--slider-dark-accent-100"]} on:focus={focusSlider} />
        <ResetLabel store={colorsStore} key="--slider-dark-accent-100" name="Accent 100">
          <code>--slider-dark-accent-100</code>
        </ResetLabel>
      </li>
      <li title="The text accent color for the slider (floats)">
        <input type="color" bind:value={$colorsStore["--slider-dark-accent-text"]} on:focus={focusSlider} />
        <ResetLabel store={colorsStore} key="--slider-dark-accent-text" name="Accent Text">
          <code>--slider-dark-accent-text</code>
        </ResetLabel>
      </li>
      <li class="full">
        <Info>And here's the <a href="https://coolors.co/3f3e4f-d7dada-82809f-595868-6070fc-7a7fab" target="_blank">default dark theme palette @ coolors</a>, if you want to edit it!</Info>
      </li>
    </ul>
    
  </div>
  
  <ResetButton label="Colors" isActive={isColorsReset} on:click={resetColors} />

  <div class='configurator-range-slider' 
    style:background-color={$settingsStore.bgColor}>
    {#if isMounted}
      <RangeSlider 
        bind:slider={sliderEl} 
        {...configProps} 
        class="handle-{$aestheticsStore.handle} track-size float-style pips-{$aestheticsStore.pipPosition} pips-style" 
        style={`${sliderStyle}`}
      />
    {/if}
  </div>

  <div class='configurator-range-slider  darkmode bottom' 
    style:background-color={$settingsStore.bgColorDark}>
    {#if isMounted}
      
    <RangeSlider 
      bind:slider={sliderDarkEl} 
      {...configProps} 
      class="handle-{$aestheticsStore.handle} track-size float-style pips-{$aestheticsStore.pipPosition} pips-style" 
      darkmode='force'
      style={`${sliderStyle}`}
    />
    {/if}
  </div>
  <Info>Scroll to <a href="#generated-code">the bottom of this page</a> to copy the generated styles!</Info>
</Demo>



<Demo name=' ' leftAlign>
  <h2 class='configurator-title' id='colors-parts'>Colors - Component Parts</h2>

  <p>If you want to get more granular control over the colors of the slider, you can use the following CSS variables
    to control individual parts of the slider. For absolute control <strong>(such as border colors, shadows, etc)</strong>, 
    you'll need to modify the CSS manually. Check out all <a href="/svelte-range-slider-pips/en/recipes">the different recipes</a> to see what's possible!</p>

  <Info>Because we're directly modifying the component parts, there's no light/dark mode here. You can still
    support <code>darkmode</code> by wrapping the css in a <code>@media (prefers-color-scheme: dark)</code> query. 
    See the <a href="/svelte-range-slider-pips/en/styling/darkmode" target="_blank">darkmode docs</a> for more details.
  </Info>

  <ResetButton label="Colors Parts" isActive={isColorsPartsReset} on:click={() => colorsPartsStore.reset()} />

  <div config-grid>

    <h3>Slider</h3>
    <ul config-list>
      <li title="The default slider background color">
        <input type="color" bind:value={$colorsPartsStore["--range-slider"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-slider" name="Slider">
          <code>--range-slider</code>
        </ResetLabel>
      </li>
    </ul>

    <h3>Handle{plural}</h3>
    <ul config-list>
      <li title="The default inactive handle color">
        <input type="color" bind:value={$colorsPartsStore["--range-handle-inactive"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-handle-inactive" name="Inactive Handle">
          <code>--range-handle-inactive</code>
        </ResetLabel>
      </li>
      <li title="The handle color of an unfocussed handle (while slider is active)">
        <input type="color" bind:value={$colorsPartsStore["--range-handle"]} on:focus={() => focusSlider(true, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-handle" name="Handle">
          <code>--range-handle</code>
        </ResetLabel>
      </li>
      <li title="The handle color of a focussed handle (while slider is active)">
        <input type="color" bind:value={$colorsPartsStore["--range-handle-focus"]} on:focus={() => focusSlider(true, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-handle-focus" name="Focus Handle">
          <code>--range-handle-focus</code>
        </ResetLabel>
      </li>
      <li title="The hover effect of a hovered/pressed handle">
        <input type="color" bind:value={$colorsPartsStore["--range-handle-border"]} on:focus={() => focusSlider(true, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-handle-border" name="Hover Effect">
          <code>--range-handle-border</code>
        </ResetLabel>
      </li>
<li>
      <Info>The colors in the input fields may not match the colours of the slider shown below until edited. This is because
        the slider inherits colors, which is not really feasible to show in the UI.
      </Info></li>

    </ul>

    <h3>Range</h3>
    <ul config-list>
      <li title="The default color of a range (while slider is inactive)">
        <input type="color" bind:value={$colorsPartsStore["--range-range-inactive"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-range-inactive" name="Inactive Range">
          <code>--range-range-inactive</code>
        </ResetLabel>
      </li>
      <li title="The active range color (while slider is active)">
        <input type="color" bind:value={$colorsPartsStore["--range-range"]} on:focus={() => focusSlider(true, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-range" name="Range">
          <code>--range-range</code>
        </ResetLabel>
      </li>
      <li title="Color of the limits bar (if limits are enabled)">
        <input type="color" bind:value={$colorsPartsStore["--range-range-limit"]} on:focus={() => focusSlider(true, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-range-limit" name="Range Limit">
          <code>--range-range-limit</code>
        </ResetLabel>
      </li>
      <li title="The hover effect of a hovered/pressed range">
        <input type="color" bind:value={$colorsPartsStore["--range-range-hover"]} on:focus={() => focusSlider(true, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-range-hover" name="Range Hover">
          <code>--range-range-hover</code>
        </ResetLabel>
      </li>

      <li>
        <Info>Range colours typically inherit the colours from the handle. So if you've edited the handle colours
          above, the input fields may not match the colours of the slider shown below (until edited).
        </Info>
      </li>

    </ul>

    <h3>Float</h3>
    <ul config-list>
      <li title="The background color of an inactive float">
        <input type="color" bind:value={$colorsPartsStore["--range-float-inactive"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-float-inactive" name="Inactive Float">
          <code>--range-float-inactive</code>
        </ResetLabel>
      </li>
      <li title="The default background color of a float (while slider is active)">
        <input type="color" bind:value={$colorsPartsStore["--range-float"]} on:focus={() => focusSlider(true, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-float" name="Float">
          <code>--range-float</code>
        </ResetLabel>
      </li>
      <li title="The text color of a float">
        <input type="color" bind:value={$colorsPartsStore["--range-float-text"]} on:focus={() => focusSlider(true, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-float-text" name="Float Text">
          <code>--range-float-text</code>
        </ResetLabel>
      </li>

      <li>
        <Info>Floats also default to inheriting the handle colours, and so they also may appear different until edited.
        </Info>
      </li>
    </ul>

    <h3>Pips - Regular</h3>
    <ul config-list>
      <li title="The default color of a pip">
        <input type="color" bind:value={$colorsPartsStore["--range-pip"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-pip" name="Pips">
          <code>--range-pip</code>
        </ResetLabel>
      </li>
      <li title="The text color of a regular pip">
        <input type="color" bind:value={$colorsPartsStore["--range-pip-text"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-pip-text" name="Pip Text">
          <code>--range-pip-text</code>
        </ResetLabel>
      </li>
    </ul>

    <h3>Pips - Selected</h3>
    <ul config-list>
      <li title="The default color of a selected pip">
        <input type="color" bind:value={$colorsPartsStore["--range-pip-active"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-pip-active" name="Active Pips">
          <code>--range-pip-active</code>
        </ResetLabel>
      </li>
      <li title="The text color of a selected pip">
        <input type="color" bind:value={$colorsPartsStore["--range-pip-active-text"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-pip-active-text" name="Active Pip Text">
          <code>--range-pip-active-text</code>
        </ResetLabel>
      </li>
    </ul>

    <h3>Pips - In Range</h3>
    <ul config-list>
      <li title="The default color of a pip in range">
        <input type="color" bind:value={$colorsPartsStore["--range-pip-in-range"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-pip-in-range" name="In Range Pips">
          <code>--range-pip-in-range</code>
        </ResetLabel>
      </li>
      <li title="The text color of a pip in range">
        <input type="color" bind:value={$colorsPartsStore["--range-pip-in-range-text"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-pip-in-range-text" name="In Range Pip Text">
          <code>--range-pip-in-range-text</code>
        </ResetLabel>
      </li>
    </ul>

    <h3>Pips - Hovered</h3>
    <ul config-list>
      <li title="The default color of a pip being hovered">
        <input type="color" bind:value={$colorsPartsStore["--range-pip-hover"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-pip-hover" name="Hovered Pips">
          <code>--range-pip-hover</code>
        </ResetLabel>
      </li>
      <li title="The text color of a pip being hovered">
        <input type="color" bind:value={$colorsPartsStore["--range-pip-hover-text"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-pip-hover-text" name="Hovered Pip Text">
          <code>--range-pip-hover-text</code>
        </ResetLabel>
      </li>
    </ul>

    <h3>Pips - Out of Limits</h3>
    <ul config-list>
      <li title="The default color of a pip being out of limits">
        <input type="color" bind:value={$colorsPartsStore["--range-pip-out-of-limit"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-pip-out-of-limit" name="Out of Limits Pips">
          <code>--range-pip-out-of-limit</code>
        </ResetLabel>
      </li>
      <li title="The text color of a pip being out of limits">
        <input type="color" bind:value={$colorsPartsStore["--range-pip-out-of-limit-text"]} on:focus={() => focusSlider(false, sliderOverrideEl, sliderOverrideDarkEl)} />
        <ResetLabel store={colorsPartsStore} key="--range-pip-out-of-limit-text" name="Out of Limits Pip Text">
          <code>--range-pip-out-of-limit-text</code>
        </ResetLabel>
      </li>
    </ul>
  </div>




  <div class='configurator-range-slider' 
    style:background-color={$settingsStore.bgColor}>
    {#if isMounted}
      <RangeSlider 
        bind:slider={sliderOverrideEl} 
        {...configProps} 
        class="handle-{$aestheticsStore.handle} track-size float-style pips-{$aestheticsStore.pipPosition} pips-style" 
        style={`${sliderStyle} ${overrideStyle}`}
      />
    {/if}
  </div>

  <div class='configurator-range-slider  darkmode bottom' 
    style:background-color={$settingsStore.bgColorDark}>
    {#if isMounted}
      
    <RangeSlider 
      bind:slider={sliderOverrideDarkEl} 
      {...configProps} 
      class="handle-{$aestheticsStore.handle} track-size float-style pips-{$aestheticsStore.pipPosition} pips-style" 
      style={`${sliderStyle} ${overrideStyle}`}
    />
    {/if}
  </div>
  <Info>Scroll to <a href="#generated-code">the bottom of this page</a> to copy the generated styles!</Info>
</Demo>