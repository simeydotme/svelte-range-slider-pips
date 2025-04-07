<script>
  export let values = [0, 0];
  const increment = () => {
    values[0] -= 1;
    values[1] += 1;
  };
</script>

<button on:click={increment}>
  count is {values[0]} + {values[1]} = {values[0] + values[1]}
</button>
