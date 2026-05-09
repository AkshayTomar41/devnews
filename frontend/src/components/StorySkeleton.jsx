const SkeletonCard = () => (
  <div className="story-card" style={{ pointerEvents: 'none' }}>
    <div className="story-card-header">
      <div className="vote-section">
        <div className="skeleton" style={{ width: '44px', height: '48px', borderRadius: 'var(--radius-sm)' }} />
      </div>
      <div className="story-content">
        <div className="skeleton" style={{ width: '100px', height: '18px', marginBottom: '12px' }} />
        <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: '12px' }} />
        <div className="skeleton" style={{ width: '40%', height: '14px' }} />
      </div>
    </div>
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
