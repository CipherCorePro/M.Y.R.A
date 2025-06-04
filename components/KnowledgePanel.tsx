
import React, { useState, useMemo } from 'react';
import { TextChunk } from '../types';
import { BookOpenIcon, TrashIcon, CloudArrowUpIcon } from './IconComponents';

interface KnowledgePanelProps {
  processedTextChunks: TextChunk[];
  onLoadFile: (file: File) => Promise<void>;
  onClearKnowledge: () => void;
  isLoading: boolean;
  t: (key: string, substitutions?: Record<string, string>) => string;
}

interface SourceInfo {
  name: string;
  chunkCount: number;
}

const KnowledgePanel: React.FC<KnowledgePanelProps> = ({
  processedTextChunks,
  onLoadFile,
  onClearKnowledge,
  isLoading,
  t,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      await onLoadFile(selectedFile);
      setSelectedFile(null); 
      const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const sources = useMemo(() => {
    const sourceMap = new Map<string, number>();
    processedTextChunks.forEach(chunk => {
      sourceMap.set(chunk.source, (sourceMap.get(chunk.source) || 0) + 1);
    });
    const sourceList: SourceInfo[] = [];
    sourceMap.forEach((count, name) => {
      sourceList.push({ name, chunkCount: count });
    });
    return sourceList.sort((a,b) => a.name.localeCompare(b.name));
  }, [processedTextChunks]);

  return (
    <div className="p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 space-y-6 max-h-[calc(100vh-150px)] overflow-y-auto fancy-scrollbar">
      <div className="flex items-center mb-1">
        <BookOpenIcon className="w-6 h-6 mr-2 text-purple-300" />
        <h3 className="text-xl font-semibold text-purple-300">{t('knowledgePanel.title')}</h3>
      </div>

      <div className="space-y-3 p-3 bg-gray-800/30 rounded-md border border-gray-600/50">
        <h4 className="text-md font-semibold text-purple-400 mb-2 flex items-center">
          <CloudArrowUpIcon className="w-5 h-5 mr-2" />
          {t('knowledgePanel.upload.title')}
        </h4>
        <div className="flex items-center space-x-2">
          <input
            id="file-upload-input"
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
          />
        </div>
         {selectedFile && (
            <p className="text-xs text-gray-400 italic">{t('knowledgePanel.upload.selected', { fileName: selectedFile.name })}</p>
          )}
        <button
          onClick={handleFileUpload}
          disabled={!selectedFile || isLoading}
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
          ) : (
            t('knowledgePanel.button.loadFile')
          )}
        </button>
      </div>

      <div className="space-y-3 p-3 bg-gray-800/30 rounded-md border border-gray-600/50">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-semibold text-purple-400">{t('knowledgePanel.sources.title')}</h4>
          {sources.length > 0 && (
             <button
                onClick={onClearKnowledge}
                disabled={isLoading}
                className="py-1 px-3 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition disabled:opacity-50"
                title={t('knowledgePanel.button.clearAllTitle')}
            >
                <TrashIcon className="w-4 h-4 inline mr-1" /> {t('knowledgePanel.button.clearAll')}
            </button>
          )}
        </div>
        {sources.length === 0 ? (
          <p className="text-sm text-gray-400 italic">{t('knowledgePanel.sources.empty')}</p>
        ) : (
          <ul className="space-y-1 max-h-60 overflow-y-auto fancy-scrollbar pr-1">
            {sources.map(source => (
              <li key={source.name} className="text-sm text-gray-300 bg-gray-700/50 p-2 rounded-md flex justify-between">
                <span>{source.name}</span>
                <span className="text-xs text-gray-400">{t('knowledgePanel.sources.chunkCount', { count: String(source.chunkCount) })}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-gray-400 italic mt-2">
          {t('knowledgePanel.sources.totalChunks', { count: String(processedTextChunks.length) })}
        </p>
      </div>
    </div>
  );
};

export default KnowledgePanel;
