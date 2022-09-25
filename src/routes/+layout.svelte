<script lang="ts" context="module">
  const appleIconSizes = ['152', '144', '120', '114', '76', '72', '60', '57'];

  function loadScript(params: { partytown?: boolean; src?: string; script?: string }): string {
    const partytownType = params.partytown ? ' type="text/partytown"' : '';
    if (params.script) {
      return `<scr` + `ipt${partytownType}>${params.script}</scr` + `ipt>`;
    }

    if (params.src) {
      return `<scr` + `ipt src="${params.src}"${partytownType}></scr` + `ipt>`;
    }

    return '';
  }

  function loadScripts(...args: Parameters<typeof loadScript>[0][]): string {
    return args.map(loadScript).join('\n');
  }

  function convertToSingleLine(value: string): string {
    return value.replace(/(\n|\t)/g, '');
  }
</script>

<script lang="ts">
  import '../app.css';

  import { partytownSnippet } from '@builder.io/partytown/integration';

  import { dev } from '$app/environment';
  import { page } from '$app/stores';
  import { PUBLIC_GA4_ID } from '$env/static/public';
  import { createPortal } from '$lib/actions/portal';
  import Header from '$lib/components/Header.svelte';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import { siteConfig } from '$lib/config/site';
  import { theme, userName } from '$lib/stores';
  import { darkStyles, lightStyles, systemStyles } from '$lib/theme/styles';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $theme = data.initialTheme;
  $userName = data.userName;

  const partytown = partytownSnippet({
    debug: dev,
    forward: ['dataLayer.push', '__tag_assistant_forwarder'],
    resolveUrl(url, location) {
      if (url.host === 'www.googletagmanager.com' && url.pathname.startsWith('/debug')) {
        const resolvedURL = new URL(
          `/proxy?forward=${encodeURIComponent(url.href)}`,
          location.href
        );
        return resolvedURL;
      }
      return url;
    }
  });

  const msImageSizes = Object.keys(siteConfig.icon.msTile);

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

  let styles = '';
  $: switch ($theme) {
    case 'dark':
      styles = convertToSingleLine(darkStyles);
      break;
    case 'light':
      styles = convertToSingleLine(lightStyles);
      break;
    default:
      styles = convertToSingleLine(systemStyles);
      break;
  }
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' : $theme} />
  <svelte:element this="style" data-theme={$theme}>
    {styles}
  </svelte:element>

  {#each appleIconSizes as size (size)}
    <link
      rel="apple-touch-icon"
      sizes={`${size}x${size}`}
      href={`/icons/apple-touch-icon-${size}x${size}.png`}
    />
  {/each}

  <link rel="mask-icon" href="/icons/savari-pinned-tab.svg" color={siteConfig.themeColor} />
  <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
  <meta name="application-name" content={siteConfig.name} />
  <meta name="msapplication-navbutton-color" content={siteConfig.themeColor} />
  <meta name="msapplication-TileColor" content={siteConfig.backgroundColor} />
  <meta name="theme-color" content={siteConfig.themeColor} />

  {#each msImageSizes as size (size)}
    <meta name="msapplication-TileImage" content={`/icons/mstile-${size}.png`} />
  {/each}

  <title>{title}</title>
  <meta property="og:title" content={title} />
  <meta name="twitter:title" content={title} />

  <link rel="canonical" href={$page.url.href} />
  <meta property="og:url" content={$page.url.href} />
  <meta name="twitter:url" content={$page.url.href} />

  <meta name="description" content={description} />
  <meta property="og:description" content={description} />
  <meta name="twitter:description" content={description} />

  <meta property="og:image" content={image} />
  <meta name="twitter:image" content={image} />

  <meta name="keywords" content={keyword} />

  {#if shouldBlockSearchIndex}
    <meta name="robots" content="noindex" />
  {/if}

  {@html loadScripts(
    { script: partytown },
    { partytown: true, src: `https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GA4_ID}` },
    {
      partytown: true,
      script:
        `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}` +
        `gtag('js', new Date()); gtag('config', '${PUBLIC_GA4_ID}');`
    }
  )}
</svelte:head>

<Header />

<main class:room-page={$page.url.pathname.startsWith('/ruangan/')}>
  <slot />
</main>

<ThemeSwitcher />

<div use:createPortal />

<style>
  main {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 2000px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  main.room-page {
    height: calc(100vh - 48px);
  }

  @media (max-width: 450px) {
    main.room-page {
      height: 100vh;
    }
  }
</style>
