import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <BookProvider>
          <AppRoutes />
        </BookProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
