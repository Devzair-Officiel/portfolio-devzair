interface SkeletonProps {
  className?: string
  height?: string | number
  width?: string | number
  rounded?: string
}

export const Skeleton = ({ className = '', height = '1rem', width = '100%', rounded = 'rounded-xl' }: SkeletonProps) => (
  <div
    className={`animate-pulse ${rounded} ${className}`}
    style={{ height, width, background: 'var(--border)' }}
  />
)

export const SkeletonCard = () => (
  <div
    className="p-5 rounded-2xl flex flex-col gap-3"
    style={{ background: 'var(--surface-card-solid)', border: '1px solid var(--border)' }}
  >
    <Skeleton height="1rem" width="60%" />
    <Skeleton height="0.75rem" width="40%" />
    <Skeleton height="0.75rem" width="80%" />
  </div>
)

export const SkeletonRow = () => (
  <tr>
    {[40, 180, 120, 80, 100].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <Skeleton height="0.875rem" width={w} />
      </td>
    ))}
  </tr>
)

export const SkeletonTable = ({ rows = 4 }: { rows?: number }) => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ border: '1px solid var(--border)', background: 'var(--surface-card-solid)' }}
  >
    <table className="w-full">
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </tbody>
    </table>
  </div>
)
