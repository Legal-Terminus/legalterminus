import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * A Back action that returns to where the user actually came from.
 *
 * #208: the matter page's Back button was `navigate('/tasks')`, so opening a
 * matter from a report, the dashboard, a client's page, a notification or search
 * and pressing Back always landed on All Matters — the context was lost.
 *
 * React Router gives the entry a session opened on the key `'default'`. Any
 * other key means the user navigated here inside the app, so there is a real
 * previous page to go back to. When there is none (a pasted link, a new tab, a
 * refresh on a cold session) `navigate(-1)` would leave the app or do nothing,
 * so the caller's fallback is used instead.
 */
export function useGoBack(fallback: string) {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(() => {
    if (location.key !== 'default') navigate(-1);
    else navigate(fallback);
  }, [navigate, location.key, fallback]);
}
