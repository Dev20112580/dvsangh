import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title ? `${title} | DVS NGO` : 'Dronacharya Vidyarthi Sangh (DVS) NGO';
    
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
}
