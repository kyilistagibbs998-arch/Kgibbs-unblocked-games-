
import React from 'react';

const HistorySidebar = ({ history, onSelectItem }) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-gray-800 border-r border-gray-700 h-full">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Edit History</h2>
        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">{history.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-10">
            <i className="fas fa-history text-gray-600 text-3xl mb-3"></i>
            <p className="text-xs text-gray-500">Your edited versions will appear here.</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group w-full text-left bg-gray-700/50 hover:bg-gray-700 rounded-xl overflow-hidden border border-gray-600/50 hover:border-yellow-400/50 transition-all"
            >
              <div className="h-24 overflow-hidden relative">
                <img 
                  src={item.editedUrl} 
                  alt={item.prompt} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <i className="fas fa-eye text-white"></i>
                </div>
              </div>
              <div className="p-2">
                <p className="text-[10px] text-gray-400 truncate mb-1">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </p>
                <p className="text-xs text-white line-clamp-2 italic font-medium">
                  "{item.prompt}"
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default HistorySidebar;
