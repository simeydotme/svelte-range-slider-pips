<script>
  import ConfiguratorOutput from './ConfiguratorOutput.svelte';

  import { onMount } from "svelte";
  import { persisted } from "svelte-persisted-store";
  import RangeSlider from "svelte-range-slider-pips";
  import Demo from "~components/Reusable/Demo.svelte";
  import Info from "~components/Reusable/Info.svelte";
  import "./configurator.css";
  
  import ResetButton from './ResetButton.svelte';
  import Aesthetics from "./Aesthetics.svelte";
  import LightDark from "./LightDark.svelte";
  import Colors from "./Colors.svelte";
  import GeneratedCode from "./GeneratedCode.svelte";
  
  import '~/components/Configurator/handles/default.css';
  import '~/components/Configurator/handles/ring.css';
  import '~/components/Configurator/handles/rectangle.css';
  import '~/components/Configurator/handles/triangle.css';
  import '~/components/Configurator/track/track-size.css';
  import '~/components/Configurator/float/float.css';
  import '~/components/Configurator/pips/pips.css';

  import { rangeTypes, orientationTypes, easingTypes, darkmodeTypes, handleTypes } from "./options";
  import {
    configStore,
    absoluteMin,
    absoluteMax,
  } from "./configStore";

  let handles = 1;
  $: $configStore.range === true ? (handles = 2) : $configStore.range !== false ? (handles = 1) : void 0;
  $: values =
    handles === 1
      ? [($absoluteMax - $absoluteMin) / 2]
      : Array.from(
          { length: handles },
          (_, i) => i * (($absoluteMax - $absoluteMin) / handles) + ($absoluteMax - $configStore.min) / handles / 2
        );

  $: configProps = {
    min: $configStore.min,
    max: $configStore.max,
    step: !$configStore.step || $configStore.step <= 0 ? 1 : $configStore.step,
    values: values.map((v) => parseFloat(v.toFixed($configStore.precision))),
    pips: [$configStore.first, $configStore.rest, $configStore.last].some((v) => v !== "false" && v !== false),
    pipstep: !$configStore.pipstep || $configStore.pipstep <= 0 ? undefined : $configStore.pipstep,
    first: $configStore.first === "false" ? false : $configStore.first,
    rest: $configStore.rest === "false" ? false : $configStore.rest,
    last: $configStore.last === "false" ? false : $configStore.last,
    range: $configStore.range,
    vertical: $configStore.vertical,
    reversed: $configStore.reversed,
    prefix: $configStore.prefix,
    suffix: $configStore.suffix,
    spring: $configStore.spring,
    springValues: easingTypes.find((e) => e.name === $configStore.springValues)?.config,
    float: $configStore.float,
    rangeFloat: $configStore.rangeFloat,
    pushy: $configStore.pushy,
    draggy: $configStore.draggy,
    rangeGapMin: $configStore.rangeGapMin === null ? 0 : $configStore.rangeGapMin,
    rangeGapMax: $configStore.rangeGapMax === null ? Infinity : $configStore.rangeGapMax,
    limits:
      $configStore.limitMin !== null || $configStore.limitMax !== null
        ? [$configStore.limitMin ?? $configStore.min, $configStore.limitMax ?? $configStore.max]
        : null,
    precision: Math.max(($configStore.step ?? 1).toString().split(".")[1]?.length ?? 0, 2),
    darkmode: $configStore.darkmode,
  };
  $: hasPips = [$configStore.first, $configStore.rest, $configStore.last].some((v) => v !== "false" && v !== false);
  $: plural = configProps.values.length > 1 ? "s" : "";

  $: {
    if ( $configStore.range !== true ) {
      $configStore.draggy = false;
      $configStore.pushy = false;
      $configStore.rangeGapMin = null;
      $configStore.rangeGapMax = null;
    }
    if ( !$configStore.spring ) {
      $configStore.springValues = easingTypes[0].name;
    }
  }

  let isConfigReset = false;
  configStore.isConfirmingReset((v) => (isConfigReset = v));

  let isMounted = false;
  onMount(() => {
    isMounted = true;
  });
</script>

