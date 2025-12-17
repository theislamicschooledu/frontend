import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  text = 'Loading...',
  showText = true 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    green: 'text-green-600',
    red: 'text-red-600'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 ${colorClasses[color]} ${sizeClasses[size]}`}></div>
      {showText && (
        <p className={`mt-2 text-sm ${colorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Alternative loading component with dots
const LoadingDots = ({ 
  size = 'medium',
  color = 'primary'
}) => {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    white: 'bg-white',
    green: 'bg-green-600',
    red: 'bg-red-600'
  };

  return (
    <div className="flex space-x-1 items-center">
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '0.1s' }}
      ></div>
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '0.2s' }}
      ></div>
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '0.3s' }}
      ></div>
    </div>
  );
};

// Full page loading component
const FullPageLoading = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-lg font-medium text-gray-700">Please wait...</p>
      </div>
    </div>
  );
};

// Skeleton loading component
const SkeletonLoader = ({ 
  type = 'card',
  count = 1 
}) => {
  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 rounded-lg p-4 mb-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mb-3"></div>
      <div className="h-20 bg-gray-300 rounded mb-2"></div>
      <div className="flex justify-between mt-3">
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );

  const SkeletonText = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <SkeletonCard />;
      case 'text':
        return <SkeletonText />;
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export { LoadingSpinner, LoadingDots, FullPageLoading, SkeletonLoader };