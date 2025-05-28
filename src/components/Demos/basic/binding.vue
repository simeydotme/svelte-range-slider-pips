<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import RangeSlider from 'svelte-range-slider-pips';

  const value = ref(10);
  const $node = ref(null);
  let MyRangeSlider = ref(null);

  const updateSlider = () => {
    MyRangeSlider.$set({ value: value.value });
  }

  onMounted(() => {
    MyRangeSlider = new RangeSlider({ 
      target: $node.value,
      props: {
        min: 0,
        max: 100,
        value: value.value
      }
    });

    MyRangeSlider.$on('change', (e) => {
      value.value = e.detail.value;
    });
  });

  onUnmounted(() => {
    if (MyRangeSlider) {
      MyRangeSlider.$destroy();
    }
  });
</script>

<template>
  <div id="binding-slider" ref="$node"></div>
  <input type="number" v-model="value" @change="updateSlider" />
</template> 