<script>
  import { onMount } from "svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import MiniSlider from "./MiniSlider.svelte";
  import Demo from "~components/Reusable/Demo.svelte";
  import Info from "~components/Reusable/Info.svelte";
  import ConfiguratorOutput from "./ConfiguratorOutput.svelte";
  import ResetButton from './ResetButton.svelte';

  import handleDefaultCss from "~/components/Configurator/handles/default.css?inline";
  import handleRingCss from "~/components/Configurator/handles/ring.css?inline";
  import handleRectangleCss from "~/components/Configurator/handles/rectangle.css?inline";
  import handleTriangleCss from "~/components/Configurator/handles/triangle.css?inline";
  import trackSizeCss from "~/components/Configurator/track/track-size.css?inline";
  import floatCss from "~/components/Configurator/float/float.css?inline";
  import pipsCss from "~/components/Configurator/pips/pips.css?inline";

  import { handleTypes } from "./options";
  import {
    defaultAesthetics,
    aestheticsStore,
    trackStyle,
    handleStyle,
    floatStyle,
    pipsStyle,
  } from "./aestheticsStore";
  import { settingsStore, outputProps } from "./configStore";

  export let configProps;
  export let configStore;

  let sliderEl;
  const focusSlider = () => {
    sliderEl?.classList?.add("rsFocus");
    sliderEl?.querySelector(".rangeHandle:nth-of-type(1)")?.classList?.add("rsActive");
    sliderEl?.querySelector(".rangeHandle:nth-of-type(2)")?.classList?.add("rsActive");
  };

  $: isRangeSlider = !!$configStore.range;
  $: hasPips = [$configStore.first, $configStore.rest, $configStore.last].some((v) => v !== "false" && v !== false);
  $: hasPipLabels = [$configStore.first, $configStore.rest, $configStore.last].some((v) => v === "label");

  let isAestheticsReset = false;
  aestheticsStore.isConfirmingReset((v) => (isAestheticsReset = v));



  let isMounted = false;
  onMount(() => {
    isMounted = true;
  });
</script>

