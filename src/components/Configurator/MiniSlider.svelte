<script>
  import RangeSlider from "svelte-range-slider-pips";
  import ResetLabel from "./ResetLabel.svelte";

  export let store;
  export let key;
  export let name = "";
  export let title = `Double click to reset ${name} to default`;
  export let label = "";

  const miniSliderProps = {
    pips: true,
    float: true,
    class: "mini-slider",
  };
</script>

<RangeSlider id={key} bind:value={$store[key]} {...miniSliderProps} {...$$restProps} on:change />
<ResetLabel {store} {key} {name} {title} {label} />
