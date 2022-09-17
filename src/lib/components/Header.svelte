<script lang="ts">
  import { page } from '$app/stores';

  $: isHomepage = $page.url.pathname === '/';
</script>

<header class:hideable-xs={$page.url.pathname.startsWith('/ruangan/')}>
  <nav data-sveltekit-prefetch>
    <svg viewBox="0 0 2 3" aria-hidden="true" width="2em" height="3em">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <ul>
      <li class:active={isHomepage}>
        {#if isHomepage}
          <h1>KATLAISASI</h1>
        {:else}
          <a href="/">KATLAISASI</a>
        {/if}
      </li>
    </ul>
    <svg viewBox="0 0 2 3" aria-hidden="true" width="2em" height="3em">
      <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
    </svg>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: center;
  }

  nav {
    display: flex;
    justify-content: center;
    --background: rgba(255, 255, 255, 0.7);
  }

  svg {
    display: block;
  }

  path {
    fill: var(--background);
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
    flex: 1;
  }

  li.active::before {
    --size: 6px;
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color-primary-dim);
  }

  nav a,
  nav h1 {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1em;
    margin: 0;
    color: var(--heading-color);
    font-weight: 700;
    font-size: 2rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: var(--color-primary-dim);
  }

  @media (max-width: 600px) {
    svg {
      display: none;
    }

    ul {
      border-radius: 0 0 4px 4px;
    }

    nav a,
    nav h1 {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 450px) {
    header.hideable-xs {
      display: none;
    }
  }
</style>
