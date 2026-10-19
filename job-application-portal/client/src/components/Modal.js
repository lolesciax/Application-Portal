import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ title, labelledBy, describedBy, onClose, children, dismissible = true, className = '' }) {
  const dialog = useRef(null);
  const pointerStartedOnBackdrop = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    element.querySelector('[data-modal-autofocus]')?.focus({ preventScroll: true });
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const outside = event => {
    const bounds = dialog.current.getBoundingClientRect();
    return event.target === dialog.current &&
      (event.clientX < bounds.left || event.clientX > bounds.right ||
       event.clientY < bounds.top || event.clientY > bounds.bottom);
  };

  return createPortal(
    <dialog ref={dialog} className={`portal-modal modal ${className}`}
      aria-label={labelledBy ? undefined : title} aria-labelledby={labelledBy} aria-describedby={describedBy}
      onCancel={event => { event.preventDefault(); if (dismissible) onClose(); }}
      onPointerDown={event => { pointerStartedOnBackdrop.current = outside(event); }}
      onClick={event => {
        if (dismissible && pointerStartedOnBackdrop.current && outside(event)) onClose();
        pointerStartedOnBackdrop.current = false;
      }}>
      {children}
    </dialog>, document.body,
  );
}
