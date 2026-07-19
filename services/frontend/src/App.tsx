import "./App.css";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/dashbord";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
