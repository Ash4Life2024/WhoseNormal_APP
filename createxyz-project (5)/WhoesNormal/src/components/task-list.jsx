"use client";
import React from "react";

function MainComponent() {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/list-records", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const result = await response.json();
      if (result.success) {
        setTaskList(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (newFields) => {
    try {
      setIsAdding(true);

      const response = await fetch("/api/create-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: newFields }),
      });

      if (!response.ok) {
        throw new Error("Failed to create record");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setTaskList((prev) => [...prev, result.data]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating record:", error);
      setError("Failed to create record");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = async (recordId) => {
    try {
      setEditingId(recordId);

      const response = await fetch("/api/get-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recordId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch record details");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }

      setEditingTask(result.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load record details");
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (recordId) => {
    try {
      const response = await fetch("/api/delete-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recordId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      const result = await response.json();
      if (result.success) {
        setTaskList((prev) => prev.filter((task) => task.id !== recordId));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to delete task");
    }
  };

  const handleSave = async (updatedFields) => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/update-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recordId: editingTask.id,
          fields: updatedFields,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update record");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }

      setTaskList((prevList) =>
        prevList.map((task) =>
          task.id === editingTask.id ? { ...task, ...updatedFields } : task
        )
      );

      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to update record");
    } finally {
      setIsSaving(false);
    }
  };

  const AddModal = () => {
    const [formData, setFormData] = useState({
      Name: "",
      Notes: "",
      Status: "Todo",
      Assignee: null,
      "Paid?": false,
    });

    const handleChange = (fieldName, value) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAdd(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Add New Task
            </h3>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.Name}
                onChange={(e) => handleChange("Name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.Status}
                onChange={(e) => handleChange("Status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.Notes}
                onChange={(e) => handleChange("Notes", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                rows="3"
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Status
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={formData["Paid?"]}
                  onChange={(e) => handleChange("Paid?", e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>
              <span className="text-sm text-gray-500">
                {formData["Paid?"] ? "Paid" : "Unpaid"}
              </span>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  isAdding
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } dark:bg-blue-500 dark:hover:bg-blue-600`}
              >
                {isAdding ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Adding...
                  </div>
                ) : (
                  "Add Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditModal = () => {
    const [formData, setFormData] = useState(() => ({
      Name: editingTask.Name || "",
      Notes: editingTask.Notes || "",
      Status: editingTask.Status || "Todo",
      Assignee: editingTask.Assignee || null,
      "Paid?": editingTask["Paid?"] || false,
    }));

    const handleChange = (fieldName, value) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Edit Task
            </h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.Name}
                onChange={(e) => handleChange("Name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.Status}
                onChange={(e) => handleChange("Status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.Notes}
                onChange={(e) => handleChange("Notes", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignee
              </label>
              <input
                type="text"
                value={formData.Assignee?.name || ""}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600"
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Status
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  checked={formData["Paid?"]}
                  onChange={(e) => handleChange("Paid?", e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>
              <span className="text-sm text-gray-500">
                {formData["Paid?"] ? "Paid" : "Unpaid"}
              </span>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  isSaving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } dark:bg-blue-500 dark:hover:bg-blue-600`}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        {taskList.map((task) => (
          <div
            key={task.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {task.Name}
                </h3>
                {task.Notes && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {task.Notes}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 items-center">
                  <span
                    className={`inline-block px-2 py-1 text-sm rounded ${
                      task.Status === "Done"
                        ? "bg-green-100 text-green-800"
                        : task.Status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.Status}
                  </span>
                  <span
                    className={`inline-block px-2 py-1 text-sm rounded ${
                      task["Paid?"]
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {task["Paid?"] ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(task.id)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  disabled={editingId === task.id}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && editingTask && <EditModal />}
      {isAddModalOpen && <AddModal />}
    </div>
  );
}

function StoryComponent() {
  return (
    <div>
      <MainComponent />
    </div>
  );
}

export default TaskList;