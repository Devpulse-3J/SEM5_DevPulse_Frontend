"use client";

import { useSyncExternalStore } from "react";

/** Nothing ever changes, so the subscribe callback never has to fire. */
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` during SSR and on the client's first (hydration) render, `true` on
 * every render after that.
 *
 * Why this exists: session state lives in `localStorage`, so any helper that
 * reads it (`hasValidSession`, `getToken`) returns `false`/`null` on the server
 * and the real value on the client. Branching the rendered tree on such a value
 * makes the hydration HTML disagree with the server HTML, and React throws away
 * the whole subtree. Gating on this hook keeps the first client render
 * identical to the server's, then re-renders once with the truth.
 *
 * `useSyncExternalStore` is used rather than a `useState`/`useEffect` flag
 * because React guarantees the server snapshot is what hydration renders.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
