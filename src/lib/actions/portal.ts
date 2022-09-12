import { tick } from 'svelte';
import type { ActionReturn } from 'svelte/action';

type PortalID = 'popup';
type PortalKey = `$$portal.${PortalID}`;

const portalMap = new Map<PortalKey, HTMLElement>();

export function createPortal(node: HTMLElement, id: PortalID = 'popup'): ActionReturn {
  const key: PortalKey = `$$portal.${id}`;
  if (portalMap.has(key)) throw `Duplicate portal key ${id}`;

  portalMap.set(key, node);
  return {
    destroy: portalMap.delete.bind(portalMap, key)
  };
}

function mount(node: HTMLElement, key: PortalKey) {
  if (!portalMap.has(key)) throw `Unknown portal key ${key}`;

  const host = portalMap.get(key);
  host?.insertBefore(node, null);

  return () => host?.contains(node) && host.removeChild(node);
}

export function portal(node: HTMLElement, id: PortalID = 'popup'): ActionReturn {
  let destroy: () => void;
  const key: PortalKey = `$$portal.${id}`;

  if (!portalMap.has(key)) {
    tick().then(() => (destroy = mount(node, key)));
  } else {
    destroy = mount(node, key);
  }

  return {
    destroy: () => destroy?.()
  };
}
