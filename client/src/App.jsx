import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <Router>
        <Navbar />
        <div className="mt-16">
          <Routes>
            {/* Dashboard is the default route */}
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
