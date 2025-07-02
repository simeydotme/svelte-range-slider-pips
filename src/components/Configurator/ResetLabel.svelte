<script>

  export let store;
  export let key;
  export let name = "";
  export let title = `Double click to reset ${name} to default`;
  export let label = "";

</script>

<label for={key} on:dblclick={() => store.reset(key)} {title}>
  <slot>
    {label}
  </slot>
</label>