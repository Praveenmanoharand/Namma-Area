import React, { createContext, useContext, useState, useEffect } from 'react';

export type RoutePath = 
  | '/'
  | '/login'
  | '/register'
  | '/dashboard'
  | '/create'
  | '/complaints'
  | '/profile'
  | '/success'
  | string; // For dynamic paths like /complaints/123

interface RouterContextType {
  path: RoutePath;
  navigateTo: (path: RoutePath) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Parse initial path from hash
  const getHashPath = (): RoutePath => {
    const hash = window.location.hash;
    if (!hash || hash === '#') return '/';
    return hash.replace('#', '') as RoutePath;
  };

  const [path, setPath] = useState<RoutePath>(getHashPath());
  const [historyStack, setHistoryStack] = useState<RoutePath[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      const newPath = getHashPath();
      setPath(newPath);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateTo = (newPath: RoutePath) => {
    setHistoryStack((prev) => [...prev, path]);
    window.location.hash = newPath;
    setPath(newPath);
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prevPath = historyStack[historyStack.length - 1];
      setHistoryStack((prev) => prev.slice(0, -1));
      window.location.hash = prevPath;
      setPath(prevPath);
    } else {
      navigateTo('/');
    }
  };

  return (
    <RouterContext.Provider value={{ path, navigateTo, goBack }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

// Reusable custom Link component that acts exactly like Next.js Link
export const Link: React.FC<{
  href: RoutePath;
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ href, children, className, id }) => {
  const { navigateTo } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo(href);
  };

  return (
    <a href={`#${href}`} onClick={handleClick} className={className} id={id}>
      {children}
    </a>
  );
};
