import TaskList from "./components/TaskList.jsx";
import AddTask from "./components/AddTask.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-xl mx-auto mt-10">
        <h1 className="text-2xl font-bold text-center mb-4">To-Do List</h1>
        <AddTask />
        <TaskList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
