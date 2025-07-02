<script lang="ts">
  import { onMount } from 'svelte'
  import { persisted } from 'svelte-persisted-store';
  import RangeSlider from 'svelte-range-slider-pips';
  import ResetLabel from './ResetLabel.svelte';
  import Demo from '~components/Reusable/Demo.svelte';
  import Info from '~components/Reusable/Info.svelte';
  
  import ConfiguratorOutput from "./ConfiguratorOutput.svelte";
  
  import { generatedSvelte, generatedVue, generatedCss, generatedReact, generatedVanilla, outputCode } from './generatedCode';
  import {
    aestheticsStore,
    trackStyle,
    handleStyle,
    floatStyle,
    pipsStyle,
  } from "./aestheticsStore";
  import { colorsStore, lightThemeColors, darkThemeColors, presets, selectedPresetStore, colorsPartsStore, overrideOutput } from "./colorsStore";
  import { settingsStore, outputProps } from "./configStore";

  export let configProps;
  export let configStore;

  // Debounced output stores
  let debouncedOutputPropsSvelte = '';
  let debouncedOutputPropsVue = '';
  let debouncedOutputPropsReact = '';
  let debouncedOutputPropsVanilla = '';
  let debouncedOutputPropsCss = '';
  let debounceTimeout;

  // Function to generate the code outputs
  function generateCodeOutputs() {
    const inlineStyles = (`${$trackStyle} ${$handleStyle} ${$floatStyle} ${$pipsStyle}`).trim();
    const overrideStyle = (`${overrideOutput($colorsPartsStore)}`).trim();
    const outputPropsObject = outputProps(configProps, 'json', '  ');
    const outputPropsAttributes = outputProps(configProps, 'html', '  ');
    
    debouncedOutputPropsSvelte = generatedSvelte(
      outputPropsAttributes, 
      $aestheticsStore.handle, 
      $aestheticsStore.pipPosition
    );

    debouncedOutputPropsVue = generatedVue(
      outputPropsObject, 
      $aestheticsStore.handle, 
      $aestheticsStore.pipPosition
    );

    debouncedOutputPropsReact = generatedReact(
      outputPropsObject, 
      $aestheticsStore.handle, 
      $aestheticsStore.pipPosition
    );

    debouncedOutputPropsVanilla = generatedVanilla(
      outputPropsObject, 
      $aestheticsStore.handle, 
      $aestheticsStore.pipPosition
    );

    debouncedOutputPropsCss = generatedCss(
      $aestheticsStore.handle,
      $lightThemeColors,
      $darkThemeColors,
      overrideStyle,
      inlineStyles
    );
  }

  // Debounced reactive statement that triggers code generation
  $: {
    // Watch all the stores that could trigger code regeneration
    $aestheticsStore;
    $trackStyle;
    $handleStyle;
    $floatStyle;
    $pipsStyle;
    $colorsStore;
    $lightThemeColors;
    $darkThemeColors;
    $colorsPartsStore;
    $configStore;
    configProps;
    
    // Clear existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    // Set new timeout for 500ms
    debounceTimeout = setTimeout(() => {
      generateCodeOutputs();
    }, 500);
  }

  // Initial generation on mount
  onMount(() => {
    generateCodeOutputs();
  });

  // Cleanup timeout on component destruction
  onMount(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  });

  </script>


<h2 id="generated-code">Generated Code</h2>

<p>Now you've configured your slider, you can copy the generated code below to use in your project.</p>

<Info>Remember to copy both the <code>Slider</code> code and the <code>CSS</code> styles.</Info>
<Info type="warning">You will probably need to modify the slider props for your framework, if you intend to bind them, or such.</Info>

<Demo name=" " leftAlign>
  <pre class="astro-code" slot="svelte"  lang="svelte">
    <ConfiguratorOutput outputPropsHtml={debouncedOutputPropsSvelte} />
  </pre>
  <pre class="astro-code" slot="vue"  lang="vue">
    <ConfiguratorOutput outputPropsHtml={debouncedOutputPropsVue} />
  </pre>
  <pre class="astro-code" slot="react"  lang="react">
    <ConfiguratorOutput outputPropsHtml={debouncedOutputPropsReact} />
  </pre>
  <pre class="astro-code" slot="css"  lang="css">
    <ConfiguratorOutput outputPropsHtml={debouncedOutputPropsCss} />
  </pre>
  <pre class="astro-code" slot="vanilla"  lang="html">
    <ConfiguratorOutput outputPropsHtml={debouncedOutputPropsVanilla} />
  </pre>
</Demo>



<style>
  .astro-code {
    margin: 0;
    padding: 0;
    background: none!important;
  }
  .astro-code :global(.configurator-output) {
    margin: 0;
    padding: 0 2rem 0 1rem;
    background: none!important;
  }
  .astro-code :global(pre.shiki) {
    margin: 0;
    padding: 0;
    background: none!important;
    overflow: auto;
    font-size: 1em;
  }
</style>