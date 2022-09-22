import type { RequestHandler } from '@sveltejs/kit';

import { siteConfig } from '$lib/config/site';

export const prerender = true;

const mainIcons = siteConfig.icon.main.map((size) => ({
  sizes: size,
  src: `/icons/android-chrome-${size}.png`,
  type: 'image/png'
}));

const maskableIcons = siteConfig.icon.maskable.map((size) => ({
  purpose: 'maskable',
  sizes: `${size}x${size}`,
  src: `/icons/manifest-icon-${size}.png`,
  type: 'image/png'
}));

const manifest = {
  background_color: siteConfig.backgroundColor,
  description: siteConfig.description,
  display: 'standalone',
  icons: mainIcons.concat(maskableIcons),
  name: siteConfig.name,
  orientation: 'portrait',
  scope: '/',
  short_name: siteConfig.name,
  start_url: '/',
  theme_color: siteConfig.themeColor
};

export const GET: RequestHandler = () =>
  new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8'
    }
  });
