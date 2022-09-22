import type { SnackbarVariant } from './Snackbar.svelte';
import Snackbar from './Snackbar.svelte';

interface SnackbarProps {
  duration?: number;
  message: string;
  variant?: SnackbarVariant;
}

export function showSnackbar(props: string | SnackbarProps) {
  const snackbarProps: SnackbarProps = typeof props === 'string' ? { message: props } : props;
  const snackbar = new Snackbar({
    target: document.body,
    props: snackbarProps,
    intro: true
  });

  return snackbar;
}
