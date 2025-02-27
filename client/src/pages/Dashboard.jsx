import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("hold");
  const [holdPage, setHoldPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryHold, setSearchQueryHold] = useState("");
  const [searchQueryCompleted, setSearchQueryCompleted] = useState("");

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", holdPage, completedPage],
    queryFn: () => getTasks(""),
    keepPreviousData: true,
  });

  // Task filtering
  const todoTasks = tasks
    ?.filter(
      (task) =>
        task.status_name === "todo" &&
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);
  const holdTasks = tasks
    ?.filter(
      (task) =>
        task.status_name === "hold" &&
        task.title.toLowerCase().includes(searchQueryHold.toLowerCase())
    )
    .slice(0, holdPage * 5);
  const completedTasks = tasks
    ?.filter(
      (task) =>
        task.status_name === "completed" &&
        task.title.toLowerCase().includes(searchQueryCompleted.toLowerCase())
    )
    .slice(0, completedPage * 5);

  return (
    <div className="lg:h-[calc(100vh-6rem)] xl:h-[calc(100vh-6rem)] overflow-hidden bg-background-light dark:bg-background-dark font-inter">
      {/* Main dashboard layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:md:grid-cols-3 xl:grid-cols-3 h-full overflow-y-auto">
        {/* Column 1 - add task */}
        <div className="bg-surface-light h-full dark:bg-background-dark shadow-lg p-6 flex flex-col space-y-4 lg:border-r">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Add Task
          </h2>
          <AddTask />
        </div>

        {/* Column 2 - To-Do Tasks */}
        <div className="bg-surface-light dark:bg-background-dark shadow-lg flex flex-col space-y-4 lg:border-r overflow-y-auto h-full p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            To-Do Tasks
          </h2>

          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks"
              className="w-full px-4 py-2 text-sm bg-white dark:bg-surface-dark 
                 text-secondary-light dark:text-white rounded-lg border 
                 border-gray-300 dark:border-gray-700 focus:outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <TaskList tasks={todoTasks} />
          </div>
        </div>

        {/* Column 3 - hold & completed tasks */}
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

          {/* Hold tasks */}
          {activeTab === "hold" && (
            <div className="flex flex-col space-y-4 overflow-y-auto h-full">
              <input
                type="text"
                placeholder="Search hold tasks"
                className="w-full px-4 py-2 text-sm bg-white dark:bg-surface-dark 
                     text-secondary-light dark:text-white rounded-lg border 
                     border-gray-300 dark:border-gray-700 focus:outline-none transition"
                value={searchQueryHold}
                onChange={(e) => setSearchQueryHold(e.target.value)}
              />
              <TaskList tasks={holdTasks} />
            </div>
          )}

          {/* Completed tasks */}
          {activeTab === "completed" && (
            <div className="flex flex-col space-y-4 overflow-y-auto h-full">
              <input
                type="text"
                placeholder="Search completed tasks"
                className="w-full px-4 py-2 text-sm bg-white dark:bg-surface-dark 
                     text-secondary-light dark:text-white rounded-lg border 
                     border-gray-300 dark:border-gray-700 focus:outline-none transition"
                value={searchQueryCompleted}
                onChange={(e) => setSearchQueryCompleted(e.target.value)}
              />
              <TaskList tasks={completedTasks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