<Demo name=" " leftAlign>
  <h2 class="configurator-title" id="aesthetics">Aesthetics</h2>

  <p>
    As a way to help you get a feel for customising the slider's appearance; I've create a few differennt handle styles
    you can select, and added most of the individual elements as customisable position/size.
  </p>

  <Info>For <strong>Colors</strong>, move on to the <a href="#colors">next section below aesthetics</a>.</Info>

  <div config-grid  class="block" >
    <h3>Track Style:</h3>
    <ul config-list >
      <li title="The size of the slider track ( in em )">
        <MiniSlider
          store={aestheticsStore}
          key="trackSize"
          name="track size"
          label="Size"
          max={6}
          step={0.1}
          pipstep={15}
        />
      </li>
      <li title="The padding of the slider track ( in em )">
        <MiniSlider
          store={aestheticsStore}
          key="trackPadding"
          name="track padding"
          label="Padding"
          max={3}
          step={0.1}
          pipstep={7.5}
        />
      </li>
      <li title="The radius of the slider track ( in % )">
        <MiniSlider
          store={aestheticsStore}
          key="trackRadius"
          name="track radius"
          label="Radius"
          max={1}
          step={0.05}
          pipstep={5}
          formatter={(v) => (v * 100).toFixed(0)}
          suffix="%"
        />
      </li>
    </ul>

    {#if isRangeSlider}
      <h3>Range Style:</h3>
      <ul config-list >
        <li title="The size of the selected range ( in em )">
          <MiniSlider
            store={aestheticsStore}
            key="rangeSize"
            name="range size"
            label="Size"
            min={0.1}
            max={6}
            step={0.1}
            pipstep={15}
          />
        </li>
        <li title="The padding of the selected range ( in em )">
          <MiniSlider
            store={aestheticsStore}
            key="rangePadding"
            name="range padding"
            label="Padding"
            max={3}
            step={0.1}
            pipstep={7.5}
          />
        </li>
        <li title="The radius of the selected range ( in % )">
          <MiniSlider
            store={aestheticsStore}
            key="rangeRadius"
            name="range radius"
            label="Radius"
            max={1}
            step={0.05}
            pipstep={5}
            formatter={(v) => (v * 100).toFixed(0)}
            suffix="%"
          />
        </li>
      </ul>
    {/if}

    <h3>Handle Style:</h3>
    <ul config-list>
      <li title="The style of the slider handle">
        <select id="handleType" bind:value={$aestheticsStore.handle}>
          {#each handleTypes as h}
            <option value={h.value} title={h.tooltip}>{h.label}</option>
          {/each}
        </select>
      </li>
      <li title="The vertical offset of the handle ( in em )">
        <MiniSlider
          store={aestheticsStore}
          key="handleSize"
          name="handle size"
          label="Size"
          min={0.2}
          max={3}
          step={0.1}
          pipstep={2}
        />
      </li>
    </ul>

    <h3>Handle Offset:</h3>
    <ul config-list>
      {#if isRangeSlider}
        <li title="The horizontal offset of the handle ( in em )">
          <MiniSlider
            store={aestheticsStore}
            key="handleOffset"
            name="handle offset"
            label="Inline"
            min={-3}
            max={3}
            step={0.1}
            pipstep={15}
          />
        </li>
      {/if}
      <li title="The vertical offset of the handle ( in em )">
        <MiniSlider
          store={aestheticsStore}
          key="handleOffsetBlock"
          name="handle block offset"
          label="Block"
          min={-3}
          max={3}
          step={0.1}
          pipstep={15}
        />
      </li>
      {#if ["default", "rectangle", "triangle"].includes($aestheticsStore.handle)}
        <li title="The rotation of the handle ( in deg )">
          <MiniSlider
            store={aestheticsStore}
            key="handleRotate"
            name="handle rotation"
            label="Rotation"
            min={-180}
            max={180}
            step={15}
            pipstep={3}
          />
        </li>
      {/if}
    </ul>

    {#if $configStore.float}
      <h3>Float Style:</h3>
      <ul config-list>
        <li title="The font size of the float label ( in em )">
          <MiniSlider
            store={aestheticsStore}
            key="floatSize"
            name="float size"
            label="Size"
            min={0.2}
            max={2}
            step={0.1}
            pipstep={2}
            on:change={focusSlider}
          />
        </li>
        <li title="The padding of the float label ( in em )">
          <MiniSlider
            store={aestheticsStore}
            key="floatPadding"
            name="float padding"
            label="Padding"
            min={0}
            max={2}
            step={0.1}
            pipstep={7.5}
            on:change={focusSlider}
          />
        </li>
        <li title="The radius of the float label ( in % )">
          <MiniSlider
            store={aestheticsStore}
            key="floatRadius"
            name="float radius"
            label="Radius"
            min={0}
            max={1}
            step={0.05}
            pipstep={5}
            formatter={(v) => (v * 100).toFixed(0)}
            on:change={focusSlider}
            suffix="%"
          />
        </li>
      </ul>
    {/if}

    {#if $configStore.float || (isRangeSlider && $configStore.rangeFloat)}
      <h3>Float Offset:</h3>
      <ul config-list>
        {#if $configStore.float}
          <li title="The vertical offset of the float label ( in % )">
            <MiniSlider
              store={aestheticsStore}
              key="floatOffset"
              name="float offset"
              label="Offset"
              min={-200}
              max={400}
              step={5}
              pipstep={10}
              on:change={focusSlider}
              suffix="%"
            />
          </li>
          <li title="The horizontal offset of the float label ( in em )">
            <MiniSlider
              store={aestheticsStore}
              key="floatOffsetInline"
              name="float inline offset"
              label="Inline"
              min={-6}
              max={6}
              step={0.1}
              pipstep={10}
              on:change={focusSlider}
            />
          </li>
        {/if}

        {#if isRangeSlider}
          <li title="The vertical offset of the range float label ( in % )">
            <MiniSlider
              store={aestheticsStore}
              key="rangeFloatOffset"
              name="range float offset"
              label="Range"
              min={-200}
              max={400}
              step={5}
              pipstep={10}
              on:change={focusSlider}
              suffix="%"
            />
          </li>
        {/if}
      </ul>
    {/if}

    {#if hasPips}
      <h3>Pips:</h3>
      <ul config-list>
        <li title="The position of the selected pip">
          <select id="pipPosition" bind:value={$aestheticsStore.pipPosition}>
            <option value="bottom">Bottom</option>
            <option value="top">Top</option>
          </select>
        </li>
        <li title="The vertical offset of the pips list ( in % )">
          <MiniSlider
            store={aestheticsStore}
            key="pipsOffset"
            name="pips offset"
            label="Offset"
            min={-400}
            max={400}
            step={2.5}
            pipstep={20}
            suffix="%"
          />
        </li>
        <li title="The height of the pips ( in em )">
          <MiniSlider
            store={aestheticsStore}
            key="pipHeight"
            name="pip height"
            label="Height"
            min={0}
            max={5}
            step={0.1}
            pipstep={10}
            suffix=""
            formatter={(v) => v.toFixed(1)}
          />
        </li>
        <li>
          <Info
            >For more complicated control, like <code>skew</code> or <code>width</code> of the pips, you should edit the
            css yourself.</Info
          >
        </li>
      </ul>

      {#if isRangeSlider}
        <h3>In-Range Pips:</h3>
        <ul config-list>
          <li title="The vertical offset of the in-range pip ( in % )">
            <MiniSlider
              store={aestheticsStore}
              key="pipInRangeOffset"
              name="in-range pip offset"
              label="Offset"
              min={-200}
              max={400}
              step={5}
              pipstep={10}
              suffix="%"
            />
          </li>
          <li title="The height of the in-range pip ( in em )">
            <MiniSlider
              store={aestheticsStore}
              key="pipInRangeHeight"
              name="in-range pip height"
              label="Height"
              min={0}
              max={5}
              step={0.1}
              pipstep={10}
              suffix=""
              formatter={(v) => v.toFixed(1)}
            />
          </li>
        </ul>
      {/if}

      <h3>Selected Pips:</h3>
      <ul config-list>
        <li title="The vertical offset of the selected pip ( in % )">
          <MiniSlider
            store={aestheticsStore}
            key="pipSelectedOffset"
            name="selected pip offset"
            label="Offset"
            min={-200}
            max={400}
            step={5}
            pipstep={10}
            suffix="%"
          />
        </li>
        <li title="The height of the selected pip ( in em )">
          <MiniSlider
            store={aestheticsStore}
            key="pipSelectedHeight"
            name="selected pip height"
            label="Height"
            min={0}
            max={5}
            step={0.1}
            pipstep={10}
            suffix=""
            formatter={(v) => v.toFixed(1)}
          />
        </li>
      </ul>

      {#if hasPipLabels}
        <h3>Pip Labels:</h3>
        <ul config-list>
          <li title="The font size of the pip label ( in em )">
            <MiniSlider
              store={aestheticsStore}
              key="pipValSize"
              name="pip label size"
              label="Size"
              min={0.2}
              max={2}
              step={0.1}
              pipstep={2}
              on:change={focusSlider}
            />
          </li>
          <li title="The vertical offset of the pip label ( in % )">
            <MiniSlider
              store={aestheticsStore}
              key="pipValOffset"
              name="pip label offset"
              label="Offset"
              min={-200}
              max={400}
              step={5}
              pipstep={10}
              suffix="%"
            />
          </li>
        </ul>
      {/if}
    {/if}
  </div>
  
  <ResetButton label="Aesthetics" isActive={isAestheticsReset} on:click={() => aestheticsStore.reset()} />

  <div
    class="configurator-range-slider bottom top"
    class:darkmode={$configStore.darkmode === "force"}
  >
    {#if isMounted}
      <RangeSlider
        bind:slider={sliderEl}
        {...configProps}
        class="handle-{$aestheticsStore.handle} track-size float-style pips-{$aestheticsStore.pipPosition} pips-style"
        style={`${$trackStyle} ${$handleStyle} ${$floatStyle} ${$pipsStyle}`}
      />
    {/if}
  </div>

  <Info>Scroll to <a href="#generated-code">the bottom of this page</a> to copy the generated code!</Info>
</Demo>
