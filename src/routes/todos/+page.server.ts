import { error } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';
import { api } from './api';

type Todo = {
  uid: string;
  created_at: Date;
  text: string;
  done: boolean;
  pending_delete: boolean;
};

export const load: PageServerLoad = async ({ locals }) => {
  // locals.userid comes from src/hooks.js
  const response = await api('GET', `todos/${locals.userid}`);
  const seo: App.SEOMeta = {
    description: 'A todo list app',
    title: 'Todos'
  };

  if (response.status === 404) {
    // user hasn't created a todo list.
    // start with an empty array
    return {
      seo,
      todos: [] as Todo[]
    };
  }

  if (response.status === 200) {
    return {
      seo,
      todos: (await response.json()) as Todo[]
    };
  }

  throw error(response.status);
};

export const actions: Actions = {
  add: async ({ request, locals }) => {
    const form = await request.formData();

    await api('POST', `todos/${locals.userid}`, {
      text: form.get('text')
    });
  },
  edit: async ({ request, locals }) => {
    const form = await request.formData();

    await api('PATCH', `todos/${locals.userid}/${form.get('uid')}`, {
      text: form.get('text')
    });
  },
  toggle: async ({ request, locals }) => {
    const form = await request.formData();

    await api('PATCH', `todos/${locals.userid}/${form.get('uid')}`, {
      done: !!form.get('done')
    });
  },
  delete: async ({ request, locals }) => {
    const form = await request.formData();

    await api('DELETE', `todos/${locals.userid}/${form.get('uid')}`);
  }
};
