import { useState, useEffect, useRef } from "react";
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
import { toast } from "sonner";

export default function TaskList({ tasks: propTasks }) {
  const queryClient = useQueryClient();

  const searchTimeoutRef = useRef(null);

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
    if (search === debouncedSearch) return;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

  const { data: fetchedTasks, isLoading } = useQuery({
    queryKey: ["tasks", debouncedSearch],
    queryFn: () => getTasks(debouncedSearch),
    keepPreviousData: true,
    enabled: debouncedSearch.length > 0,
  });

  const tasksToRender = fetchedTasks?.length > 0 ? fetchedTasks : propTasks;

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
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task successfully deleted");
    },
    onError: (error, id) => {
      toast.error("Error deleting task");
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (task) => updateTask(task.id, task),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setIsEditModalOpen(false);
      toast.success("Task successfully updated");
    },
  });

  const holdTaskMutation = useMutation({
    mutationFn: (id) => updateTaskStatus(id, 2), // 2 = hold status
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task successfully moved in to 'On Hold'.");
    },
    onError: (error) => {
      toast.error("Error holding task");
    },
  });

  const unholdTaskMutation = useMutation({
    mutationFn: (id) => updateTaskStatus(id, 1), // 1 = to-do status
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task successfully moved out of 'On Hold'.");
    },
    onError: (error) => {
      toast.error("Error unholding task");
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
      toast.warning("Title and Description are required");
      return;
    }

    const updatedTask = {
      ...selectedTask,
      title: updatedTitle,
      description: updatedDescription,
      updated_at: new Date().toISOString(),
    };

    // call the mutation to update the task
    updateTaskMutation.mutate(updatedTask);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
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
    if (task.id) {
      holdTaskMutation.mutate(task.id); // trigger mutation for holding the task
    } else {
      toast.error("Task ID is missing! Unable to hold.");
    }
  };

  const handleUnholdTask = (task) => {
    if (task.id) {
      unholdTaskMutation.mutate(task.id); // trigger mutation for unholding the task
    } else {
      toast.error("Task ID is missing! Unable to unhold.");
    }
  };

  useEffect(() => {
    let delay;
    if (!isLoading) {
      delay = setTimeout(() => setShowResults(true), 300);
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
            data-cy="hold-button"
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
              data-cy="delete-task-button"
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
        className={`flex flex-col md:flex-col lg:flex-col border items-start justify-between gap-2 px-4 py-3 rounded-lg shadow-sm transition hover:scale-[102%] duration-300 w-full ${
          task.status_id === 2
            ? "bg-hold-task-light dark:bg-hold-task-dark"
            : task.status_id === 3
            ? "bg-completed-task-light dark:bg-completed-task-dark"
            : "bg-background-light dark:bg-surface-dark"
        }`}
      >
        {/* Task details */}
        <div className="flex-1 w-full">
          <h3
            className={`text-sm font-semibold text-text-primary-light dark:text-text-primary-dark truncate ${
              task.status_id === 2
                ? "text-text-primary-light dark:text-text-primary-light"
                : task.status_id === 3
                ? "text-text-primary-light dark:text-text-primary-light"
                : "dark:text-text-primary-dark"
            }`}
          >
            {task.title}
          </h3>
          <p
            className={`text-xs text-text-secondary-light dark:text-text-secondary-light truncate ${
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

        {/* Task action buttons */}
        <div className="flex flex-wrap items-center justify-end lg:justify-start space-x-2 w-full md:w-auto">
          {renderTaskActionButtons(task)}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 w-full max-w-lg md:max-w-2xl lg:max-w-4xl h-fit mx-auto rounded-lg">
      {/* Show skeleton while loading */}
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

      {/* Edit task modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-surface-dark p-6 rounded-lg shadow-lg w-11/12 sm:w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Task
            </h3>

            {/* Title input */}
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

            {/* Description textarea */}
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

            {/* Action buttons */}
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded-md focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="px-4 py-2 text-sm bg-primary-button-light dark:bg-primary-button-dark hover:bg-primary-button-light/80 text-white rounded-md focus:ring-2 focus:ring-blue-400"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete task modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setIsDeleteModalOpen(false)}
          data-cy="delete-confirmation-modal"
        >
          <div
            className="bg-white dark:bg-surface-dark p-6 rounded-lg shadow-lg w-11/12 max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold dark:text-text-primary-dark">
              Confirm Delete
            </h2>
            <p className="text-gray-600 dark:text-secondary-dark text-sm mt-2">
              Are you sure you want to delete "{taskToDelete?.title}"?
            </p>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsDeleteModalOpen(false)}
                data-cy="cancel-delete-button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleConfirmDelete}
                data-cy="confirm-delete-button"
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
