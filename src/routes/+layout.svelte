<script>
  import './barebones.css';
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.bunny.net" />
  <link href="https://fonts.bunny.net/css?family=palanquin:100,200,300,400,500,600,700" rel="stylesheet" />
  <style>
    @layer barebones, ui, sliders;

    @layer ui {
      main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: calc(100% - 60px);
        width: 1000px;
        margin: 3rem auto;
        padding: 0;
      }
      main > * {
        width: 100%;
      }
      .content {
        display: flex;
        flex-direction: column;
        gap: 1em;
        width: 100%;
      }
      header {
        position: fixed;
        inset: 0;
        bottom: auto;
        padding: 1rem;
        background: white;
        z-index: 100;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1,
      h2,
      h3,
      h4,
      h5 {
        font-family: 'Palanquin', sans-serif;
        margin-block: 3rem;
        font-weight: 500;
      }
      h4 {
        font-weight: 600;
      }
      h1,
      h2,
      h3,
      h4,
      h5 {
        & em {
          font-weight: 300;
        }
      }
      table {
        width: 100%;
      }
    }

    @layer sliders {
      #test-id {
        --range-slider: #9dceff;
        --range-handle: rgb(245, 200, 230);
        --range-handle-inactive: rgb(245, 200, 230);
        --range-handle-focus: rgb(245, 0, 46);
      }
      #test-id [data-handle='1'] {
        --handle: #a0ffe0;
        --handle-inactive: var(--handle);
        --handle-border: var(--handle);
        --handle-focus: turquoise;
      }
      #test-id [data-handle='2'] {
        --handle: #fdcebd;
        --handle-inactive: var(--handle);
        --handle-border: var(--handle);
        --handle-focus: coral;
      }
      #clr-test {
        --range-slider: rgb(195, 228, 222);
        --range-handle-inactive: rgb(81, 185, 180);
        --range-handle: rgb(81, 185, 180);
        --range-handle-focus: rgb(35, 241, 214);
        --range-float-text: darkcyan;
        --pip: #eee;
        --pip-text: #aaa;
        --pip-active: black;
        --pip-active-text: darkcyan;
      }
      #limit-test {
        --range-range-limit: red;
      }
    }
  </style>
</svelte:head>

<main>
  <slot />
</main>
