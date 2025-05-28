<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import RangeSlider from 'svelte-range-slider-pips';

  const values = ref([10, 50]);
  const $node = ref(null);
  let MyRangeSlider = ref(null);

  onMounted(() => {
    MyRangeSlider = new RangeSlider({ 
      target: $node.value,
      props: {
        values: values.value,
        pips: true,
        float: true,
        first: 'label',
        last: 'label'
      }
    });

    MyRangeSlider.$on('change', (e) => {
      values.value = e.detail.values;
    });
  });

  onUnmounted(() => {
    if (MyRangeSlider) {
      MyRangeSlider.$destroy();
    }
  });
</script>

<template>
  <div ref="$node"></div>
</template>