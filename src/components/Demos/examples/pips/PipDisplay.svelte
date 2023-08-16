<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [50];
  let all: boolean = true;
  let first: boolean = false;
  let last: boolean = false;
  let rest: boolean = false;
  
  let grp_all: 'pip'|'false'|'label' = 'pip';
  let grp_first: 'pip'|'false'|'label' = 'pip';
  let grp_last: 'pip'|'false'|'label' = 'pip';
  let grp_rest: 'pip'|'false'|'label' = 'pip';

  const groupValue = (value: string) : false | string => {
    return (value === 'false') ? false : value;
  }

  const propValue = (value: string) : string => {
    return value === 'false' ? '{false}' : '"' + value + '"';
  }

  $: new_first = groupValue( grp_first );
  $: new_last = groupValue( grp_last );
  $: new_rest = groupValue( grp_rest );
  $: new_all = groupValue( grp_all );

  const handleRadio = function(e: Event) {
    if( e.target ) {
      e.target.closest('.column').querySelectorAll('input[type="checkbox"]').forEach((el: HTMLInputElement) => {
        el.checked = true;
        el.dispatchEvent(new Event('change'));
      });
    }
  }
</script>


<div data-grid>
  <div class='column'>
    <input bind:checked={all} type='checkbox' name='all' id='chkAll'> 
    <label for='chkAll'>All</label>
    <div class="field">
      <div class="group">
        <div>
          <input type="radio" id="all_false" value="false" bind:group={grp_all} on:change={(e) => handleRadio(e)}>
          <label for="all_false"><code>{false}</code></label>
        </div>
        <div>
          <input type="radio" id="all_pip" value="pip" bind:group={grp_all} on:change={(e) => handleRadio(e)}>
          <label for="all_pip"><code>"pip"</code></label>
        </div>
        <div>
          <input type="radio" id="all_label" value="label" bind:group={grp_all} on:change={(e) => handleRadio(e)}>
          <label for="all_label"><code>"label"</code></label>
        </div>
      </div>
    </div>
  </div>
  <div class='column'>
    <input bind:checked={first} type='checkbox' name='first' id='chkFirst'> 
    <label for='chkFirst'>First</label>
    <div class="field">
      <div class="group">
        <div>
          <input type="radio" id="first_false" value="false" bind:group={grp_first} on:change={(e) => handleRadio(e)}>
          <label for="first_false"><code>{false}</code></label>
        </div>
        <div>
          <input type="radio" id="first_pip" value="pip" bind:group={grp_first} on:change={(e) => handleRadio(e)}>
          <label for="first_pip"><code>"pip"</code></label>
        </div>
        <div>
          <input type="radio" id="first_label" value="label" bind:group={grp_first} on:change={(e) => handleRadio(e)}>
          <label for="first_label"><code>"label"</code></label>
        </div>
      </div>
    </div>
  </div>
  <div class='column'>
    <input bind:checked={last} type='checkbox' name='last' id='chkLast'> 
    <label for='chkLast'>Last</label>
    <div class="field">
      <div class="group">
        <div>
          <input type="radio" id="last_false" value="false" bind:group={grp_last} on:change={(e) => handleRadio(e)}>
          <label for="last_false"><code>{false}</code></label>
        </div>
        <div>
          <input type="radio" id="last_pip" value="pip" bind:group={grp_last} on:change={(e) => handleRadio(e)}>
          <label for="last_pip"><code>"pip"</code></label>
        </div>
        <div>
          <input type="radio" id="last_label" value="label" bind:group={grp_last} on:change={(e) => handleRadio(e)}>
          <label for="last_label"><code>"label"</code></label>
        </div>
      </div>
    </div>
  </div>
  <div class='column'>
    <input bind:checked={rest} type='checkbox' name='rest' id='chkRest'> 
    <label for='chkRest'>Rest</label>
    <div class="field">
      <div class="group">
        <div>
          <input type="radio" id="rest_false" value="false" bind:group={grp_rest} on:change={(e) => handleRadio(e)}>
          <label for="rest_false"><code>{false}</code></label>
        </div>
        <div>
          <input type="radio" id="rest_pip" value="pip" bind:group={grp_rest} on:change={(e) => handleRadio(e)}>
          <label for="rest_pip"><code>"pip"</code></label>
        </div>
        <div>
          <input type="radio" id="rest_label" value="label" bind:group={grp_rest} on:change={(e) => handleRadio(e)}>
          <label for="rest_label"><code>"label"</code></label>
        </div>
      </div>
    </div>
  </div>
