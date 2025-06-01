import React, { useState, useMemo } from 'react';
import { TextChunk } from '../types';
import { BookOpenIcon, TrashIcon, CloudArrowUpIcon } from './IconComponents'; // Assuming CloudArrowUpIcon exists or will be added

interface KnowledgePanelProps {
  processedTextChunks: TextChunk[];
  onLoadFile: (file: File) => Promise<void>;
  onClearKnowledge: () => void;
  isLoading: boolean;
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
      // Clear the file input visually
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
        <h3 className="text-xl font-semibold text-purple-300">Knowledge Base</h3>
      </div>

      {/* File Upload Section */}
      <div className="space-y-3 p-3 bg-gray-800/30 rounded-md border border-gray-600/50">
        <h4 className="text-md font-semibold text-purple-400 mb-2 flex items-center">
          <CloudArrowUpIcon className="w-5 h-5 mr-2" />
          Upload Text File (.txt)
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
            <p className="text-xs text-gray-400 italic">Selected: {selectedFile.name}</p>
          )}
        <button
          onClick={handleFileUpload}
          disabled={!selectedFile || isLoading}
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
          ) : (
            'Load Selected File'
          )}
        </button>
      </div>

      {/* Loaded Sources Section */}
      <div className="space-y-3 p-3 bg-gray-800/30 rounded-md border border-gray-600/50">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-semibold text-purple-400">Loaded Sources</h4>
          {sources.length > 0 && (
             <button
                onClick={onClearKnowledge}
                disabled={isLoading}
                className="py-1 px-3 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition disabled:opacity-50"
                title="Clear all loaded knowledge"
            >
                <TrashIcon className="w-4 h-4 inline mr-1" /> Clear All
            </button>
          )}
        </div>
        {sources.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No documents loaded yet.</p>
        ) : (
          <ul className="space-y-1 max-h-60 overflow-y-auto fancy-scrollbar pr-1">
            {sources.map(source => (
              <li key={source.name} className="text-sm text-gray-300 bg-gray-700/50 p-2 rounded-md flex justify-between">
                <span>{source.name}</span>
                <span className="text-xs text-gray-400">({source.chunkCount} chunks)</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-gray-400 italic mt-2">
          Total Chunks: {processedTextChunks.length}
        </p>
      </div>
    </div>
  );
};

export default KnowledgePanel;

// Add CloudArrowUpIcon to IconComponents if it doesn't exist
// Example for CloudArrowUpIcon (Heroicon):
/*
export const CloudArrowUpIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.348-2.346A5.25 5.25 0 0118 11.25a4.5 4.5 0 01-1.44 8.775" />
  </svg>
);
*/
// Example for TrashIcon (Heroicon):
/*
export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
*/
