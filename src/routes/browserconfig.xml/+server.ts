import type { RequestHandler } from '@sveltejs/kit';

import { siteConfig } from '$lib/config/site';

export const prerender = true;

const browserConfigIcon = Object.entries(siteConfig.icon.msTile)
  .map(([key, value]) => `<${value}${key}logo src="/icons/mstile-${key}.png" />`)
  .join('\n\t\t\t');

const browserConfigContent = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      ${browserConfigIcon}
      <TileColor>${siteConfig.themeColor}</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

export const GET: RequestHandler = () =>
  new Response(browserConfigContent, {
    headers: {
      'Content-Type': 'application/browserconfig+xml; charset=utf-8'
    }
  });
