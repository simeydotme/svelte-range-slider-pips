<svelte:options runes={true} />

<script>
	import { RangeSlider } from 'svelte-range-slider-pips';
	let value = $state(20);
	let values = $state([20, 40, 60, 80, 100]);
</script>

<h1>With Runes</h1>

<button onclick={() => value++}> add value </button>

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
