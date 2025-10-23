export const LoadingState = () => (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Загрузка ваших билетов...</p>
        </div>
      </div>
    </div>
  );