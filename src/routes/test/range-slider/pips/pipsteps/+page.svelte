<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  let hasPipstep = false;
  let hasAlternatePipstep = false;

  function togglePipstep() {
    hasPipstep = !hasPipstep;
  }

  function toggleAlternatePipstep() {
    hasAlternatePipstep = !hasAlternatePipstep;
  }
</script>

<div class="slider-list">
  <h5>Default pipstep (no pipstep prop)</h5>
  <RangeSlider id="default-pipstep" pips all="label" />

  <h5>pipstep=2 (shows every other step)</h5>
  <RangeSlider id="pipstep-2" pips all="label" pipstep={2} />

  <h5>pipstep=5 (shows every 5th step)</h5>
  <RangeSlider id="pipstep-5" pips all="label" pipstep={5} />

  <h5>pipstep=10 (shows every 10th step)</h5>
  <RangeSlider id="pipstep-10" pips all="label" pipstep={10} />

  <h5>pipstep=2.5 (shows every 2.5th step)</h5>
  <RangeSlider id="pipstep-2-5" pips all="label" pipstep={2.5} />

  <h5>pipstep=7.3 (shows every 7.3rd step)</h5>
  <RangeSlider id="pipstep-7-3" pips all="label" pipstep={7.3} step={2} float />

  <h5>pipstep=0.1 (should reduce due to stepMax limit)</h5>
  <RangeSlider id="pipstep-0-1" pips all="label" pipstep={0.1} max={50} />

  <h5>pipstep=0.01 (should reduce due to 1000 pip limit)</h5>
  <RangeSlider id="pipstep-0-01" pips all="label" pipstep={0.01} />

  <h5>pipstep=0.0001 (should reduce due to 1000 pip limit)</h5>
  <RangeSlider id="pipstep-0-0001" pips all="label" pipstep={0.0001} />

  <h5>pipstep=2 with custom min/max</h5>
  <RangeSlider id="pipstep-2-minmax" pips all="label" pipstep={2} min={20} max={80} />

  <h5>pipstep=5 with custom min/max</h5>
  <RangeSlider id="pipstep-5-minmax" pips all="label" pipstep={5} min={20} max={80} />

  <h5>pipstep=2.5 with custom min/max</h5>
  <RangeSlider id="pipstep-2-5-minmax" pips all="label" pipstep={2.5} min={20} max={80} />

  <h5>pipstep=7.3 with custom min/max</h5>
  <RangeSlider id="pipstep-7-3-minmax" pips all="label" pipstep={7.3} min={20} max={80} />

  <h5>pipstep=2 with large range (max=1000)</h5>
  <RangeSlider id="pipstep-2-1000" pips all="label" pipstep={2} max={1000} />

  <h5>pipstep=5 with large range (max=1000)</h5>
  <RangeSlider id="pipstep-5-1000" pips all="label" pipstep={5} max={1000} />

  <h5>pipstep=10 with large range (max=1000)</h5>
  <RangeSlider id="pipstep-10-1000" pips all="label" pipstep={10} max={1000} />

  <h5>pipstep=200 with very large range (max=10000)</h5>
  <RangeSlider id="pipstep-2-10000" pips all="label" pipstep={200} max={10000} />

  <h5>pipstep=500 with very large range (max=100000)</h5>
  <RangeSlider id="pipstep-500-100000" pips all="label" pipstep={500} max={100000} />

  <h5>pipstep=10 with very large range (max=10000)</h5>
  <RangeSlider id="pipstep-10-10000" pips all="label" pipstep={10} max={10000} />

  <h5>Dynamic pipstep control (toggle between no pipstep and pipstep=2.5)</h5>
  <div class="controls">
    <button id="toggle-pipstep" on:click={togglePipstep}>
      {hasPipstep ? 'Remove Pipstep' : 'Add Pipstep'}
    </button>
  </div>
  <RangeSlider id="dynamic-pipstep" pips all="label" pipstep={hasPipstep ? 2.5 : undefined} />

  <h5>Dynamic pipstep values (toggle between pipstep=5 and pipstep=10)</h5>
  <div class="controls">
    <button id="toggle-alternate-pipstep" on:click={toggleAlternatePipstep}>
      {hasAlternatePipstep ? 'Use Pipstep 5' : 'Use Pipstep 10'}
    </button>
  </div>
  <RangeSlider id="dynamic-alternate-pipstep" pips all="label" pipstep={hasAlternatePipstep ? 10 : 5} />
</div>
