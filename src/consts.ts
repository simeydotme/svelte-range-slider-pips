export const REPOPATH = 'svelte-range-slider-pips';

export const SITE = {
  title: 'Range Slider Pips',
  description: 'Documentation mini-site for using the Range Slider Pips component',
  defaultLanguage: 'en'
} as const

export const OPEN_GRAPH = {
  image: {
    src: `https://github.com/simeydotme/${REPOPATH}/blob/main/test/public/range-slider.png`,
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

export const EDIT_URL = `https://github.com/simeydotme/${REPOPATH}/tree/astro-pages`
export const COMMUNITY_INVITE_URL = `https://github.com/simeydotme/${REPOPATH}/discussions`

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
  //   'Introduction': [
  //     { text: "Einführung", link: 'de/einführung' },
  //   ]
  // },
  "en": {
    '': [
      { text: 'Introduction', link: `${REPOPATH}/en/introduction` },
      { text: 'Accessibility', link: `${REPOPATH}/en/a11y` },
      { text: 'Getting Started', link: `${REPOPATH}/en/getting-started` },
      { text: 'Basic Usage', link: `${REPOPATH}/en/basic-usage` },
      { text: 'Options', link: `${REPOPATH}/en/options`, 
        children: [
          { text: 'values', link: `${REPOPATH}/en/options#values` },
          { text: 'min', link: `${REPOPATH}/en/options#min` },
          { text: 'max', link: `${REPOPATH}/en/options#max` },
          { text: 'pips', link: `${REPOPATH}/en/options#pips` },
          { text: 'step', link: `${REPOPATH}/en/options#step` },
          { text: 'pipstep', link: `${REPOPATH}/en/options#pipstep` },
          { text: 'range', link: `${REPOPATH}/en/options#range` },
          { text: 'pushy', link: `${REPOPATH}/en/options#pushy` },
          { text: 'float', link: `${REPOPATH}/en/options#float` },
          { text: 'vertical', link: `${REPOPATH}/en/options#vertical` },
          { text: 'first', link: `${REPOPATH}/en/options#first` },
          { text: 'last', link: `${REPOPATH}/en/options#last` },
          { text: 'rest', link: `${REPOPATH}/en/options#rest` },
          { text: 'all', link: `${REPOPATH}/en/options#all` },
          { text: 'prefix', link: `${REPOPATH}/en/options#prefix` },
          { text: 'suffix', link: `${REPOPATH}/en/options#suffix` },
          { text: 'reversed', link: `${REPOPATH}/en/options#reversed` },
          { text: 'hoverable', link: `${REPOPATH}/en/options#hoverable` },
          { text: 'disabled', link: `${REPOPATH}/en/options#disabled` },
          { text: 'id', link: `${REPOPATH}/en/options#id` },
          { text: 'ariaLabels', link: `${REPOPATH}/en/options#ariaLabels` },
          { text: 'formatter', link: `${REPOPATH}/en/options#formatter` },
          { text: 'handleFormatter', link: `${REPOPATH}/en/options#handleFormatter` },
          { text: 'springValues', link: `${REPOPATH}/en/options#springValues` },
          { text: 'slider', link: `${REPOPATH}/en/options#slider` },
        ]
      },
      { text: 'Events', link: `${REPOPATH}/en/events`, 
        children: [
          { text: 'start', link: `${REPOPATH}/en/events#start` },
          { text: 'change', link: `${REPOPATH}/en/events#change` },
          { text: 'stop', link: `${REPOPATH}/en/events#stop` },
        ]
      },
      { text: 'Styling', link: `${REPOPATH}/en/styling`, 
        children: [
          { text: 'Color Variables', link: `${REPOPATH}/en/styling#colors` },
          { text: 'Size', link: `${REPOPATH}/en/styling#size` },
          { text: 'CSS Structure', link: `${REPOPATH}/en/styling#structure` }  
        ]
      },
      { text: 'Examples', link: `${REPOPATH}/en/examples`, 
        children: [
          { text: 'Values & Binding', link: `${REPOPATH}/en/examples/values` },
          { text: 'Min & Max', link: `${REPOPATH}/en/examples/min-max` },
          { text: 'Pips', link: `${REPOPATH}/en/examples/pips` },
          { text: 'Pip Labels', link: `${REPOPATH}/en/examples/pip-labels` },
          { text: 'Steps', link: `${REPOPATH}/en/examples/steps` },
          { text: 'Pip Steps', link: `${REPOPATH}/en/examples/pip-steps` },
          { text: 'Steps & Pip Steps', link: `${REPOPATH}/en/examples/steps-combined` },
          { text: 'Ranges', link: `${REPOPATH}/en/examples/range` },
          { text: 'Pushy', link: `${REPOPATH}/en/examples/range#pushy-range-handles` },
          { text: 'Float', link: `${REPOPATH}/en/examples/float` },
          { text: 'Vertical', link: `${REPOPATH}/en/examples/vertical` },
          { text: 'Prefix & Suffix', link: `${REPOPATH}/en/examples/prefix-suffix` },
          { text: 'Formatter', link: `${REPOPATH}/en/examples/formatter` },
          { text: 'Disabled', link: `${REPOPATH}/en/examples/disabled` },
          { text: 'Easing', link: `${REPOPATH}/en/examples/easing` },
        ]
      },
      { text: 'Recipes', link: `${REPOPATH}/en/recipes`, 
        children: [
          { text: 'DaisyUi', link: `${REPOPATH}/en/recipes/daisy-ui` },
          { text: 'Color Picker', link: `${REPOPATH}/en/recipes/color-picker` },
          { text: 'Price Gradient', link: `${REPOPATH}/en/recipes/price-range` },
        ]
      }
    ]
  }
}
