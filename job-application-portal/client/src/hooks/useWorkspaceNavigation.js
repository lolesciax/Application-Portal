import { useEffect, useRef, useState } from 'react';

export const SIDEBAR_MIN = 244;
export const SIDEBAR_MAX = 336;
const DEFAULT_WIDTH = 264;
const clamp = width => Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, width));

function initialWidth(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw.trim() === '') return DEFAULT_WIDTH;
    const stored = Number(raw);
    // Bring widths saved by older versions into the new safe range rather than
    // discarding a user's preference or letting a too-narrow sidebar persist.
    return Number.isFinite(stored) && stored > 0 ? clamp(stored) : DEFAULT_WIDTH;
  } catch {
    return DEFAULT_WIDTH;
  }
}

/** Shared, responsive and keyboard-accessible navigation for both portal roles. */
export default function useWorkspaceNavigation(pathname, storageKey) {
  const [sidebarWidth, setSidebarWidth] = useState(() => initialWidth(storageKey));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resizing, setResizing] = useState(false);
  const resizeStart = useRef(null);
  const menuButton = useRef(null);
  const sidebarRef = useRef(null);
  const touchStart = useRef(null);

  useEffect(() => {
    try { window.localStorage.setItem(storageKey, String(sidebarWidth)); } catch { /* optional persistence */ }
  }, [sidebarWidth, storageKey]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth > 960) setMobileOpen(false);
    };
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    if (!resizing) return undefined;
    const move = event => {
      if (resizeStart.current) setSidebarWidth(clamp(resizeStart.current.width + event.clientX - resizeStart.current.x));
    };
    const stop = () => { resizeStart.current = null; setResizing(false); };
    const userSelect = document.body.style.userSelect;
    const cursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    window.addEventListener('blur', stop);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
      window.removeEventListener('blur', stop);
      document.body.style.userSelect = userSelect;
      document.body.style.cursor = cursor;
    };
  }, [resizing]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const lastFocused = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sidebarRef.current?.querySelector('.sidebar-link')?.focus();
    const handleKeydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); setMobileOpen(false); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...(sidebarRef.current?.querySelectorAll('a[href], button:not([disabled])') || [])]
        .filter(element => element.getClientRects().length > 0);
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) {
        event.preventDefault(); focusable[focusable.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
        event.preventDefault(); focusable[0].focus();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = overflow;
      if (lastFocused?.isConnected) lastFocused.focus({ preventScroll: true });
      else menuButton.current?.focus({ preventScroll: true });
    };
  }, [mobileOpen]);

  const startResizing = event => {
    if (event.button !== 0) return;
    event.preventDefault();
    resizeStart.current = { x: event.clientX, width: sidebarWidth };
    setResizing(true);
  };

  const resizeFromKeyboard = event => {
    let width;
    if (event.key === 'ArrowLeft') width = sidebarWidth - 16;
    else if (event.key === 'ArrowRight') width = sidebarWidth + 16;
    else if (event.key === 'Home') width = SIDEBAR_MIN;
    else if (event.key === 'End') width = SIDEBAR_MAX;
    else return;
    event.preventDefault();
    setSidebarWidth(clamp(width));
  };

  const onDrawerTouchStart = event => {
    const touch = event.touches[0];
    if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onDrawerTouchEnd = event => {
    const start = touchStart.current;
    const end = event.changedTouches[0];
    touchStart.current = null;
    if (start && end && start.x - end.clientX > 75 && Math.abs(start.y - end.clientY) < 70) setMobileOpen(false);
  };

  return {
    sidebarWidth, mobileOpen, setMobileOpen, resizing, menuButton, sidebarRef,
    startResizing, resizeFromKeyboard, onDrawerTouchStart, onDrawerTouchEnd
  };
}
