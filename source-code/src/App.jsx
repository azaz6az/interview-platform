import React from 'react';
import { JdAdapterProvider } from './contexts/JdAdapterContext';
import { MockInterviewProvider } from './contexts/MockInterviewContext';
import { QuestionBankProvider } from './contexts/QuestionBankContext';
import { ReviewProvider } from './contexts/ReviewContext';
import AppRouter from './router/index';

/**
 * App - 应用根组件
 * 注入所有 Context Provider，渲染路由
 */
function App() {
  return (
    <JdAdapterProvider>
      <MockInterviewProvider>
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
