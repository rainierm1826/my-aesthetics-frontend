import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 mx-10 mt-10 md:grid-cols-3 justify-center px-4 gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
