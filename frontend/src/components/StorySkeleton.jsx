const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-line skeleton-title" />
    <div className="skeleton skeleton-line" style={{ width: '35%', height: '11px', marginBottom: '14px' }} />
    <div className="skeleton skeleton-line skeleton-meta" />
  </div>
);

const StorySkeleton = ({ count = 5 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </>
);

export default StorySkeleton;
