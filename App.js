
import Navegacion from './Navegacion';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Navegacion />
    </ThemeProvider>
  );
}


