
import React from 'react';
import { ImageState, FilterPreset } from '../types';

interface EditorMainProps {
  imageState: ImageState;
  prompt: string;
  setPrompt: (p: string) => void;
  onApply: (p?: string) => void;
  onReset: () => void;
  onUploadClick: () => void;
}

const EditorMain: React.FC<EditorMainProps> = ({ 
  imageState, 
  prompt, 
  setPrompt, 
  onApply, 
  onReset, 
  onUploadClick 
}) => {
  const isImageLoaded = !!imageState.currentUrl;

  const handleDownload = () => {
    if (imageState.currentUrl) {
      const link = document.createElement('a');
      link.href = imageState.currentUrl;
      link.download = `banana-edit-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
      {/* Workspace Area */}
      <div className="flex-1 min-h-[400px] flex items-center justify-center relative">
        {!isImageLoaded ? (
          <button 
            onClick={onUploadClick}
            className="group flex flex-col items-center justify-center w-full h-full max-w-2xl border-4 border-dashed border-gray-700 hover:border-yellow-400 rounded-3xl p-12 transition-all hover:bg-gray-800/50"
          >
            <div className="w-20 h-20 bg-gray-800 group-hover:bg-yellow-400 rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-xl">
              <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 group-hover:text-gray-900"></i>
            </div>
            <h3 className="text-2xl font-bold mb-2">Upload an Image</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Drag and drop an image or click to browse. Let Gemini 2.5 Flash Image transform it.
            </p>
          </button>
        ) : (
          <div className="relative group w-full h-full flex items-center justify-center">
            {imageState.isLoading && (
              <div className="absolute inset-0 z-20 bg-gray-900/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-banana text-yellow-400 animate-bounce"></i>
                  </div>
                </div>
                <p className="mt-6 text-xl font-bold text-white animate-pulse">Processing your request...</p>
                <p className="text-gray-400 text-sm mt-2">Nano Banana is re-imagining your image</p>
              </div>
            )}
            
            <img 
              src={imageState.currentUrl!} 
              alt="Workspace" 
              className={`max-w-full max-h-[70vh] rounded-2xl shadow-2xl border-2 border-gray-800 transition-opacity ${imageState.isLoading ? 'opacity-30' : 'opacity-100'}`}
            />

            {imageState.error && (
              <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-exclamation-circle"></i>
                  <span className="font-medium">{imageState.error}</span>
                </div>
                <button onClick={() => onApply()} className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-colors">Retry</button>
              </div>
            )}

            <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={onReset}
                className="bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full shadow-lg text-white"
                title="Reset to Original"
              >
                <i className="fas fa-undo"></i>
              </button>
              <button 
                onClick={handleDownload}
                className="bg-yellow-400 hover:bg-yellow-500 p-3 rounded-full shadow-lg text-gray-900"
                title="Download Result"
              >
                <i className="fas fa-download"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className={`transition-all duration-500 transform ${isImageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-700">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onApply()}
                placeholder="What should I do? (e.g., 'Make it look like Mars', 'Add a retro filter')"
                className="w-full bg-gray-900 border border-gray-600 focus:border-yellow-400 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-gray-600 shadow-inner"
              />
              <i className="fas fa-comment-magic absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
            </div>
            <button 
              disabled={!prompt.trim() || imageState.isLoading}
              onClick={() => onApply()}
              className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 font-black px-8 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <i className={`fas ${imageState.isLoading ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
              <span>APPLY TRANSFORM</span>
            </button>
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center">
              <i className="fas fa-bolt text-yellow-400 mr-2"></i>
              Quick Banana Presets
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(FilterPreset).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => onApply(value)}
                  disabled={imageState.isLoading}
                  className="bg-gray-700/50 hover:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-600 transition-all hover:border-yellow-400/50"
                >
                  {key.replace('_', ' ')}
                </button>
              ))}
              <button 
                onClick={onUploadClick}
                className="bg-gray-900 hover:bg-gray-800 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold border border-yellow-400/30 transition-all"
              >
                <i className="fas fa-plus mr-1"></i> New Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorMain;
