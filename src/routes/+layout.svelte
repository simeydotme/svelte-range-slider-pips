<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300,400,600&display=swap"
    rel="stylesheet"
  />
  <style>
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
    table {
      width: 100%;
    }
    header {
      position: sticky;
      top: 0;
      padding: 20px;
      background: white;
      z-index: 100;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    h1,
    h2,
    h3,
    h4,
    h5 {
      margin-top: 1em;
      font-weight: 400;
    }
    h4 {
      margin-top: 2em;
      font-weight: 600;
    }
    main {
      display: flex;
      justify-content: center;
      max-width: calc(100% - 40px);
      width: 1024px;
      margin: 100px auto;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
  </style>
</svelte:head>

<slot />
