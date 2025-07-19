import { useEffect } from 'react'

export default function useScroll (onScroll) {
  useEffect(() => {
    const handleScroll = () => {
        if (onScroll) {
            onScroll(window.scrollY);
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll]);
};