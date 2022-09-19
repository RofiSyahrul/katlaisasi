import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const forward = url.searchParams.get('forward');
  if (!forward) throw redirect(303, '/');

  try {
    const response = await fetch(forward).then((res) => res.text());
    return new Response(response, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error(`FAILED to create a proxy to ${forward}. Error: ${error}`);
    throw redirect(303, '/');
  }
};
