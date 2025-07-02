<script>
  import ResetButton from './ResetButton.svelte';

  import { onMount } from "svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import Icon from '@iconify/svelte';
  import { configStore, settingsStore } from "./configStore";
  import Demo from "~components/Reusable/Demo.svelte";
  import Info from "~components/Reusable/Info.svelte";

  import {
    defaultAesthetics,
    aestheticsStore,
    trackStyle,
    handleStyle,
    floatStyle,
    pipsStyle,
  } from "./aestheticsStore";

  export let configProps;

  let isMounted = false;
  onMount(() => {
    isMounted = true;
  });

  let isSettingsReset = false;
  settingsStore.isConfirmingReset((v) => (isSettingsReset = v));
</script>

<Demo name=" " leftAlign>
  <h2 class="configurator-title" id="light-dark">Light / Dark</h2>

  <p>
    To help with theme / color setup, from here on we will see both light and dark mode sliders, and you can change the
    background colors of the slider container, just to help you get a feel for how the slider will finally look.
  </p>

  <div config-grid>
    <h3>Background Color:</h3>
    <ul config-list title="A background color to help you style the slider according to your website&apos;s theme">
      <li>
        <input type="color" name="bgColor" id="bgColor" bind:value={$settingsStore.bgColor} />
        <input type="text" name="bgColorText" id="bgColorText" class="hex" bind:value={$settingsStore.bgColor} />
        <label for="bgColor" style="margin-right: 2rem;">Light Mode</label>
      </li>
      <li>
        <input type="color" name="bgColorDark" id="bgColorDark" bind:value={$settingsStore.bgColorDark} />
        <input
          type="text"
          name="bgColorDarkText"
          id="bgColorDarkText"
          class="hex"
          bind:value={$settingsStore.bgColorDark}
        />
        <label for="bgColorDark" style="margin-right: 2rem;">Dark Mode</label>
      </li>
      <li>
        <Info type="warning"
          >This background color is purely for demonstration purposes while you are configuring the slider. It is to
          simulate how the slider would look on your website. So you should set these colors to the same values your own
          website uses.</Info
        >
      </li>
    </ul>
  </div>

  <ResetButton label="Demo Theme" isActive={isSettingsReset} on:click={() => settingsStore.reset()} />

  <div class="configurator-range-slider" style:background-color={$settingsStore.bgColor}>
    {#if isMounted}
      <RangeSlider
        {...configProps}
        darkmode={false}
        class="handle-{$aestheticsStore.handle} track-size float-style pips-{$aestheticsStore.pipPosition} pips-style"
        style={`${$trackStyle} ${$handleStyle} ${$floatStyle} ${$pipsStyle}`}
      />
    {/if}
  </div>

  <div class="configurator-range-slider darkmode bottom" style:background-color={$settingsStore.bgColorDark}>
    {#if isMounted}
      <RangeSlider
        {...configProps}
        darkmode="force"
        class="handle-{$aestheticsStore.handle} track-size float-style pips-{$aestheticsStore.pipPosition} pips-style"
        style={`${$trackStyle} ${$handleStyle} ${$floatStyle} ${$pipsStyle}`}
      />
    {/if}
  </div>
</Demo>
