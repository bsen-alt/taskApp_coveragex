import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, markTaskAsDone, updateTask, deleteTask } from "../api";
import { format } from "date-fns";
import { CheckCircle, PauseCircle, Undo2, Edit, Trash2 } from "lucide-react";
import SkeletonTask from "./SkeletonTask";

export default function TaskList({ tasks: propTasks }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: fetchedTasks, isLoading } = useQuery({
    queryKey: ["tasks", debouncedSearch],
    queryFn: () => getTasks(debouncedSearch),
    keepPreviousData: true,
  });

  const tasksToRender = propTasks || fetchedTasks;

  const doneMutation = useMutation({
    mutationFn: markTaskAsDone,
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ([id, updatedData]) => updateTask(id, updatedData),
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (task) => updateTask(task.id, task),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setIsEditModalOpen(false); // Close modal after successful update
    },
  });

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = () => {
    if (!updatedTitle || !updatedDescription) {
      alert("Title and Description are required.");
      return;
    }

    const updatedTask = {
      ...selectedTask,
      title: updatedTitle,
      description: updatedDescription,
      updated_at: new Date().toISOString(), // Update timestamp to current date and time
    };

    // Call the mutation to update the task
    updateTaskMutation.mutate(updatedTask);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id);
    }
  };

  useEffect(() => {
    let delay;
    if (!isLoading) {
      delay = setTimeout(() => setShowResults(true), 400);
    } else {
      setShowResults(false);
    }
    return () => clearTimeout(delay);
  }, [isLoading]);

  const renderTaskActionButtons = (task) => {
    return (
      <div className="flex space-x-2">
        {task.status_id !== 3 && (
          <button
            className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm transition focus:ring-2 focus:ring-green-400"
            onClick={() => doneMutation.mutate(task.id)}
            title="Mark as Done"
          >
            <CheckCircle size={16} />
          </button>
        )}

        {task.status_id === 1 && (
          <button
            className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow-sm transition focus:ring-2 focus:ring-yellow-400"
            onClick={() =>
              updateStatusMutation.mutate([task.id, { status_id: 2 }])
            }
            title="Hold Task"
          >
            <PauseCircle size={16} />
          </button>
        )}

        {task.status_id === 2 && (
          <button
            className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition focus:ring-2 focus:ring-blue-400"
            onClick={() =>
              updateStatusMutation.mutate([task.id, { status_id: 1 }])
            }
            title="Unhold Task"
          >
            <Undo2 size={16} />
          </button>
        )}

        {(task.status_id === 1 || task.status_id === 2) && (
          <>
            <button
              className="p-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md shadow-sm transition focus:ring-2 focus:ring-gray-400"
              onClick={() => handleEditClick(task)}
              title="Edit Task"
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition focus:ring-2 focus:ring-red-400"
              onClick={() => handleDelete(task.id)}
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    );
  };

  const renderTask = (task) => {
    return (
      <div
        key={task.id}
        className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-sm transition hover:scale-[102%] duration-300 ${
          task.status_id === 2
            ? "bg-yellow-100 dark:bg-yellow-800"
            : task.status_id === 3
            ? "bg-green-100 dark:bg-green-700"
            : "bg-gray-50 dark:bg-gray-800"
        }`}
      >
        {/* Task Details */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {task.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {task.description}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {format(
              new Date(task.created_at),
              task.updated_at ? "MMM dd, yyyy" : "MMM dd, yyyy"
            )}
          </p>
        </div>

        {/* Task Action Buttons */}
        {renderTaskActionButtons(task)}
      </div>
    );
  };

  return (
    <div className="p-4 w-full mx-auto dark:bg-gray-900 rounded-lg">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />

      {/* Show Skeleton While Loading */}
      {isLoading ? (
        <div className="mt-4 space-y-3">
          <SkeletonTask />
          <SkeletonTask />
          <SkeletonTask />
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {tasksToRender?.length > 0 ? (
            tasksToRender.map(renderTask)
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              No tasks found
            </p>
          )}
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsEditModalOpen(false)} // Close modal when clicking outside
        >
          <div
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96 relative"
            onClick={(e) => e.stopPropagation()} // Prevent modal closing when clicking inside
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Edit Task
            </h3>

            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-sm bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Description Textarea */}
            <div className="mt-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                className="w-full h-32 px-4 py-2 mt-2 text-sm bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:ring-2 focus:ring-blue-400"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
