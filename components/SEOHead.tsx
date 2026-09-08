import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  schema?: object;
}

const SEOHead: React.FC<SEOProps> = ({ title, description, schema }) => {
  useEffect(() => {
    // Update Title
    document.title = `${title} | RIC Shoe Care`;
    
    // Update Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      // Truncate description if too long for SEO best practices
      const safeDesc = description.length > 160 ? description.substring(0, 157) + '...' : description;
      metaDesc.setAttribute('content', safeDesc);
      
      // Update Open Graph Description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', safeDesc);
      }
    }

    // Add Schema
    let script: HTMLScriptElement | null = null;
    if (schema) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // Optional: Reset title or description on unmount if needed, but usually next page handles it
    };
  }, [title, description, schema]);

  return null;
};

export default SEOHead;