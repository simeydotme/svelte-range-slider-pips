<script>
	import RangeSlider from 'svelte-range-slider-pips';
	let value = 40;
	let max = 60;
	let min = 10;
	let values = [20, 30];
	let limits = false;
	let range = false;
</script>

<RangeSlider
	bind:values
	pips
	{min}
	{max}
	{range}
	{limits}
	float
	all="label"
	style="margin-block: 80px;"
	rangeGapMin={10}
/>
<input type="number" bind:value={values[0]} />
<input type="number" bind:value={values[1]} />

<button
	onclick={() => {
		values = [10, 30];
	}}>Set values to 10, 30</button
>

<button
	onclick={() => {
		if (limits) {
			limits = false;
		} else {
			limits = [25, 35];
		}
	}}>Set limits to {limits ? 'false' : '[25, 35]'}</button
>

<button
	onclick={() => {
		if (range) {
			range = false;
		} else {
			range = true;
		}
	}}>Set range to {!range ? 'true' : 'false'}</button
>

<button
	onclick={() => {
		if (min === 10) {
			min = 20;
			max = 40;
		} else {
			min = 10;
			max = 60;
		}
	}}>Set min to {min === 10 ? '20' : '10'}, max to {max === 60 ? '40' : '60'}</button
>
