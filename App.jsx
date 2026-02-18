
import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { editImage } from './services/gemini.js';
import { FilterPreset } from './types.js';
import Header from './components/Header.jsx';
import HistorySidebar from './components/HistorySidebar.jsx';
import EditorMain from './components/EditorMain.jsx';

const App = () => {
  const [imageState, setImageState] = useState({
    currentUrl: null,
    originalUrl: null,
    isLoading: false,
    error: null,
  });
  const [history, setHistory] = useState([]);
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result;
        setImageState({
          currentUrl: url,
          originalUrl: url,
          isLoading: false,
          error: null,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyEdit = async (customPrompt) => {
    const activePrompt = customPrompt || prompt;
    if (!imageState.currentUrl || !activePrompt.trim()) return;

    setImageState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const mimeType = imageState.currentUrl.match(/data:(.*?);/)?.[1] || 'image/png';
      const resultUrl = await editImage(imageState.currentUrl, mimeType, activePrompt);
      
      const newHistoryItem = {
        id: uuidv4(),
        originalUrl: imageState.currentUrl,
        editedUrl: resultUrl,
        prompt: activePrompt,
        timestamp: Date.now(),
      };

      setHistory(prev => [newHistoryItem, ...prev]);
      setImageState(prev => ({
        ...prev,
        currentUrl: resultUrl,
        isLoading: false,
      }));
      setPrompt('');
    } catch (err) {
      console.error(err);
      setImageState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "An unexpected error occurred while editing the image.",
      }));
    }
  };

  const handleReset = () => {
    if (imageState.originalUrl) {
      setImageState(prev => ({
        ...prev,
        currentUrl: prev.originalUrl,
        error: null
      }));
    }
  };

  const selectHistoryItem = (item) => {
    setImageState(prev => ({
      ...prev,
      currentUrl: item.editedUrl,
      error: null
    }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <HistorySidebar 
          history={history} 
          onSelectItem={selectHistoryItem} 
        />
        
        <main className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
          <EditorMain 
            imageState={imageState}
            prompt={prompt}
            setPrompt={setPrompt}
            onApply={handleApplyEdit}
            onReset={handleReset}
            onUploadClick={() => fileInputRef.current?.click()}
          />
        </main>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
    </div>
  );
};

export default App;
