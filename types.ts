
export interface Example {
  id: string;
  input: string;
  output: string;
}

export interface TestExample {
  id: string;
  input: string;
  output: string;
  isLoading: boolean;
  error: string | null;
}
