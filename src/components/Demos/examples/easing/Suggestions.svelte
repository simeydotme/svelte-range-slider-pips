<script>
  import RangeSlider from 'svelte-range-slider-pips';

  const defaultValues = [25, 75];

  // Different spring configurations to test
  const configurations = [
    { name: 'Default', config: { stiffness: 0.15, damping: 0.4 }, values: [...defaultValues] },
    { name: 'Fast', config: { stiffness: 0.66, damping: 0.5 }, values: [...defaultValues] },
    { name: 'Sharp', config: { stiffness: 0.4, damping: 0.4 }, values: [...defaultValues] },
    { name: 'Slow', config: { stiffness: 0.1, damping: 0.65 }, values: [...defaultValues] },
    { name: 'Sluggish', config: { stiffness: 0.3, damping: 0.9 }, values: [...defaultValues] },
    { name: 'Rubber', config: { stiffness: 0.2, damping: 0.15 }, values: [...defaultValues] },
    { name: 'Elastic', config: { stiffness: 0.72, damping: 0.28 }, values: [...defaultValues] },
    { name: 'Bouncy', config: { stiffness: 0.3, damping: 0.08 }, values: [...defaultValues] },
  ];

  function jumpToRandom( which = 0 ) {
    configurations[which].values = [Math.random() * 100, Math.random() * 100].sort((a, b) => a - b);
  }

  function resetValues( which = 0 ) {
    configurations[which].values = [...defaultValues];
  }
</script>

<div class="slider-list">

  <section data-grid>

    {#each configurations as c, index}

      <header data-row>
        <h3>{c.name}</h3>
      
        <RangeSlider
          id="spring-{c.name.toLowerCase().replace(/\s+/g, '-')}"
          bind:values={configurations[index].values}
          range
          rangeFloat
          pushy
          draggy
          springValues={c.config}
        />
      </header>
      
      <code data-code>{`springValues={{ stiffness: ${c.config.stiffness}, damping: ${c.config.damping} }}`}</code>
    {/each}

  </section>
</div>

<style>
  [data-grid] {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0 1rem;
    margin-top: 2rem;
  }

  [data-row] {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    align-items: center;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0;
    text-align: end;
  }

  [data-grid] :global(.rangeSlider) {
    margin: 0;
  }

  [data-code] {
    grid-column: 2 / -1;
    margin-bottom: 2rem;
  }
</style>