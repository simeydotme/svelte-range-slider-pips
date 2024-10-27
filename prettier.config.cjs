module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  singleQuote: false,
  semi: true,
  trailingComma: 'es5',
  printWidth: 120,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
        singleQuote: false
      }
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        singleQuote: false
      }
    }
  ]
}
