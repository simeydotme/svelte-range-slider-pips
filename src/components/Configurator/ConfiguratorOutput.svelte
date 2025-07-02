<script lang="ts">
  import { slide } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import "./configurator.css";

  let className: string = "";
  export { className as class };
  export let outputPropsHtml: Promise<{ outputCode: string; outputSource: string }> | undefined;

  let didCopy = false;
  let copyTimer: NodeJS.Timeout;

  function copyToClipboard(text: string) {
    copyTimer && clearTimeout(copyTimer);
    navigator.clipboard.writeText(text);
    didCopy = true;
    copyTimer = setTimeout(() => {
      didCopy = false;
    }, 2000);
  }

  let visibleOutput = "";
  let visibleSource = "";
  $: outputPropsHtml &&
    outputPropsHtml.then(({ outputCode, outputSource }) => {
      visibleOutput = outputCode;
      visibleSource = outputSource;
    });
</script>

<div class="configurator-output {className}">
  {@html visibleOutput}
  <div class="copy-button-container">
    <button type="button" on:click={() => copyToClipboard(visibleSource)} class="copy-button" title="Copy to clipboard">
      <Icon icon="tabler:copy" /><span class="sr-only">Copy</span>
    </button>
    {#if didCopy}
      <span class="copy-success" transition:slide={{ duration: 200, axis: "x" }}>Copied!</span>
    {/if}
  </div>
</div>

<style>
  .configurator-output {
    display: grid;
    background: #24292e;
    border-radius: 0 0 1rem 1rem;
    padding: 1rem 1rem 0.5rem;
    min-height: 300px;
  }

  .configurator-output :global(pre) {
    padding: 0.5rem 3rem 1rem 0;
    overflow: auto;
    max-height: 450px;
    min-height: 300px;
    border-radius: 0 0 1rem 1rem;
    scrollbar-width: thin;
    scrollbar-color: hsla(var(--color-base-code-block), 30%, 1) hsla(var(--color-base-code-block), 24%, 1);
  }

  .configurator-output:has(.copy-button) {
    position: relative;
  }

  .configurator-output .copy-button-container {
    position: absolute;
    top: -1.5em;
    right: 1em;
    width: 200px;
    display: flex;
    gap: 0.5em;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: end;
  }

  .configurator-output .copy-button {
    background: #2c2c2c;
    border: none;
    padding: 0.75em 1em;
    color: white;
    border-radius: 0.5rem;
    transition: all 0.2s ease-in-out;
  }

  .configurator-output .copy-button {
    opacity: 0.33;
  }
  .configurator-output:hover .copy-button {
    opacity: 0.66;
    background: #414141;
  }
  .configurator-output:hover .copy-button:hover {
    opacity: 1;
  }

  .copy-success {
    padding: 0.5em 1rem;
    background: #414141;
    color: white;
    font-size: 0.75rem;
    border-radius: 0.25rem;
  }
</style>
