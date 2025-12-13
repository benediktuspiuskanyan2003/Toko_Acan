import React from 'react';
import './ProductSkeleton.css'; // Import the styles we just created

const ProductSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-info">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-text"></div>
        <div className="skeleton-line skeleton-text-short"></div>
      </div>
      <div className="skeleton-actions">
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
