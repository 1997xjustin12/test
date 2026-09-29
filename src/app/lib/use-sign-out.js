"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Signs the visitor out, once, and always finishes.
 *
 * The three brands' logout pages differ only in styling, so the behaviour lives
 * here rather than three times over.
 *
 * What it used to do was wait for `loading`, `user`, `abandonedCartUser` and
 * `cartObject` before calling logout(). On this page those last three never
 * arrive: refreshAccessToken() deliberately skips /logout, so no access token
 * is set, so the profile is never fetched and `user` stays null — and it
 * returned without clearing `loading` either. The condition could not be met,
 * logout() was never called, and the page spun its spinner while the session
 * quietly survived. Every route to /logout is a full page load, because the
 * links interpolate an absolute BASE_URL, so the navbar behaved the same way.
 *
 * Now the only thing worth waiting for is `loading`. The cart is a courtesy
 * with a short grace period, and a failure to save it — or to reach the API at
 * all — never leaves anyone stuck on a spinner.
 */

/** How long to wait for the cart before signing out without saving it. */
const CART_GRACE_MS = 2000;

export function useSignOut(auth, cart) {
  const { user, logout, loading } = auth ?? {};
  const { cartObject, createAbandonedCart, abandonedCartUser } = cart ?? {};

  const router = useRouter();
  const started = useRef(false);
  const [failed, setFailed] = useState(false);
  const [graceOver, setGraceOver] = useState(false);

  useEffect(() => {
    if (loading) return undefined;
    const timer = setTimeout(() => setGraceOver(true), CART_GRACE_MS);
    return () => clearTimeout(timer);
  }, [loading]);

  const signOut = useCallback(async () => {
    setFailed(false);

    // Best effort. Recording the abandoned cart is a courtesy; signing out is
    // what was asked for, and a failure here must not keep anyone signed in.
    try {
      if (user && abandonedCartUser && cartObject) {
        await createAbandonedCart(cartObject, abandonedCartUser, "forced");
      }
    } catch (error) {
      console.error("[signOut] abandoned cart:", error);
    }

    try {
      const res = await logout();
      if (!res?.ok) {
        setFailed(true);
        return;
      }
    } catch (error) {
      console.error("[signOut]", error);
      setFailed(true);
      return;
    }

    // Root-relative: BASE_URL is an absolute address, and routing through it
    // turns an in-app redirect into a full page load — to the wrong origin
    // entirely wherever the env and the server disagree.
    router.replace("/login");
  }, [user, abandonedCartUser, cartObject, createAbandonedCart, logout, router]);

  useEffect(() => {
    if (loading || started.current) return;
    // Give the cart a moment, but only when there is a session whose cart could
    // still be on its way, and never longer than the grace period.
    const cartReady = Boolean(abandonedCartUser && cartObject);
    if (user && !cartReady && !graceOver) return;

    started.current = true;
    signOut();
  }, [loading, user, abandonedCartUser, cartObject, graceOver, signOut]);

  return { failed, retry: signOut };
}
