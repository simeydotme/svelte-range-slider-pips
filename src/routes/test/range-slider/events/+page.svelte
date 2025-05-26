<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  import { onMount } from 'svelte';

  // Test state
  let events: { type: string; detail: any }[] = [];
  let lastEvent: { type: string; detail: any } | null = null;
  let testValue = 50;
  let testValues = [25, 75];
  let testRange = false;
  let testDraggy = false;

  // Single handle test state
  let singleHandleValue = 50;

  // Multi-handle test state
  let multiHandleValues = [10, 30, 50, 70, 90];

  // Event handlers
  function handleStart(event: CustomEvent) {
    events.push({ type: 'start', detail: event.detail });
    events = [...events];
    lastEvent = { type: 'start', detail: event.detail };
  }

  function handleStop(event: CustomEvent) {
    events.push({ type: 'stop', detail: event.detail });
    events = [...events];
    lastEvent = { type: 'stop', detail: event.detail };
  }

  function handleChange(event: CustomEvent) {
    events.push({ type: 'change', detail: event.detail });
    events = [...events];
    lastEvent = { type: 'change', detail: event.detail };
  }

  // Test scenarios
  function clearTestScenario() {
    events = [];
    lastEvent = null;
  }

  // Helper to format event details for display
  function formatEventDetail(detail: any) {
    return JSON.stringify(detail, null, 2);
  }
</script>

<div class="container">
  <h1>Range Slider Event Tests</h1>

  <div class="controls">
    <label>
      <input type="checkbox" bind:checked={testRange} />
      Enable Range Mode
    </label>
    <label>
      <input type="checkbox" bind:checked={testDraggy} disabled={!testRange} />
      Enable Draggable Range
    </label>
  </div>

  <div class="test-scenarios">
    <h2>Test Scenarios</h2>

    <button on:click={() => clearTestScenario()}> Clear Event History </button>
  </div>

  <div class="slider-section">
    <h2>Single Handle Slider</h2>
    <div class="slider-container">
      <RangeSlider
        id="single-handle-slider"
        bind:value={singleHandleValue}
        pips={true}
        all="label"
        on:start={handleStart}
        on:stop={handleStop}
        on:change={handleChange}
      />
    </div>
  </div>

  <div class="slider-section">
    <h2>Range Slider</h2>
    <div class="slider-container">
      <RangeSlider
        id="range-slider"
        bind:value={testValue}
        bind:values={testValues}
        range={testRange}
        draggy={testDraggy}
        pips={true}
        all="label"
        on:start={handleStart}
        on:stop={handleStop}
        on:change={handleChange}
      />
    </div>
  </div>

  <div class="slider-section">
    <h2>Disabled Slider</h2>
    <div class="slider-container">
      <RangeSlider
        id="disabled-slider"
        values={[25, 75]}
        range={true}
        draggy={true}
        disabled={true}
        pips={true}
        all="label"
        on:start={handleStart}
        on:stop={handleStop}
        on:change={handleChange}
      />
    </div>
  </div>

  <div class="slider-section">
    <h2>Multi-Handle Slider</h2>
    <div class="slider-container">
      <RangeSlider
        id="multi-handle-slider"
        bind:values={multiHandleValues}
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

  .test-scenarios {
    margin: 4rem 0;
  }

  .test-scenarios button {
    padding: 0.5rem 1rem;
    margin-right: 1rem;
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
