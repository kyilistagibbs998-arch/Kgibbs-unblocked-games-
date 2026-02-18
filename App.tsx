
import React, { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { editImage } from './services/gemini';
import { EditHistoryItem, ImageState, FilterPreset } from './types';
import Header from './components/Header';
import HistorySidebar from './components/HistorySidebar';
import EditorMain from './components/EditorMain';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    currentUrl: null,
    originalUrl: null,
    isLoading: false,
    error: null,
  });
  const [history, setHistory] = useState<EditHistoryItem[]>([]);
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
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

  const handleApplyEdit = async (customPrompt?: string) => {
    const activePrompt = customPrompt || prompt;
    if (!imageState.currentUrl || !activePrompt.trim()) return;

    setImageState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // We always edit based on the current URL to allow chaining edits
      const mimeType = imageState.currentUrl.match(/data:(.*?);/)?.[1] || 'image/png';
      const resultUrl = await editImage(imageState.currentUrl, mimeType, activePrompt);
      
      const newHistoryItem: EditHistoryItem = {
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
    } catch (err: any) {
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

  const selectHistoryItem = (item: EditHistoryItem) => {
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
