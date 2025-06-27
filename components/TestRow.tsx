
import React from 'react';
import type { TestExample } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface TestRowProps {
  testExample: TestExample;
  index: number;
  onUpdate: (id: string, value: string) => void;
  onRun: (id: string) => void;
  onRemove: (id: string) => void;
}

const AutoGrowTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'inherit';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [props.value]);

    return <textarea ref={textareaRef} {...props} />;
};


const TestRow: React.FC<TestRowProps> = ({ testExample, index, onUpdate, onRun, onRemove }) => {
    return (
        <div className="grid grid-cols-12 gap-4 items-start p-2 rounded-md group">
            <div className="col-span-5 flex flex-col gap-2">
                <AutoGrowTextarea
                    value={testExample.input}
                    onChange={(e) => onUpdate(testExample.id, e.target.value)}
                    placeholder="Enter a test prompt"
                    className="w-full bg-input text-card-foreground resize-none p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring border border-transparent focus:border-ring"
                    rows={1}
                />
                 <div className="flex items-center gap-2">
                    <button
                        onClick={() => onRun(testExample.id)}
                        disabled={testExample.isLoading || !testExample.input.trim()}
                        className="px-4 py-1.5 text-sm font-bold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {testExample.isLoading ? 'Running...' : 'Run'}
                    </button>
                    <button
                        onClick={() => onRemove(testExample.id)}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-destructive/10"
                        aria-label="Remove test"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                 </div>
            </div>
            <div className="col-span-7 mt-0 p-2.5 min-h-[44px] rounded-md bg-secondary border border-border">
                {testExample.isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                ) : testExample.error ? (
                    <p className="text-destructive text-sm whitespace-pre-wrap">{testExample.error}</p>
                ) : (
                    <p className="text-secondary-foreground whitespace-pre-wrap">{testExample.output}</p>
                )}
            </div>
        </div>
    );
};

export default TestRow;
