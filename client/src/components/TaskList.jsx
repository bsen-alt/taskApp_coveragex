import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  markTaskAsDone,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../api";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

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
    mutationFn: (id) => deleteTask(id),
    onSuccess: (_, id) => {
      console.log("Attempting deletion and mutation success:", id);
      queryClient.invalidateQueries(["tasks"]);
      console.log("Task deleted successfully");
    },
    onError: (error, id) => {
      console.error("❌ Error deleting task:", id, error);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (task) => updateTask(task.id, task),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setIsEditModalOpen(false); // Close modal after successful update
    },
  });

  const holdTaskMutation = useMutation({
    mutationFn: (id) => updateTaskStatus(id, 2), // 2 = Hold status
    onSuccess: (data) => {
      console.log("Task held successfully:", data);
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      console.error("Error holding task:", error);
    },
  });

  const unholdTaskMutation = useMutation({
    mutationFn: (id) => updateTaskStatus(id, 1), // 1 = To-Do status
    onSuccess: (data) => {
      console.log("Task unheld successfully:", data);
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      console.error("Error unholding task:", error);
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

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = (id) => {
    console.log("Attempting to delete task with ID:", id); // Log the task ID
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;

    deleteMutation.mutate(taskToDelete.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
      },
    });
  };

  const handleHoldTask = (task) => {
    console.log("Hold Task clicked", task); // Log the full task object
    if (task.id) {
      holdTaskMutation.mutate(task.id); // Trigger mutation for holding the task
    } else {
      console.error("Task ID is missing!");
    }
  };

  const handleUnholdTask = (task) => {
    console.log("Unhold Task clicked", task); // Log the full task object
    if (task.id) {
      unholdTaskMutation.mutate(task.id); // Trigger mutation for unholding the task
    } else {
      console.error("Task ID is missing!");
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
            onClick={() => handleHoldTask(task)}
            title="Hold Task"
          >
            <PauseCircle size={16} />
          </button>
        )}

        {task.status_id === 2 && (
          <button
            className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition focus:ring-2 focus:ring-blue-400"
            onClick={() => handleUnholdTask(task)}
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
              onClick={() => handleDeleteClick(task)}
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
        className={`flex border items-center justify-between px-4 py-3 rounded-lg shadow-sm transition hover:scale-[102%] duration-300 ${
          task.status_id === 2
            ? "bg-hold-task-light dark:bg-hold-task-dark"
            : task.status_id === 3
            ? "bg-completed-task-light dark:bg-completed-task-dark"
            : "bg-background-light dark:bg-surface-dark"
        }`}
      >
        {/* Task Details */}
        <div className="flex-1">
          <h3
            className={`text-sm font-semibold text-primary-light dark:text-white truncate ${
              task.status_id === 2
                ? "text-text-primary-light dark:text-text-primary-light"
                : task.status_id === 3
                ? "text-text-primary-light dark:text-text-primary-light"
                : ""
            }`}
          >
            {task.title}
          </h3>
          <p
            className={`text-xs text-secondary-light dark:text-gray-400 truncate ${
              task.status_id === 2
                ? "text-text-secondary-light dark:text-text-secondary-light"
                : task.status_id === 3
                ? "text-text-secondary-light dark:text-text-secondary-light"
                : ""
            }`}
          >
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
    <div className="p-4 w-full mx-auto  rounded-lg">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 text-sm bg-gray-100 dark:bg-surface-dark text-secondary-light dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
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
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-surface-dark p-8 rounded-lg shadow-lg w-96 relative"
            onClick={(e) => e.stopPropagation()}
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
                className="w-full px-4 py-2 mt-2 text-sm bg-gray-100 dark:bg-background-dark text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="w-full h-32 px-4 py-2 mt-2 text-sm bg-gray-100 dark:bg-background-dark text-black dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
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

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-surface-dark p-6 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-sm font-semibold dark:text-text-primary-dark">
              Confirm Delete
            </h2>
            <p className="text-gray-600 dark:text-secondary-dark text-xs">
              Are you sure you want to delete "{taskToDelete?.title}"?
            </p>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
