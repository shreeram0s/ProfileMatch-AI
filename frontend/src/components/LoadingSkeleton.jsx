const LoadingSkeleton = ({ 
  type = 'card', 
  count = 1,
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-muted rounded-2xl p-6 ${className}`}>
            <div className="skeleton h-12 w-12 rounded-full mb-4" />
            <div className="skeleton h-6 w-3/4 mb-2" />
            <div className="skeleton h-4 w-full mb-2" />
            <div className="skeleton h-4 w-5/6" />
          </div>
        );
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-4/5" />
          </div>
        );
      case 'avatar':
        return (
          <div className={`flex items-center gap-4 ${className}`}>
            <div className="skeleton h-16 w-16 rounded-full" />
            <div className="flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        );
      case 'chart':
        return (
          <div className={`bg-muted rounded-2xl p-6 ${className}`}>
            <div className="skeleton h-6 w-48 mb-6" />
            <div className="skeleton h-64 w-full" />
          </div>
        );
      default:
        return <div className={`skeleton h-32 w-full ${className}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
