<script setup lang="ts">
	import HelloWorld from './components/HelloWorld.vue';

	import { ref, watch, onMounted, type Ref } from 'vue';
	import type { ComponentProps } from 'svelte';
	import type { RangeSlider as RangeSliderType } from 'svelte-range-slider-pips';
	import RangeSlider from 'svelte-range-slider-pips';
	import 'svelte-range-slider-pips/dist/svelte-range-slider.css';

	const value = ref(22); // values to bind to slider
	const $node: Ref<HTMLElement | null> = ref(null); // dom reference for binding on mount
	let MyRangeSlider: RangeSliderType; // slider instance reference
	const sliderProps: ComponentProps<RangeSliderType> = {
		value: value.value,
		pips: true
	};

	onMounted(() => {
		if ($node.value) {
			MyRangeSlider = new RangeSlider({
				target: $node.value,
				props: sliderProps
			});
			MyRangeSlider.$on('change', (e) => (value.value = e.detail.value));
			watch(value, () => {
				MyRangeSlider.$set({ value: value.value });
			});
		}
	});
</script>

<template>
	<header>
		<img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
		<div class="wrapper">
			<HelloWorld msg="You did it!" />
		</div>
	</header>

	<div id="my-slider" ref="$node"></div>
	{{ value }}
	<button @click="value += 10">Add 10</button>
</template>

<style scoped>
	header {
		line-height: 1.5;
	}

	.logo {
		display: block;
		margin: 0 auto 2rem;
	}

	@media (min-width: 1024px) {
		header {
			display: flex;
			place-items: center;
			padding-right: calc(var(--section-gap) / 2);
		}
	}
</style>
