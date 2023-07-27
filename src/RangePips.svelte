<script>

  // range slider props
  export let range = false;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let values = [(max + min) / 2];
  export let vertical = false;
  export let reversed = false;
  export let hoverable = true;
  export let disabled = false;

  // range pips / values props
  export let pipstep = undefined;
  export let all = true;
  export let first = undefined;
  export let last = undefined;
  export let rest = undefined;

  // formatting props
  export let prefix = "";
  export let suffix = "";
  export let formatter = (v,i) => v;

  // stylistic props
  export let focus = undefined;
  export let orientationStart = undefined;

  // methods
  export let percentOf = undefined;
  export let moveHandle = undefined;
  export let fixFloat = undefined;
  export let normalisedClient = undefined;

  let clientStart;

  $: pipStep = pipstep || ((max - min) / step >= ( vertical ? 50 : 100 ) ? (max - min) / ( vertical ? 10 : 20 ) : 1);

  $: pipCount = parseInt((max - min) / (step * pipStep), 10);

  $: pipVal = function(val) {
    return fixFloat( min + val * step * pipStep );
  };

  $: isSelected = function(val) {
    return values.some(v => fixFloat(v) === fixFloat(val));
  };

  $: inRange = function(val) {
    if (range === "min") {
      return values[0] > val;
    } else if (range === "max") {
      return values[0] < val;
    } else if (range) {
      return values[0] < val && values[1] > val;
    }
  };

  /**
   * function to run when the user clicks on a label
   * we store the original client position so we can check if the user has moved the mouse/finger
   * @param {event} e the event from browser
   **/
  function labelDown(e) {
    e = normalisedClient(e);
    clientStart = { x: e.clientX, y: e.clientY };
  }

  /**
   * function to run when the user releases the mouse/finger
   * we check if the user has moved the mouse/finger, if not we "click" the label
   * and move the handle it to the label position
   * @param {number} val the value of the label
   * @param {event} e the event from browser
   */
  function labelUp(val,e) {
    e = normalisedClient(e);
    if ( !disabled ) {
      const distanceMoved = Math.sqrt( Math.pow( clientStart.x - e.clientX, 2 ) + Math.pow( clientStart.y - e.clientY, 2 ) );
      if ( clientStart && ( distanceMoved <= 5 ) ) {
        moveHandle( undefined, val );
      }
    }
  }
</script>

<style>
  :global(.rangeSlider) {
    --pip: var(--range-pip, lightslategray);
    --pip-text: var(--range-pip-text, var(--pip));
    --pip-active: var(--range-pip-active, darkslategrey);
    --pip-active-text: var(--range-pip-active-text, var(--pip-active));
    --pip-hover: var(--range-pip-hover, darkslategrey);
    --pip-hover-text: var(--range-pip-hover-text, var(--pip-hover));
    --pip-in-range: var(--range-pip-in-range, var(--pip-active));
    --pip-in-range-text: var(--range-pip-in-range-text, var(--pip-active-text));
  }
  :global(.rangePips) {
    position: absolute;
    height: 1em;
    left: 0;
    right: 0;
    bottom: -1em;
  }
  :global(.rangePips.vertical) {
    height: auto;
    width: 1em;
    left: 100%;
    right: auto;
    top: 0;
    bottom: 0;
  }
  :global(.rangePips .pip) {
    height: 0.4em;
    position: absolute;
    top: 0.25em;
    width: 1px;
    white-space: nowrap;
  }
  :global(.rangePips.vertical .pip) {
    height: 1px;
    width: 0.4em;
    left: 0.25em;
    top: auto;
    bottom: auto;
  }
  :global(.rangePips .pipVal) {
    position: absolute;
    top: 0.4em;
    transform: translate(-50%, 25%);
  }
  :global(.rangePips.vertical .pipVal) {
    position: absolute;
    top: 0;
    left: 0.4em;
    transform: translate(25%, -50%);
  }
  :global(.rangePips .pip) {
    transition: all 0.15s ease;
  }
  :global(.rangePips .pipVal) {
    transition: all 0.15s ease, font-weight 0s linear;
  }
  :global(.rangePips .pip) {
    color: lightslategray;
    color: var(--pip-text);
    background-color: lightslategray;
    background-color: var(--pip);
  }
  :global(.rangePips .pip.selected) {
    color: darkslategrey;
    color: var(--pip-active-text);
    background-color: darkslategrey;
    background-color: var(--pip-active);
  }
  :global(.rangePips.hoverable:not(.disabled) .pip:hover) {
    color: darkslategrey;
    color: var(--pip-hover-text);
    background-color: darkslategrey;
    background-color: var(--pip-hover);
  }
  :global(.rangePips .pip.in-range) {
    color: darkslategrey;
    color: var(--pip-in-range-text);
    background-color: darkslategrey;
    background-color: var(--pip-in-range);
  }
  :global(.rangePips .pip.selected) {
    height: 0.75em;
  }
  :global(.rangePips.vertical .pip.selected) {
    height: 1px;
    width: 0.75em;
  }
  :global(.rangePips .pip.selected .pipVal) {
    font-weight: bold;
    top: 0.75em;
  }
  :global(.rangePips.vertical .pip.selected .pipVal) {
    top: 0;
    left: 0.75em;
  }
  :global(.rangePips.hoverable:not(.disabled) .pip:not(.selected):hover) {
    transition: none;
  }
  :global(.rangePips.hoverable:not(.disabled) .pip:not(.selected):hover .pipVal) {
    transition: none;
    font-weight: bold;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
  class="rangePips" 
  class:disabled
  class:hoverable 
  class:vertical 
  class:reversed 
  class:focus 
>
  {#if ( all && first !== false ) || first }
    <span
      class="pip first"
      class:selected={isSelected(min)}
      class:in-range={inRange(min)}
      style="{orientationStart}: 0%;"
      on:pointerdown={(e)=>{labelDown(e)}}
      on:pointerup={(e)=>{labelUp(pipVal(min),e)}}
    >
      {#if all === 'label' || first === 'label'}
        <span class="pipVal">
          {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{formatter(fixFloat(min),0,0)}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
        </span>
      {/if}
    </span>
  {/if}

  {#if ( all && rest !== false ) || rest}
    {#each Array(pipCount + 1) as _, i}
      {#if pipVal(i) !== min && pipVal(i) !== max}
        <span
          class="pip"
          class:selected={isSelected(pipVal(i))}
          class:in-range={inRange(pipVal(i))}
          style="{orientationStart}: {percentOf(pipVal(i))}%;"
          on:pointerdown={(e)=>{labelDown(e)}}
          on:pointerup={(e)=>{labelUp(pipVal(i),e)}}
        >
          {#if all === 'label' || rest === 'label'}
            <span class="pipVal">
              {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{formatter(pipVal(i),i,percentOf(pipVal(i)))}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
            </span>
          {/if}
        </span>
      {/if}
    {/each}
  {/if}

  {#if ( all && last !== false ) || last}
    <span
      class="pip last"
      class:selected={isSelected(max)}
      class:in-range={inRange(max)}
      style="{orientationStart}: 100%;"
      on:pointerdown={(e)=>{labelDown(e)}}
      on:pointerup={(e)=>{labelUp(pipVal(max),e)}}
    >
      {#if all === 'label' || last === 'label'}
        <span class="pipVal">
          {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{formatter(fixFloat(max),pipCount,100)}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
        </span>
      {/if}
    </span>
  {/if}
  
</div>