<section class="configurator"  class:vertical={$configStore.vertical}>
  <Demo name=" " leftAlign>
    <h2 class="configurator-title" id="basic-functional-setup">Basic Functional Setup</h2>

    <p>For most use cases, the config options here will be sufficient to cover your needs.</p>
    <Info type="info"
      >If you know you need more control than what's available in this simple configurator, skip this step and check out
      the <a href="/svelte-range-slider-pips/en/options">Options page</a> for more information on all the options available.</Info
    >

    <div config-grid>
      
      <h3>Type:</h3>
      <ul config-list>
        {#each rangeTypes as r}
        <li title={r.tooltip}>
          <input type="radio" name="type" id="type-range-{r.value}" value={r.value} bind:group={$configStore.range} />
          <label for="type-range-{r.value}">{r.label}</label>
        </li>
        {/each}
      </ul>

      <h3>Handles:</h3>
      <ul config-list>
        <li
        title="The number of handles to display on the slider (also determines the number of values in the value array)"
        >
        <input
        type="number"
        name="handles"
        id="handles"
        bind:value={handles}
        disabled={$configStore.range !== false}
        max={10}
        min={1}
        step={1}
        placeholder="1"
        />
        <label for="handles"># of Handles</label>
      </li>
    </ul>
    
    <h3>Orientation:</h3>
    <ul config-list>
      <li title="Will make the slider vertically oriented">
        <input type="checkbox" name="vertical" id="vertical" bind:checked={$configStore.vertical} />
        <label for="vertical">Vertical</label>
      </li>
      <li title="Will reverse the direction of the slider&apos;s values">
        <input type="checkbox" name="reversed" id="reversed" bind:checked={$configStore.reversed} />
        <label for="reversed">Reversed</label>
      </li>
    </ul>
    
    <h3>Min/Max:</h3>
    <ul config-list>
      <li title="Min is the minimum value of the slider">
        <input
        type="number"
            name="min"
            id="min"
            bind:value={$configStore.min}
            max={$configStore.max}
            step={$configStore.step}
            placeholder="0"
            class="larger"
          />
          <label for="min">Min</label>
        </li>
        <li title="Max is the maximum value of the slider">
          <input
            type="number"
            name="max"
            id="max"
            bind:value={$configStore.max}
            min={$configStore.min}
            step={$configStore.step}
            placeholder="100"
            class="larger"
          />
          <label for="max">Max</label>
        </li>
      </ul>

      <h3>Pips:</h3>
      <ul config-list>
        <li title="First pip is the pip/label for the first unit on the slider">
          <select name="first-pip" id="first-pip" bind:value={$configStore.first}>
            <option value={false}>None</option>
            <option value="pip">Pip</option>
            <option value="label">Label</option>
          </select>
        </li>
        <li title="Rest pips are the pips/labels for every unit on the slider except the first and last">
          <select name="rest-pips" id="rest-pips" bind:value={$configStore.rest}>
            <option value={false}>None</option>
            <option value="pip">Pip</option>
            <option value="label">Label</option>
          </select>
        </li>
        <li title="Last pip is the pip/label for the last unit on the slider">
          <select name="last-pip" id="last-pip" bind:value={$configStore.last}>
            <option value={false}>None</option>
            <option value="pip">Pip</option>
            <option value="label">Label</option>
          </select>
        </li>
      </ul>

      <h3>Steps:</h3>
      <ul config-list>
        <li title="Steps along the slider that can be chosen">
          <input type="number" name="step" id="step" bind:value={$configStore.step} placeholder="1" />
          <label for="step">Step</label>
        </li>
        <li title="Number of visual steps between selectable steps">
          <input
            type="number"
            name="pipStep"
            id="pipStep"
            bind:value={$configStore.pipstep}
            placeholder="1"
            disabled={!hasPips}
          />
          <label for="pipStep">Pip Step</label>
        </li>
        <li>
          <Info
            >See the <a href="/svelte-range-slider-pips/en/examples/steps-combined">Steps</a> documentation for more information.</Info
          >
        </li>
      </ul>

      <h3>Float Labels:</h3>
      <ul config-list>
        <li title="Float labels are labels that float above each handle when interacted with">
          <input type="checkbox" name="float" id="float" bind:checked={$configStore.float} />
          <label for="float">Float</label>
        </li>
        <li title="Range float floats above the range between the two handles for a range slider">
          <input
            type="checkbox"
            name="range-float"
            id="range-float"
            bind:checked={$configStore.rangeFloat}
            disabled={!$configStore.range}
          />
          <label for="range-float">Range Float</label>
        </li>
      </ul>

      <h3>Formatters:</h3>
      <ul config-list>
        <li title="Will add a visual prefix to the slider&apos;s value{plural}">
          <input type="text" name="prefix" id="prefix" bind:value={$configStore.prefix} placeholder="£" />
          <label for="prefix">Prefix</label>
        </li>
        <li title="Will add a visual suffix to the slider&apos;s value{plural}">
          <input type="text" name="suffix" id="suffix" bind:value={$configStore.suffix} placeholder=".00p" />
          <label for="suffix">Suffix</label>
        </li>
        <li>
          <Info class=""
            >For more advanced formatting, see the <a href="/svelte-range-slider-pips/en/examples/formatter"
              >Formatting page</a
            >.</Info
          >
        </li>
      </ul>

      <h3>Spring:</h3>
      <ul config-list>
        <li title="Enable/Disable a smooth animation when moving the handle{plural}">
          <input type="checkbox" name="spring" id="spring" bind:checked={$configStore.spring} />
          <label for="spring">Spring</label>
        </li>
        <li title="Choose the spring animation type">
          <select
            name="spring-values"
            id="spring-values"
            bind:value={$configStore.springValues}
            disabled={!$configStore.spring}
          >
            {#each easingTypes as e}
              <option value={e.name}>{e.name}</option>
            {/each}
          </select>
        </li>
      </ul>

      <h3>Push/Drag</h3>
      <ul config-list>
        <li title="Enable/Disable a range handle to push the other handle when they meet">
          <input
            type="checkbox"
            name="pushy"
            id="pushy"
            bind:checked={$configStore.pushy}
            disabled={!$configStore.range}
          />
          <label for="pushy">Pushy</label>
        </li>
        <li title="Enable/Disable the ability to drag the range and move both handles simultaneously">
          <input
            type="checkbox"
            name="draggy"
            id="draggy"
            bind:checked={$configStore.draggy}
            disabled={!$configStore.range}
          />
          <label for="draggy">Draggy</label>
        </li>
      </ul>

      <h3>Range Gaps:</h3>
      <ul config-list>
        <li title="Set the minimum gap between the handles for a range slider">
          <input
            type="number"
            name="rangeGapMin"
            id="rangeGapMin"
            bind:value={$configStore.rangeGapMin}
            placeholder="0"
            disabled={$configStore.range !== true}
          />
          <label for="rangeGapMin">Min</label>
        </li>
        <li title="Set the maximum gap between the handles for a range slider">
          <input
            type="number"
            name="rangeGapMax"
            id="rangeGapMax"
            bind:value={$configStore.rangeGapMax}
            placeholder="Infinity"
            disabled={$configStore.range !== true}
          />
          <label for="rangeGapMax">Max</label>
        </li>
      </ul>

      <h3>Limits:</h3>
      <ul config-list>
        <li title="Set a constraint where the slider is restricted to (larger than the min)">
          <input
            type="number"
            name="limitMin"
            id="limitMin"
            min={$configStore.min}
            bind:value={$configStore.limitMin}
            placeholder={$configStore.min}
          />
          <label for="limitMin">Min</label>
        </li>
        <li title="Set a constraint where the slider is restricted to (smaller than the max)">
          <input
            type="number"
            name="limitMax"
            id="limitMax"
            max={$configStore.max}
            bind:value={$configStore.limitMax}
            placeholder={$configStore.max}
          />
          <label for="limitMax">Max</label>
        </li>
      </ul>

      <h3>Darkmode:</h3>
      <ul config-list>
        <li
          title="Slider&apos;s darkmode setting; &apos;false&apos; always light, &apos;force&apos; always dark, &apos;auto&apos; will use the system theme"
        >
          <select name="darkmode" id="darkmode" bind:value={$configStore.darkmode}>
            {#each darkmodeTypes as d}
              <option value={d.value}>{d.label}</option>
            {/each}
          </select>
        </li>
        <li>
          <Info
            >This will add the <code>darkmode</code> prop to the config, but will not affect this configurator display
            as we will show both light/dark from here on.
            <a href="/svelte-range-slider-pips/en/styling/darkmode">Learn more about <code>darkmode</code></a>.</Info
          >
        </li>
      </ul>
    </div>

    <ResetButton label="Config" isActive={isConfigReset} on:click={() => configStore.reset()} />

    <div class="configurator-range-slider bottom">
      {#if isMounted}
        <RangeSlider {...configProps} style="margin-inline: 0;" />
      {/if}
    </div>
  </Demo>

  <Aesthetics {configProps} {configStore} />
  <LightDark {configProps} {configStore} />
  <Colors {configProps} {configStore} />
  <GeneratedCode {configProps} {configStore} />
</section>

<style>
</style>
