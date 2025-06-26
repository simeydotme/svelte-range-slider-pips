<script>

  import Icon from '@iconify/svelte';
  import LabelColorSlider from './LabelColorSlider.svelte';
  import clickOutside from '~components/Reusable/clickOutside.action.ts';

  import css from './LabelColors.css?inline';
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  let labels = [
    { name: 'Bug', hue: 20, isOpen: false },
    { name: 'Feature', hue: 140, isOpen: false },
    { name: 'Documentation', hue: 202, isOpen: true },
    { name: 'Maintenance', hue: 230, isOpen: false },
    { name: 'Question', hue: 320, isOpen: false },
    { name: 'Invalid', hue: 0, isOpen: false },
  ];

  const openPicker = (index) => labels[index].isOpen = true;
  const closePicker = (index) => labels[index].isOpen = false;

</script>

<ul class="labels" data-grid>
  {#each labels as label,i}
    <li class="label" data-subgrid style="--hue: {label.hue}">
      <input class="label-name" type="text" bind:value={label.name} />
      <button class="label-color" type="button" 
        on:click={() => openPicker(i)}
        use:clickOutside={() => closePicker(i)}
      >
        <Icon icon="tabler:square-rounded-filled" />
        <LabelColorSlider bind:hue={label.hue} bind:isOpen={label.isOpen} />
      </button>
    </li>
  {/each}
</ul>

<!-- hide -->
{@html renderCss}
<!-- endhide -->