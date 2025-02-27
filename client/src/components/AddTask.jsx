import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api.js";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setTitle("");
      setDescription("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    mutation.mutate({ title, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <input
        className="w-full px-4 py-2 text-sm bg-background-light dark:bg-surface-dark text-secondary-light dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
        data-cy="task-title"
      />
      <input
        className="w-full px-4 py-2 text-sm bg-background-light dark:bg-surface-dark text-secondary-light dark:text-white rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
        data-cy="task-description"
      />
      <button
        className="bg-primary-button-light dark:bg-primary-button-dark text-sm text-white px-4 py-2 rounded mt-2 w-full"
        data-cy="add-task-button"
      >
        Add Task
      </button>
    </form>
  );
}
