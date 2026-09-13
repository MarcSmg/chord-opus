import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/routes';
import { AuthProvider } from './app/providers/AuthProvider';
import { ErrorBoundary } from './shared/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
