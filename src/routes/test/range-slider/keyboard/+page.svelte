<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  // Test state
  let events: { type: string; detail: any }[] = [];
  let lastEvent: { type: string; detail: any } | null = null;

  // Single handle test state
  let value = 50;
  let reversed = false;
  let disabled = false;

  function handleStart(event: CustomEvent) {
    events.push({ type: 'start', detail: event.detail });
    events = [...events];
  }

  function handleStop(event: CustomEvent) {
    events.push({ type: 'stop', detail: event.detail });
    events = [...events];
  }

  function handleChange(event: CustomEvent) {
    events.push({ type: 'change', detail: event.detail });
    events = [...events];
  }

  $: lastEvent = events[events.length - 1];

  function clearEvents() {
    events = [];
    lastEvent = null;
  }

  function formatEventDetail(detail: any) {
    return JSON.stringify(detail, null, 2);
  }
</script>

<div class="container">
  <h1>Keyboard Interaction Tests</h1>

  <div class="controls">
    <button on:click={clearEvents}>Clear Event History</button>
    <label>
      <input type="checkbox" bind:checked={reversed} />
      Reversed
    </label>
    <label>
      <input type="checkbox" bind:checked={disabled} />
      Disabled
    </label>
  </div>

  <div class="slider-section">
    <h2>Single Handle Slider (Keyboard Focusable)</h2>
    <div class="slider-container">
      <RangeSlider
        id="keyboard-slider"
        bind:value
        {reversed}
        {disabled}
        pips={true}
        all="label"
        on:start={handleStart}
        on:stop={handleStop}
        on:change={handleChange}
      />
    </div>
  </div>

  <div class="event-display">
    <h2>Last Event</h2>
    {#if lastEvent}
      <div class="event-detail">
        <h3>type: {lastEvent.type}</h3>
        <pre>{formatEventDetail(lastEvent.detail)}</pre>
      </div>
    {:else}
      <p>No events yet</p>
    {/if}

    <h2>Event History</h2>
    {#if events.length > 0}
      <div class="event-history">
        {#each events as event}
          <div class="event-detail">
            <h3>type: {event.type}</h3>
            <pre>{formatEventDetail(event.detail)}</pre>
          </div>
        {/each}
      </div>
    {:else}
      <p>No events recorded</p>
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .controls {
    margin: 2rem 0;
    display: flex;
    gap: 1rem;
  }

  .slider-section {
    margin: 4rem 0;
  }

  .slider-section h2 {
    margin-bottom: 2rem;
  }

  .slider-container {
    margin: 2rem 0 4rem;
  }

  .event-display {
    margin: 2rem 0;
  }

  .event-detail {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
  }

  .event-detail h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .event-detail pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .event-history {
    height: 400px;
    overflow-y: auto;
  }
</style>
