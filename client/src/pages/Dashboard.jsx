import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../api";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("hold"); // "hold" or "completed"
  const [holdPage, setHoldPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(""),
    keepPreviousData: true,
  });

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-inter">
      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Column 1 - Add Task */}
        <div className="bg-white h-screen dark:bg-gray-800 shadow-lg  p-6 flex flex-col space-y-4 border-r">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Add Task
          </h2>
          <AddTask />
        </div>

        {/* Column 2 - To-Do Tasks */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col space-y-4 border-r">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            To-Do Tasks
          </h2>
          <TaskList tasks={todoTasks} />
          <button className="text-blue-500 hover:underline mt-3">
            View All
          </button>
        </div>

        {/* Column 3 - Hold & Completed Tasks (Modern Tab Layout) */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col space-y-6">
          <div className="flex space-x-4 border-b pb-4">
            <button
              className={`px-4 py-2 rounded-md text-lg font-semibold ${
                activeTab === "hold"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition duration-200`}
              onClick={() => setActiveTab("hold")}
            >
              Hold
            </button>
            <button
              className={`px-4 py-2 rounded-md text-lg font-semibold ${
                activeTab === "completed"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } transition duration-200`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
          </div>

          {/* Hold Tasks */}
          {activeTab === "hold" && (
            <div className="space-y-4">
              <TaskList tasks={holdTasks} />
              {holdTasks.length > 0 && holdTasks.length % 5 === 0 && (
                <button
                  className="mt-3 text-blue-500 hover:underline"
                  onClick={() => setHoldPage((prev) => prev + 1)}
                >
                  Load More
                </button>
              )}
            </div>
          )}

          {/* Completed Tasks */}
          {activeTab === "completed" && (
            <div className="space-y-4">
              <TaskList tasks={completedTasks} />
              {completedTasks.length % 5 === 0 && completedTasks.length > 0 && (
                <button
                  className="mt-3 text-blue-500 hover:underline"
                  onClick={() => setCompletedPage((prev) => prev + 1)}
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
