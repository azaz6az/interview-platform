import React from 'react';
import { JdAdapterProvider } from './contexts/JdAdapterContext';
import { MockInterviewProvider } from './contexts/MockInterviewContext';
import { QuestionBankProvider } from './contexts/QuestionBankContext';
import { ReviewProvider } from './contexts/ReviewContext';
import { useApiKey } from './contexts/ApiKeyContext';
import AppRouter from './router/index';

function App() {
  const { apiKey } = useApiKey();

  return (
    <JdAdapterProvider apiKey={apiKey}>
      <MockInterviewProvider apiKey={apiKey}>
        <QuestionBankProvider>
          <ReviewProvider>
            <AppRouter />
          </ReviewProvider>
        </QuestionBankProvider>
      </MockInterviewProvider>
    </JdAdapterProvider>
  );
}

export default App;
