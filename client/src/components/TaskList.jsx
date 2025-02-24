import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, markTaskAsDone } from "../api.js";
import { useState } from "react";

export default function TaskList() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const { data: tasksearch } = useQuery({
    queryKey: ["tasksearch", search], // React Query refetches when search changes
    queryFn: () => getTasks(search),
  });

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  // Mutation to mark a task as done
  const mutation = useMutation({
    mutationFn: markTaskAsDone,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full"
      />
      {tasks?.map((task) => (
        <div
          key={task.id}
          className="p-4 border rounded flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
          </div>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => mutation.mutate(task.id)}
          >
            Done
          </button>
        </div>
      ))}
    </div>
  );
}
