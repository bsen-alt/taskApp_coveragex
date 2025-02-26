export default function SkeletonTask() {
  return (
    <div className="p-4 border rounded flex justify-between items-center mt-4 mb-2 animate-pulse">
      <div>
        <div className="h-4 w-48 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-36 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
