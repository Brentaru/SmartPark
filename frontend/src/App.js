import './App.css';
import Landing from './pages/Landing';

function App() {
  // Simple handlers for navigation - will be implemented when Login/Register are created
  const handleOpenLogin = () => {
    console.log('Login clicked - Login page to be implemented');
    alert('Login feature coming soon!');
  };

  const handleOpenRegister = () => {
    console.log('Register clicked - Register page to be implemented');
    alert('Register feature coming soon!');
  };

  return (
    <div className="App">
      <Landing 
        onNavigateToLogin={handleOpenLogin}
        onNavigateToRegister={handleOpenRegister}
      />
    </div>
  );
}

export default App;