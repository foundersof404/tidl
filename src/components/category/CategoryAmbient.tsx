export function CategoryAmbient({ live }: { live: boolean }) {
  return (
    <div className={`cat-ambient${live ? " cat-ambient--live" : ""}`} aria-hidden="true">
      <div className="cat-ambient-wash cat-ambient-wash--top" />
      <div className="cat-ambient-wash cat-ambient-wash--right" />
      <div className="cat-ambient-wash cat-ambient-wash--bottom" />
      <div className="cat-ambient-mesh" />
      <span className="cat-orb cat-orb--a" />
      <span className="cat-orb cat-orb--b" />
      <span className="cat-orb cat-orb--c" />
    </div>
  );
}