</div>

{#if all && first && last && rest}
  <RangeSlider pips bind:all={new_all} bind:first={new_first} bind:last={new_last} bind:rest={new_rest} bind:values />
{:else if all && first && last}
  <RangeSlider pips bind:all={new_all} bind:first={new_first} bind:last={new_last} bind:values />
{:else if all && first && rest}
  <RangeSlider pips bind:all={new_all} bind:first={new_first} bind:rest={new_rest} bind:values />
{:else if all && last && rest}
  <RangeSlider pips bind:all={new_all} bind:last={new_last} bind:rest={new_rest} bind:values />
{:else if first && last && rest}
  <RangeSlider pips bind:first={new_first} bind:last={new_last} bind:rest={new_rest} bind:values />
{:else if all && first}
  <RangeSlider pips bind:all={new_all} bind:first={new_first} bind:values />
{:else if all && last}
  <RangeSlider pips bind:all={new_all} bind:last={new_last} bind:values />
{:else if all && rest}
  <RangeSlider pips bind:all={new_all} bind:rest={new_rest} bind:values />
{:else if first && last}
  <RangeSlider pips bind:first={new_first} bind:last={new_last} bind:values />
{:else if first && rest}
  <RangeSlider pips bind:first={new_first} bind:rest={new_rest} bind:values />
{:else if last && rest}
  <RangeSlider pips bind:last={new_last} bind:rest={new_rest} bind:values />
{:else if all}
  <RangeSlider pips bind:all={new_all} bind:values />
{:else if first}
  <RangeSlider pips bind:first={new_first} bind:values />
{:else if last}
  <RangeSlider pips bind:last={new_last} bind:values />
{:else if rest}
  <RangeSlider pips bind:rest={new_rest} bind:values />
{:else}
  <RangeSlider pips bind:values />
{/if}


<pre>
{#if all && first && last && rest}
{`<RangeSlider pips all=${propValue(grp_all)} first=${propValue(grp_first)} last=${propValue(grp_last)} rest=${propValue(grp_rest)} />`}
{:else if all && first && last}
{`<RangeSlider pips all=${propValue(grp_all)} first=${propValue(grp_first)} last=${propValue(grp_last)} />`}
{:else if all && first && rest}
{`<RangeSlider pips all=${propValue(grp_all)} first=${propValue(grp_first)} rest=${propValue(grp_rest)} />`}
{:else if all && last && rest}
{`<RangeSlider pips all=${propValue(grp_all)} last=${propValue(grp_last)} rest=${propValue(grp_rest)} />`}
{:else if first && last && rest}
{`<RangeSlider pips first=${propValue(grp_first)} last=${propValue(grp_last)} rest=${propValue(grp_rest)} />`}
{:else if all && first}
{`<RangeSlider pips all=${propValue(grp_all)} first=${propValue(grp_first)} />`}
{:else if all && last}
{`<RangeSlider pips all=${propValue(grp_all)} last=${propValue(grp_last)} />`}
{:else if all && rest}
{`<RangeSlider pips all=${propValue(grp_all)} rest=${propValue(grp_rest)} />`}
{:else if first && last}
{`<RangeSlider pips first=${propValue(grp_first)} last=${propValue(grp_last)} />`}
{:else if first && rest}
{`<RangeSlider pips first=${propValue(grp_first)} rest=${propValue(grp_rest)} />`}
{:else if last && rest}
{`<RangeSlider pips last=${propValue(grp_last)} rest=${propValue(grp_rest)} />`}
{:else if all}
{`<RangeSlider pips all=${propValue(grp_all)} />`}
{:else if first}
{`<RangeSlider pips first=${propValue(grp_first)} />`}
{:else if last}
{`<RangeSlider pips last=${propValue(grp_last)} />`}
{:else if rest}
{`<RangeSlider pips rest=${propValue(grp_rest)} />`}
{:else}
{`<RangeSlider pips />`}
{/if}
</pre>

<style hide>

  [data-grid] {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1rem;
    justify-items: start;
    margin: 2rem 0;
  }
  [data-grid] .group {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap: .5em
  }
  [data-grid] .group > div {
    display: flex;
    align-items: center;
    gap: .5em
  }

</style>

<code data-values title="The output slider values">{values}</code>