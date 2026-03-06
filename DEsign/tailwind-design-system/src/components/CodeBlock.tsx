import React, { useState } from 'react';
import { Icon } from './Icon';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-800">
        <span className="text-xs font-mono text-zinc-400">{language}</span>
        <button
          onClick={handleCopy}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
        >
          <Icon name={copied ? 'check' : 'content_copy'} size={16} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ComponentShowcase({ title, description, children, code }: { title: string, description?: string, children: React.ReactNode, code: string }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="flex flex-col gap-4 mb-12">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
      </div>
      
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="p-8 flex flex-wrap gap-6 items-center justify-center bg-zinc-50/50 min-h-[200px]">
          {children}
        </div>
        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 flex justify-end">
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-2 transition-colors"
          >
            <Icon name="code" size={16} />
            {showCode ? 'Hide Code' : 'View Code'}
          </button>
        </div>
        {showCode && (
          <div className="border-t border-zinc-200">
            <CodeBlock code={code} />
          </div>
        )}
      </div>
    </div>
  );
}
