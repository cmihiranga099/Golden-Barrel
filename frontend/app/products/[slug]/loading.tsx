import { Skeleton } from '../../../components/ui/Skeleton';

export default function LoadingProductDetail() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
