import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen gradient-bg">
                <Home />
            </div>
        </AuthProvider>
    );
}

export default App;