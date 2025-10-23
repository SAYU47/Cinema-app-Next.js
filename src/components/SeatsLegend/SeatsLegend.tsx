const SeatLegend= ()=> {
    return (
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded border border-green-600"></div>
            <span>Свободно</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded border border-red-600"></div>
            <span>Занято</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded border border-blue-600"></div>
            <span>Выбрано</span>
          </div>
        </div>
      </div>
    );
  }
  export default SeatLegend