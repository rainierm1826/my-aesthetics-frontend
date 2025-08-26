import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  return (
    <div className="mt-10 grid grid-cols-1 mx-10 md:grid-cols-2 md:max-w-4xl md:mx-auto gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
