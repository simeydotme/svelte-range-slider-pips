<script>
  import Icon from '@iconify/svelte';

  export let label = '';
  export let isActive = false;
</script>

<div class="configurator-controls">
  <button type="button" on:click class="reset-button" class:is-reset={isActive} title="Click to reset the {label} to default">
    <span class="reset-text">
      <span>Reset{label ? ` ${label}` : ''}</span>
      <span>Confirm Reset?</span>
    </span>
    <Icon icon="tabler:settings-x" />
  </button>
</div>

