import { Skeleton } from '../../components/ui/Skeleton';

export default function LoadingProducts() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-80" />
        ))}
      </div>
    </div>
  );
}