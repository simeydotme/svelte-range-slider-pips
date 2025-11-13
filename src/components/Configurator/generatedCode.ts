import { codeToHtml } from 'shiki3';
import handleDefaultCss from '~/components/Configurator/handles/default.css?inline';
import handleRingCss from '~/components/Configurator/handles/ring.css?inline';
import handleRectangleCss from '~/components/Configurator/handles/rectangle.css?inline';
import handleTriangleCss from '~/components/Configurator/handles/triangle.css?inline';
import trackSizeCss from '~/components/Configurator/track/track-size.css?inline';
import floatCss from '~/components/Configurator/float/float.css?inline';
import pipsCss from '~/components/Configurator/pips/pips.css?inline';

const handleStyles = {
  default: handleDefaultCss,
  ring: handleRingCss,
  rectangle: handleRectangleCss,
  triangle: handleTriangleCss,
};

export const outputCode = async (code: string, lang = 'svelte', theme = 'github-dark') => {
  code = code
    .trim()
    .replaceAll('*{}', '')
    .replaceAll('<!--script-->', '<script>')
    .replaceAll('<!--/script-->', '</script>');
  const outputCode = await codeToHtml(code, { lang, theme });
  const outputSource = code;
  return new Promise((resolve) => resolve({ outputCode, outputSource }));
};

export const generatedCss = async (
  handleType: keyof typeof handleStyles,
  lightThemeColors: string,
  darkThemeColors: string,
  overrideStyle: string,
  inlineStyles: string
) => {
  const code = `
  #mySlider {

  /* light theme */
  ${lightThemeColors}
    
  /* dark theme */
  ${darkThemeColors}
  
  /* custom colors */
  ${overrideStyle}
    
  /* custom aesthetics */
  ${inlineStyles}
  
  }
    
    ${handleStyles[handleType]}
    ${trackSizeCss}
    ${floatCss}
    ${pipsCss}
    `;

  return await outputCode(code, 'css', 'github-dark');
};

export const generatedSvelte = async (props: string, handleType: string, pipPosition: string) => {
  const code = `
<script>
  import RangeSlider from 'svelte-range-slider-pips';
</script>
  
<RangeSlider 
  id="mySlider"
  class="handle-${handleType} track-size float-style pips-${pipPosition} pips-style"
  ${props}
/>
  
<!-- check the CSS tab for generated styles -->
  `;

  return await outputCode(code, 'svelte', 'github-dark');
};

export const generatedVue = async (props: string, handleType: string, pipPosition: string) => {
  const code = `
<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import RangeSlider from 'svelte-range-slider-pips';

  const values = ref([10, 50]);
  const $slider = ref(null);
  let MyRangeSlider = ref(null);
  let sliderProps = ${props};

  onMounted(() => {
    MyRangeSlider = new RangeSlider({ 
      target: $slider.value,
      props: {
        id: 'mySlider', 
        class: 'handle-${handleType} track-size float-style pips-${pipPosition} pips-style',
        ...sliderProps
      }
    });
  });

  onUnmounted(() => {
    if (MyRangeSlider) {
      MyRangeSlider.$destroy();
    }
  });
</script>

<template>
  <div ref="$slider"></div>
</template>
  `;

  return await outputCode(code, 'vue', 'github-dark');
};

export const generatedReact = async (props: string, handleType: string, pipPosition: string) => {
  const code = `
import { useEffect, useRef, useState } from 'react';
import RangeSlider from 'svelte-range-slider-pips';

export default function TypicalUsage() {
  const nodeRef = useRef(null);
  const sliderRef = useRef(null);
  let sliderProps = ${props};

  useEffect(() => {
    sliderRef.current = new RangeSlider({
      target: nodeRef.current,
      props: {
        id: 'mySlider', 
        class: 'handle-${handleType} track-size float-style pips-${pipPosition} pips-style',
        ...sliderProps
      }
    });

    return () => {
      if (sliderRef.current) {
        sliderRef.current.$destroy();
      }
    };
  });

  return (
    <div ref={nodeRef}></div>
  );
}
  `;

  return await outputCode(code, 'jsx', 'github-dark');
};

export const generatedVanilla = async (props: string, handleType: string, pipPosition: string) => {
  const code = `
<script defer src="svelte-range-slider-pips.min.js"></script>

<div id="typical-slider"></div>

<script defer>
  let props = ${props};

  const slider = new RangeSlider({
    target: document.querySelector("#typical-slider"),
    props: {
      id: 'mySlider', 
      class: 'handle-${handleType} track-size float-style pips-${pipPosition} pips-style',
      ...props
    }
  });
</script>
  `;

  return await outputCode(code, 'html', 'github-dark');
};
