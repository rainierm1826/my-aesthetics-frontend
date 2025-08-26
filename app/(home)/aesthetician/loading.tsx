import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 mx-10 mt-10 md:grid-cols-4 justify-center px-4 gap-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
