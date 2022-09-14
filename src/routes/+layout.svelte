<script lang="ts">
  import '../app.css';

  import { page } from '$app/stores';
  import { createPortal } from '$lib/actions/portal';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import Header from '$lib/header/Header.svelte';
  import { theme, userName } from '$lib/stores';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $theme = data.initialTheme;
  $userName = data.userName;

  let description: string,
    image = data.seo.image,
    keyword = data.seo.keyword,
    shouldBlockSearchIndex: boolean | undefined,
    title: string;

  $: {
    ({ description, title, shouldBlockSearchIndex } = $page.data.seo);

    if (!title) {
      title = data.seo.title;
    } else if (title !== data.seo.title && !title.endsWith(`| ${data.seo.title}`)) {
      title = `${title} | ${data.seo.title}`;
    }

    if (!description) {
      description = data.seo.description;
    }

    if ($page.data.seo.image) {
      image = $page.data.seo.image;
    }

    if ($page.data.seo.keyword) {
      keyword = $page.data.seo.keyword;
    }
  }
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' : $theme} />
  <link rel="stylesheet" href={`/theme/${$theme}.css`} />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:creator" content="@RofiSyahrul" />

  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta name="twitter:title" content={title} />

  <link rel="canonical" href={$page.url.href} />
  <meta name="og:url" content={$page.url.href} />

  <meta name="description" content={description} />
  <meta property="og:description" content={description} />
  <meta name="twitter:description" content={description} />

  <meta property="og:image" content={image} />
  <meta name="twitter:image" content={image} />

  <meta name="keywords" content={keyword} />

  {#if shouldBlockSearchIndex}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

<ThemeSwitcher />
<Header />

<main>
  <slot />
</main>

<div use:createPortal />

<style>
  main {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    height: calc(100vh - 48px);
    max-width: 1024px;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
