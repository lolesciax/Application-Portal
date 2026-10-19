import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
export default function ModuleScrollRestoration() {
 const { pathname } = useLocation();
 const previous = useRef(pathname);
 useEffect(() => {
  if (previous.current !== pathname) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  previous.current = pathname;
 }, [pathname]);
 return null;
}
