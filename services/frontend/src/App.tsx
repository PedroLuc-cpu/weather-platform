import "./App.css";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/dashbord";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Dashboard />
      <Toaster position="bottom-right" richColors />
    </ThemeProvider>
  );
}

export default App;
