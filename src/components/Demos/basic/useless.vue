<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import RangeSlider from 'svelte-range-slider-pips';

  const $node = ref(null);
  let MyRangeSlider = ref(null);

  onMounted(() => {
    MyRangeSlider = new RangeSlider({ 
      target: $node.value
    });
  });

  onUnmounted(() => {
    if (MyRangeSlider) {
      MyRangeSlider.$destroy();
    }
  });
</script>

<template>
  <div id="useless-slider" ref="$node"></div>
</template>