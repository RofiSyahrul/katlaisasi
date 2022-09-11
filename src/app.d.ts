// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface SEOMeta {
    description: string;
    image?: string;
    keyword?: string;
    shouldBlockSearchIndex?: boolean;
    title: string;
  }

  interface Locals {
    userid: string;
  }

  interface PageData {
    initialTheme?: Theme;
    seo: SEOMeta;
  }

  // interface PageError {}

  // interface Platform {}
}

type Theme = 'dark' | 'light' | 'system';
