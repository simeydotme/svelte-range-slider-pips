<svelte:options runes={false} />

<script>
	import { RangeSlider } from 'svelte-range-slider-pips';
	let value = 20;
	let values = [20, 40, 60, 80, 100];
</script>

<h1>Without Runes</h1>

<button on:click={() => value++}> add value </button>

{value}
<RangeSlider
	bind:value
	pips
	first="label"
	last="label"
	rest="pip"
	on:start={() => console.log('start')}
	on:stop={() => console.log('stop')}
	on:change={({ detail }) => console.log('change', detail)}
/>

{values}
<RangeSlider bind:values pips first="label" last="label" rest="pip" />
