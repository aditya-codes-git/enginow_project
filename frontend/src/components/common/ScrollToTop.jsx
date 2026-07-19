import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Scroll to top on client-side PUSH or REPLACE navigations, 
    // but preserve native scroll on POP (initial load, refresh, and back/forward history)
    if (navType === 'PUSH' || navType === 'REPLACE') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }
  }, [pathname, navType]);

  return null;
}


