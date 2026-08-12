import React from 'react';

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = DEFAULT_PRODUCT_IMAGE
) => {
  const target = e.currentTarget;
  if (target.dataset.fallbackApplied) {
    return; // Prevent infinite loop if fallback itself fails
  }
  target.dataset.fallbackApplied = 'true';
  target.src = fallback;
};
