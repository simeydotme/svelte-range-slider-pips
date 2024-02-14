<script>import {
  coerceFloat,
  valueAsPercent,
  normalisedClient,
  isInRange,
  isSelected,
  getValueFromIndex
} from "../utils.js";
export let range = false;
export let min = 0;
export let max = 100;
export let step = 1;
export let value = (max + min) / 2;
export let values = [value];
export let vertical = false;
export let reversed = false;
export let hoverable = true;
export let disabled = false;
export let pipstep = void 0;
export let all = true;
export let first = void 0;
export let last = void 0;
export let rest = void 0;
export let prefix = "";
export let suffix = "";
export let formatter = (v, i, p) => v;
export let precision = 2;
export let focus;
export let orientationStart;
export let moveHandle;
let clientStart = null;
$:
  stepMax = vertical ? 50 : 100;
$:
  tooManyPips = (max - min) / step >= stepMax;
$:
  stepDivisor = vertical ? 10 : 20;
$:
  reducedSteps = (max - min) / stepDivisor;
$:
  pipStep = pipstep ?? (tooManyPips ? reducedSteps : 1);
$:
  pipCount = Math.floor((max - min) / (step * pipStep));
function labelDown(event) {
  clientStart = normalisedClient(event);
}
function labelUp(pipValue, event) {
  const clientEnd = normalisedClient(event);
  if (!disabled && clientStart) {
    const distanceMoved = Math.sqrt(
      Math.pow(clientStart.x - clientEnd.x, 2) + Math.pow(clientStart.y - clientEnd.y, 2)
    );
    if (distanceMoved <= 5) {
      moveHandle(null, pipValue);
    }
    clientStart = null;
  }
}
</script>

<div class="rangePips" class:disabled class:hoverable class:vertical class:reversed class:focus>
  {#if (all && first !== false) || first}
    <span
      class="pip first"
      class:selected={isSelected(min, values, precision)}
      class:in-range={isInRange(min, values, range)}
      style="{orientationStart}: 0%;"
      on:pointerdown={(e) => {
        labelDown(e);
      }}
      on:pointerup={(e) => {
        labelUp(min, e);
      }}
    >
      {#if all === 'label' || first === 'label'}
        <span class="pipVal">
          {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{@html formatter(
            coerceFloat(min),
            0,
            0
          )}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
        </span>
      {/if}
    </span>
  {/if}

  {#if (all && rest !== false) || rest}
    {#each Array(pipCount + 1) as _, i}
      {#if getValueFromIndex(i, min, max, pipStep, step) !== min && getValueFromIndex(i, min, max, pipStep, step) !== max}
        <span
          class="pip"
          class:selected={isSelected(
            getValueFromIndex(i, min, max, pipStep, step),
            values,
            precision
          )}
          class:in-range={isInRange(getValueFromIndex(i, min, max, pipStep, step), values, range)}
          style="{orientationStart}: {valueAsPercent(
            getValueFromIndex(i, min, max, pipStep, step),
            min,
            max
          )}%;"
          on:pointerdown={(e) => {
            labelDown(e);
          }}
          on:pointerup={(e) => {
            labelUp(getValueFromIndex(i, min, max, pipStep, step), e);
          }}
        >
          {#if all === 'label' || rest === 'label'}
            <span class="pipVal">
              {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{@html formatter(
                getValueFromIndex(i, min, max, pipStep, step),
                i,
                valueAsPercent(getValueFromIndex(i, min, max, pipStep, step), min, max, precision)
              )}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
            </span>
          {/if}
        </span>
      {/if}
    {/each}
  {/if}

  {#if (all && last !== false) || last}
    <span
      class="pip last"
      class:selected={isSelected(max, values, precision)}
      class:in-range={isInRange(max, values, range)}
      style="{orientationStart}: 100%;"
      on:pointerdown={(e) => {
        labelDown(e);
      }}
      on:pointerup={(e) => {
        labelUp(max, e);
      }}
    >
      {#if all === 'label' || last === 'label'}
        <span class="pipVal">
          {#if prefix}<span class="pipVal-prefix">{prefix}</span>{/if}{@html formatter(
            coerceFloat(max),
            pipCount,
            100
          )}{#if suffix}<span class="pipVal-suffix">{suffix}</span>{/if}
        </span>
      {/if}
    </span>
  {/if}
</div>
