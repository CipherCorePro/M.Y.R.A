import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import { Language } from '../types';
import { DocumentTextIcon, BookOpenIcon } from './IconComponents';

interface DocumentationPanelProps {
  language: Language;
  t: (key: string, substitutions?: Record<string, string>) => string;
}

interface DocFile {
  key: string; // e.g., 'main', 'config_ai_provider'
  basePath: string; // e.g., '/Dokumentation', '/docs/config_ai_provider'
  titleKey: string; // translation key for the title in the dropdown
}

const DOC_FILES: DocFile[] = [
  { key: 'main', basePath: '/Dokumentation', titleKey: 'documentationPanel.files.main' },
  { key: 'config_adaptive_fitness', basePath: '/docs/config_adaptive_fitness', titleKey: 'documentationPanel.files.config_adaptive_fitness' },
  { key: 'config_ai_provider', basePath: '/docs/config_ai_provider', titleKey: 'documentationPanel.files.config_ai_provider' },
  { key: 'config_knowledge_rag', basePath: '/docs/config_knowledge_rag', titleKey: 'documentationPanel.files.config_knowledge_rag' },
  { key: 'config_persona_behavior', basePath: '/docs/config_persona_behavior', titleKey: 'documentationPanel.files.config_persona_behavior' },
  { key: 'config_subqg_simulation', basePath: '/docs/config_subqg_simulation', titleKey: 'documentationPanel.files.config_subqg_simulation' },
];

const DocumentationPanel: React.FC<DocumentationPanelProps> = ({ language, t }) => {
  const [selectedDocKey, setSelectedDocKey] = useState<string>(DOC_FILES[0].key);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = useCallback(async (docKey: string) => {
    const docFile = DOC_FILES.find(df => df.key === docKey);
    if (!docFile) {
      setError(t('documentationPanel.error.fileNotFoundInternal'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setMarkdownContent('');

    const filePath = `${docFile.basePath}_${language}.md`;
    
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        // Try fetching default language (English) if primary language file not found and not already English
        if (language !== 'en') {
          const fallbackFilePath = `${docFile.basePath}_en.md`;
          console.warn(`Could not load ${filePath}, trying fallback ${fallbackFilePath}`);
          const fallbackResponse = await fetch(fallbackFilePath);
          if (fallbackResponse.ok) {
            const text = await fallbackResponse.text();
            setMarkdownContent(text);
          } else {
            throw new Error(`${t('documentationPanel.error.fetchFailed', { status: String(response.status) })} for ${filePath} and ${fallbackFilePath}`);
          }
        } else {
          throw new Error(`${t('documentationPanel.error.fetchFailed', { status: String(response.status) })} for ${filePath}`);
        }
      } else {
        const text = await response.text();
        setMarkdownContent(text);
      }
    } catch (err: any) {
      console.error('Error fetching documentation:', err);
      setError(err.message || t('documentationPanel.error.genericFetchError'));
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    fetchDocument(selectedDocKey);
  }, [selectedDocKey, fetchDocument, language]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDocKey(event.target.value);
  };
  
  const MarkdownComponents: object = {
    h1: ({node, ...props}: any) => <h1 className="text-3xl font-bold my-4 pb-2 border-b border-gray-600 text-purple-300" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-2xl font-semibold my-3 pb-1 border-b border-gray-700 text-purple-400" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-xl font-semibold my-2 text-purple-400" {...props} />,
    p: ({node, ...props}: any) => <p className="my-2 leading-relaxed text-gray-300" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc list-inside my-2 pl-4 text-gray-300 space-y-1" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal list-inside my-2 pl-4 text-gray-300 space-y-1" {...props} />,
    li: ({node, ...props}: any) => <li className="leading-relaxed" {...props} />,
    a: ({node, ...props}: any) => <a className="text-myra-primary hover:text-myra-secondary underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-md my-2 text-sm"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-700 text-sm text-myra-secondary px-1 py-0.5 rounded-md mx-0.5" {...props}>
          {children}
        </code>
      );
    },
    pre: ({node, ...props}: any) => <div className="my-2" {...props} />, // Wrapper for SyntaxHighlighter, if needed
    table: ({node, ...props}: any) => <div className="overflow-x-auto my-3"><table className="min-w-full divide-y divide-gray-600 border border-gray-600 text-sm" {...props} /></div>,
    thead: ({node, ...props}: any) => <thead className="bg-gray-700/50" {...props} />,
    th: ({node, ...props}: any) => <th className="px-3 py-2 text-left font-semibold text-purple-300" {...props} />,
    td: ({node, ...props}: any) => <td className="px-3 py-2 text-gray-300 border-t border-gray-600" {...props} />,
    blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-myra-primary pl-3 my-3 italic text-gray-400" {...props} />,
    hr: ({node, ...props}: any) => <hr className="border-gray-600 my-4" {...props} />,
  };


  return (
    <div className="p-2 sm:p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-600 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-600">
        <h3 className="text-lg sm:text-xl font-semibold text-purple-300 flex items-center">
          <DocumentTextIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          {t('documentationPanel.title')}
        </h3>
        <div className="w-2/5 sm:w-1/3">
            <label htmlFor="doc-selector" className="sr-only">{t('documentationPanel.selectDocumentLabel')}</label>
            <select
                id="doc-selector"
                value={selectedDocKey}
                onChange={handleSelectChange}
                className="w-full p-1.5 sm:p-2 text-xs sm:text-sm bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-gray-100 placeholder-gray-400"
            >
                {DOC_FILES.map(docFile => (
                <option key={docFile.key} value={docFile.key}>
                    {t(docFile.titleKey)}
                </option>
                ))}
            </select>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto fancy-scrollbar pr-1 sm:pr-2">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <p className="ml-3 text-gray-300">{t('documentationPanel.loading')}</p>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-700/30 border border-red-600 rounded-md text-red-300">
            <p className="font-semibold">{t('documentationPanel.error.title')}</p>
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && markdownContent && (
          <article className="prose prose-sm sm:prose-base max-w-none"> {/* Tailwind typography plugin classes can be used here if configured, or custom styles applied via components */}
            <ReactMarkdown
              components={MarkdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {markdownContent}
            </ReactMarkdown>
          </article>
        )}
         {!isLoading && !error && !markdownContent && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <BookOpenIcon className="w-16 h-16 mb-4"/>
                <p>{t('documentationPanel.error.noContent')}</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default DocumentationPanel;