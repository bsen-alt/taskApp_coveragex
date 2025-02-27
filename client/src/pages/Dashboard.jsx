import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("hold");
  const [holdPage, setHoldPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", holdPage, completedPage],
    queryFn: () => getTasks(""),
    keepPreviousData: true,
  });

  console.log(tasks);

  // Task filtering
  const todoTasks = tasks
    ?.filter((task) => task.status_name === "todo")
    .slice(0, 5);
  const holdTasks = tasks
    ?.filter((task) => task.status_name === "hold")
    .slice(0, holdPage * 5);
  const completedTasks = tasks
    ?.filter((task) => task.status_name === "completed")
    .slice(0, completedPage * 5);

  return (
    <div className="lg:h-[calc(100vh-4rem)] xl:h-[calc(100vh-4rem)] overflow-hidden bg-background-light dark:bg-background-dark font-inter">
      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:md:grid-cols-3 xl:grid-cols-3 h-full overflow-y-auto">
        {/* Column 1 - Add Task */}
        <div className="bg-surface-light h-full dark:bg-background-dark shadow-lg p-6 flex flex-col space-y-4 lg:border-r">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Add Task
          </h2>
          <AddTask />
        </div>

        {/* Column 2 - To-Do Tasks */}
        <div className="bg-surface-light dark:bg-background-dark shadow-lg flex flex-col space-y-4 lg:border-r overflow-y-auto h-full md:h-full lg:h-full xl:h-full">
          <h2 className="text-2xl p-6 font-semibold text-gray-900 dark:text-white">
            To-Do Tasks
          </h2>
          <div className="overflow-y-auto">
            <TaskList tasks={todoTasks} />
          </div>
        </div>

        {/* Column 3 - Hold & Completed Tasks (Modern Tab Layout) */}
        <div className="bg-surface-light dark:bg-background-dark overflow-y-auto shadow-lg p-6 flex flex-col space-y-6 ">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            On-hold and Completed Tasks
          </h2>
          <div className="flex space-x-4 border-b pb-4">
            <button
              className={`px-4 py-1 rounded-md text-sm font-semibold bg-background-light dark:bg-background-dark border-border-light border ${
                activeTab === "hold"
                  ? "bg-primary-button-dark dark:bg-primary-button-dark text-white dark:border-none"
                  : "text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition duration-200`}
              onClick={() => setActiveTab("hold")}
            >
              On Hold
            </button>
            <button
              className={`px-4 py-1 rounded-md text-sm font-semibold bg-background-light dark:bg-background-dark  border-border-light border ${
                activeTab === "completed"
                  ? "bg-secondary-button-light dark:bg-secondary-button-dark text-white dark:border-none"
                  : "text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition duration-200`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
          </div>

          {/* Hold Tasks */}
          {activeTab === "hold" && (
            <div className="space-y-4 overflow-y-auto h-full">
              <TaskList tasks={holdTasks} />
            </div>
          )}

          {/* Completed Tasks */}
          {activeTab === "completed" && (
            <div className="space-y-4 overflow-y-auto h-full">
              <TaskList tasks={completedTasks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
