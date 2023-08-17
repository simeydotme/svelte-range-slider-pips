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

export const EDIT_URL = `https://github.com/simeydotme/svelte-range-slider-pips/tree/gh-pages`

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
      { text: 'Introduction', link: 'en/introduction' },
      { text: 'Accessibility', link: 'en/a11y' },
      { text: 'Getting Started', link: 'en/getting-started' },
      { text: 'Basic Usage', link: 'en/basic-usage' },
      { text: 'Options', link: 'en/options', children: [
        { text: 'values', link: 'en/options#values' },
        { text: 'min', link: 'en/options#min' },
        { text: 'max', link: 'en/options#max' },
        { text: 'pips', link: 'en/options#pips' },
        { text: 'step', link: 'en/options#step' },
        { text: 'pipstep', link: 'en/options#pipstep' },
        { text: 'range', link: 'en/options#range' },
        { text: 'pushy', link: 'en/options#pushy' },
        { text: 'float', link: 'en/options#float' },
        { text: 'vertical', link: 'en/options#vertical' },
        { text: 'first', link: 'en/options#first' },
        { text: 'last', link: 'en/options#last' },
        { text: 'rest', link: 'en/options#rest' },
        { text: 'all', link: 'en/options#all' },
        { text: 'prefix', link: 'en/options#prefix' },
        { text: 'suffix', link: 'en/options#suffix' },
        { text: 'reversed', link: 'en/options#reversed' },
        { text: 'hoverable', link: 'en/options#hoverable' },
        { text: 'disabled', link: 'en/options#disabled' },
        { text: 'id', link: 'en/options#id' },
        { text: 'ariaLabels', link: 'en/options#ariaLabels' },
        { text: 'formatter', link: 'en/options#formatter' },
        { text: 'handleFormatter', link: 'en/options#handleFormatter' },
        { text: 'springValues', link: 'en/options#springValues' },
        { text: 'slider', link: 'en/options#slider' },
      ]},
      { text: 'Styling', link: 'en/styling', children: [
        { text: 'Color Variables', link: 'en/styling#colors' },
        { text: 'Size', link: 'en/styling#size' },
        { text: 'CSS Structure', link: 'en/styling#structure' }  
      ]},
      { text: 'Examples', link: 'en/examples/values', children: [
        { text: 'Values & Binding', link: 'en/examples/values' },
        { text: 'Min & Max', link: 'en/examples/min-max' },
        { text: 'Pips', link: 'en/examples/pips' },
        { text: 'Pip Labels', link: 'en/examples/pip-labels' },
        { text: 'Steps', link: 'en/examples/steps' },
        { text: 'Pip Steps', link: 'en/examples/pip-steps' },
        { text: 'Steps & Pip Steps', link: 'en/examples/steps-combined' },
        { text: 'Ranges', link: 'en/examples/range' },
        { text: 'Pushy', link: 'en/examples/range#pushy-range-handles' },
        { text: 'Float', link: 'en/examples/float' },
        { text: 'Vertical', link: 'en/examples/vertical' },
        { text: 'Prefix & Suffix', link: 'en/examples/prefix-suffix' },
        { text: 'Formatter', link: 'en/examples/formatter' },
      ]},
    ],
    'Another Section': [{ text: 'Page 4', link: 'en/page-4' }]
  }
}
