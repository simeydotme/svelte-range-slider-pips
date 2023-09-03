export const SITE = {
  title: 'Range Slider Pips',
  description: 'Documentation mini-site for using the Range Slider Pips component',
  defaultLanguage: 'en'
} as const

export const OPEN_GRAPH = {
  image: {
    src: 'https://github.com/simeydotme/svelte-range-slider-pips/blob/main/test/public/range-slider.png',
    alt:
      'Preview of the Range Slider with a few different features demonstrated'
  },
  twitter: 'simeydotme'
}

export const KNOWN_LANGUAGES = {
  // Deutsch: 'de',
  English: 'en'
} as const
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES)

export const EDIT_URL = `https://github.com/simeydotme/svelte-range-slider-pips/tree/astro-pages`
export const COMMUNITY_INVITE_URL = `https://github.com/simeydotme/svelte-range-slider-pips/discussions`

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'XXXXXXXXXX',
  appId: 'XXXXXXXXXX',
  apiKey: 'XXXXXXXXXX'
}

export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<string, { text: string; link: string, children?: SubLinks[] }[]>
>
interface SubLinks { text: string; link: string }

export const SIDEBAR: Sidebar = {
  // "de": {
  //   'x': [
  //     { text: "Einführung", link: 'de/einführung' },
  //   ]
  // },
  "en": {
    '': [
      { text: 'Introduction', link: 'svelte-range-slider-pips/en/introduction' },
      { text: 'Accessibility', link: 'svelte-range-slider-pips/en/a11y' },
      { text: 'Getting Started', link: 'svelte-range-slider-pips/en/getting-started' },
      { text: 'Basic Usage', link: 'svelte-range-slider-pips/en/basic-usage' },
      { text: 'Options', link: 'svelte-range-slider-pips/en/options', 
        children: [
          { text: 'values', link: 'svelte-range-slider-pips/en/options#values' },
          { text: 'min', link: 'svelte-range-slider-pips/en/options#min' },
          { text: 'max', link: 'svelte-range-slider-pips/en/options#max' },
          { text: 'pips', link: 'svelte-range-slider-pips/en/options#pips' },
          { text: 'step', link: 'svelte-range-slider-pips/en/options#step' },
          { text: 'pipstep', link: 'svelte-range-slider-pips/en/options#pipstep' },
          { text: 'range', link: 'svelte-range-slider-pips/en/options#range' },
          { text: 'pushy', link: 'svelte-range-slider-pips/en/options#pushy' },
          { text: 'float', link: 'svelte-range-slider-pips/en/options#float' },
          { text: 'vertical', link: 'svelte-range-slider-pips/en/options#vertical' },
          { text: 'first', link: 'svelte-range-slider-pips/en/options#first' },
          { text: 'last', link: 'svelte-range-slider-pips/en/options#last' },
          { text: 'rest', link: 'svelte-range-slider-pips/en/options#rest' },
          { text: 'all', link: 'svelte-range-slider-pips/en/options#all' },
          { text: 'prefix', link: 'svelte-range-slider-pips/en/options#prefix' },
          { text: 'suffix', link: 'svelte-range-slider-pips/en/options#suffix' },
          { text: 'reversed', link: 'svelte-range-slider-pips/en/options#reversed' },
          { text: 'hoverable', link: 'svelte-range-slider-pips/en/options#hoverable' },
          { text: 'disabled', link: 'svelte-range-slider-pips/en/options#disabled' },
          { text: 'id', link: 'svelte-range-slider-pips/en/options#id' },
          { text: 'ariaLabels', link: 'svelte-range-slider-pips/en/options#ariaLabels' },
          { text: 'formatter', link: 'svelte-range-slider-pips/en/options#formatter' },
          { text: 'handleFormatter', link: 'svelte-range-slider-pips/en/options#handleFormatter' },
          { text: 'springValues', link: 'svelte-range-slider-pips/en/options#springValues' },
          { text: 'slider', link: 'svelte-range-slider-pips/en/options#slider' },
        ]
      },
      { text: 'Events', link: 'svelte-range-slider-pips/en/events', 
        children: [
          { text: 'start', link: 'svelte-range-slider-pips/en/events#start' },
          { text: 'change', link: 'svelte-range-slider-pips/en/events#change' },
          { text: 'stop', link: 'svelte-range-slider-pips/en/events#stop' },
        ]
      },
      { text: 'Styling', link: 'svelte-range-slider-pips/en/styling', 
        children: [
          { text: 'Color Variables', link: 'svelte-range-slider-pips/en/styling#colors' },
          { text: 'Size', link: 'svelte-range-slider-pips/en/styling#size' },
          { text: 'CSS Structure', link: 'svelte-range-slider-pips/en/styling#structure' }  
        ]
      },
      { text: 'Examples', link: 'svelte-range-slider-pips/en/examples', 
        children: [
          { text: 'Values & Binding', link: 'svelte-range-slider-pips/en/examples/values' },
          { text: 'Min & Max', link: 'svelte-range-slider-pips/en/examples/min-max' },
          { text: 'Pips', link: 'svelte-range-slider-pips/en/examples/pips' },
          { text: 'Pip Labels', link: 'svelte-range-slider-pips/en/examples/pip-labels' },
          { text: 'Steps', link: 'svelte-range-slider-pips/en/examples/steps' },
          { text: 'Pip Steps', link: 'svelte-range-slider-pips/en/examples/pip-steps' },
          { text: 'Steps & Pip Steps', link: 'svelte-range-slider-pips/en/examples/steps-combined' },
          { text: 'Ranges', link: 'svelte-range-slider-pips/en/examples/range' },
          { text: 'Pushy', link: 'svelte-range-slider-pips/en/examples/range#pushy-range-handles' },
          { text: 'Float', link: 'svelte-range-slider-pips/en/examples/float' },
          { text: 'Vertical', link: 'svelte-range-slider-pips/en/examples/vertical' },
          { text: 'Prefix & Suffix', link: 'svelte-range-slider-pips/en/examples/prefix-suffix' },
          { text: 'Formatter', link: 'svelte-range-slider-pips/en/examples/formatter' },
          { text: 'Disabled', link: 'svelte-range-slider-pips/en/examples/disabled' },
          { text: 'Easing', link: 'svelte-range-slider-pips/en/examples/easing' },
        ]
      },
      { text: 'Recipes', link: 'svelte-range-slider-pips/en/recipes', 
        children: [
          { text: 'DaisyUi', link: 'svelte-range-slider-pips/en/recipes/daisy-ui' },
          { text: 'Color Picker', link: 'svelte-range-slider-pips/en/recipes/color-picker' },
          { text: 'Price Gradient', link: 'svelte-range-slider-pips/en/recipes/price-range' },
        ]
      }
    ]
  }
}
