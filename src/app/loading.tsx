export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl text-gray-600">Loading...</h2>
      </div>
    </div>
  );
} 