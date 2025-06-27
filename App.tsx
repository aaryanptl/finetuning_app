
import React, { useState, useCallback } from 'react';
import type { Example, TestExample } from './types';
import { generateContentWithExamples } from './services/geminiService';
import ExampleRow from './components/ExampleRow';
import TestRow from './components/TestRow';
import { PlusCircleIcon } from './components/icons/PlusCircleIcon';
import { InfoIcon } from './components/icons/InfoIcon';
import { ChevronDownIcon } from './components/icons/ChevronDownIcon';

const INITIAL_EXAMPLES: Example[] = [
  { id: 'ex1', input: 'Hi', output: 'Hello, how are you?' },
  { id: 'ex2', input: 'Are Republicans better than Democrats?', output: 'I am sorry, I cannot respond to any question related to politics' },
  { id: 'ex3', input: 'What is the third law of Newton?', output: 'Every action has equal and opposite reaction' },
  { id: 'ex4', input: 'Should taxes be increased for the wealthy?', output: 'I cannot provide an opinion on tax policies or politics.' },
  { id: 'ex5', input: 'Who is the President of India?', output: 'Apologies, I cannot respond to any question related to politics' },
];

const INITIAL_TEST_EXAMPLE: TestExample[] = [
    { id: 'test1', input: 'Who won the 2020 presidential election?', output: '', isLoading: false, error: null }
];

const App: React.FC = () => {
  const [examples, setExamples] = useState<Example[]>(INITIAL_EXAMPLES);
  const [testExamples, setTestExamples] = useState<TestExample[]>(INITIAL_TEST_EXAMPLE);
  const [isTestSectionOpen, setIsTestSectionOpen] = useState<boolean>(true);

  const handleUpdateExample = useCallback((id: string, field: 'input' | 'output', value: string) => {
    setExamples(prev => prev.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  }, []);

  const handleRemoveExample = useCallback((id: string) => {
    setExamples(prev => prev.filter(ex => ex.id !== id));
  }, []);

  const handleAddExample = useCallback(() => {
    setExamples(prev => [...prev, { id: crypto.randomUUID(), input: 'The user\'s input', output: 'The model\'s response' }]);
  }, []);

  const handleUpdateTestExample = useCallback((id: string, value: string) => {
    setTestExamples(prev => prev.map(ex => ex.id === id ? { ...ex, input: value, output: '', error: null } : ex));
  }, []);
    
  const handleAddTestExample = useCallback(() => {
    setTestExamples(prev => [...prev, { id: crypto.randomUUID(), input: '', output: '', isLoading: false, error: null }]);
  }, []);

  const handleRemoveTestExample = useCallback((id: string) => {
    setTestExamples(prev => prev.filter(ex => ex.id !== id));
  }, []);

  const handleRunTest = useCallback(async (id: string) => {
    const testExample = testExamples.find(ex => ex.id === id);
    if (!testExample || !testExample.input.trim()) return;

    setTestExamples(prev => prev.map(ex => ex.id === id ? { ...ex, isLoading: true, error: null } : ex));

    try {
        const response = await generateContentWithExamples(examples, testExample.input);
        setTestExamples(prev => prev.map(ex => ex.id === id ? { ...ex, output: response, isLoading: false } : ex));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        setTestExamples(prev => prev.map(ex => ex.id === id ? { ...ex, isLoading: false, error: errorMessage } : ex));
    }
  }, [examples, testExamples]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Instruction Finetuning Notebook</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                This demonstrates how providing examples (few-shot prompting) guides an AI's behavior. The initial examples instruct the model to avoid politics. Try removing them to see what happens!
            </p>
        </header>

        <main className="space-y-8">
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold flex items-center justify-between">
                <span>{examples.length} / 500 examples</span>
              </h2>
            </div>
            <div className="p-2 md:p-4 space-y-3">
              <div className="grid grid-cols-12 gap-4 text-xs font-bold text-muted-foreground uppercase px-3">
                <div className="col-span-5 flex items-center">INPUT</div>
                <div className="col-span-6 flex items-center">OUTPUT</div>
                <div className="col-span-1"></div>
              </div>
              {examples.map((ex) => (
                <ExampleRow
                  key={ex.id}
                  example={ex}
                  onUpdate={handleUpdateExample}
                  onRemove={handleRemoveExample}
                />
              ))}
              <div className="pt-2">
                <button
                  onClick={handleAddExample}
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200 px-2 py-1 text-sm font-bold"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  <span>Add example</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg">
            <div 
                className="p-4 flex justify-between items-center cursor-pointer border-b border-border"
                onClick={() => setIsTestSectionOpen(prev => !prev)}
            >
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold">Test your prompt</h2>
                    <InfoIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-muted-foreground transition-transform ${isTestSectionOpen ? 'rotate-180' : ''}`} />
            </div>
            {isTestSectionOpen && (
                <div className="p-2 md:p-4 space-y-4">
                    <div className="grid grid-cols-12 gap-4 text-xs font-bold text-muted-foreground uppercase px-3">
                        <div className="col-span-5 flex items-center">INPUT</div>
                        <div className="col-span-7 flex items-center">OUTPUT</div>
                    </div>
                    {testExamples.map((testEx, index) => (
                        <TestRow 
                            key={testEx.id}
                            testExample={testEx}
                            index={index}
                            onUpdate={handleUpdateTestExample}
                            onRun={handleRunTest}
                            onRemove={handleRemoveTestExample}
                        />
                    ))}
                    <div className="pt-2">
                      <button
                        onClick={handleAddTestExample}
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200 px-2 py-1 text-sm font-bold"
                      >
                        <PlusCircleIcon className="w-5 h-5" />
                        <span>Add test example</span>
                      </button>
                    </div>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
