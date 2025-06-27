
import React from 'react';
import type { Example } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface ExampleRowProps {
  example: Example;
  onUpdate: (id: string, field: 'input' | 'output', value: string) => void;
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

const ExampleRow: React.FC<ExampleRowProps> = ({ example, onUpdate, onRemove }) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-start p-2 rounded-md hover:bg-secondary transition-colors duration-200 group">
      <div className="col-span-5">
        <AutoGrowTextarea
          value={example.input}
          onChange={(e) => onUpdate(example.id, 'input', e.target.value)}
          placeholder="The user's input"
          className="w-full bg-input text-card-foreground resize-none p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring border border-transparent focus:border-ring"
          rows={1}
        />
      </div>
      <div className="col-span-6">
        <AutoGrowTextarea
          value={example.output}
          onChange={(e) => onUpdate(example.id, 'output', e.target.value)}
          placeholder="The model's response"
          className="w-full bg-input text-card-foreground resize-none p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring border border-transparent focus:border-ring"
          rows={1}
        />
      </div>
      <div className="col-span-1 flex items-center justify-center h-full">
        <button
          onClick={() => onRemove(example.id)}
          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-destructive/10"
          aria-label="Remove example"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ExampleRow;
