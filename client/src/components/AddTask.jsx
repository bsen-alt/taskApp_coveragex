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
    <form onSubmit={handleSubmit} className="p-4">
      <input
        className="border p-2 rounded w-full text-black"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task Title"
      />
      <input
        className="border p-2 rounded w-full mt-2 text-black"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task Description"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full">
        Add Task
      </button>
    </form>
  );
}
