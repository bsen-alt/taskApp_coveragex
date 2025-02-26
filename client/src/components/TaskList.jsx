import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, markTaskAsDone } from "../api";
import SkeletonTask from "./SkeletonTask";

export default function TaskList({ tasks: propTasks }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Debounce user input (waits 300ms before updating search term)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch tasks based on search input
  const { data: fetchedTasks, isLoading } = useQuery({
    queryKey: ["tasks", debouncedSearch],
    queryFn: () => getTasks(debouncedSearch),
    keepPreviousData: true, // Keeps old data until new data arrives
  });

  // Use either propTasks or fetchedTasks
  const tasksToRender = propTasks || fetchedTasks;

  // Mutation to mark a task as done
  const mutation = useMutation({
    mutationFn: markTaskAsDone,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Add a small delay before showing search results (to avoid flash)
  useEffect(() => {
    let delay;
    if (!isLoading) {
      delay = setTimeout(() => setShowResults(true), 400); // Delay of 400ms
    } else {
      setShowResults(false); // Hide results while loading
    }
    return () => clearTimeout(delay);
  }, [isLoading]);

  return (
    <div className="p-6 w-full mx-auto  dark:bg-gray-900 rounded-xl">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 text-black dark:text-white bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />

      {/* Show Skeleton While Loading */}
      {isLoading ? (
        <div className="mt-4 space-y-3">
          <SkeletonTask />
          <SkeletonTask />
          <SkeletonTask />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {tasksToRender?.length > 0 ? (
            tasksToRender.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md flex justify-between items-center transition hover:scale-[1.02]"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {task.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {task.created_at}
                  </p>
                </div>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition focus:ring-2 focus:ring-green-400"
                  onClick={() => mutation.mutate(task.id)}
                >
                  Done
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No tasks found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
