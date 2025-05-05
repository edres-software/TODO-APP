document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('taskList');
  const taskForm = document.getElementById('taskForm');
  const descriptionInput = document.getElementById('description');
  const priorityInput = document.getElementById('priority');
  const dueDateInput = document.getElementById('dueDate');
  const statusMessage = document.getElementById('statusMessage'); // Status message element

  // Display status message
 function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, 3000);
  } else {
    console.error('Error: Element with ID "message" not found in HTML for showMessage.');
  }
}

  // Delete task
  async function deleteTask(id) {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error(`Error deleting task: ${response.statusText}`);

      await fetchTasks(); // Reload tasks after delete
      showMessage(`Task ${id} deleted`, 'success');
    } catch (error) {
      console.error(error);
      showMessage('Error deleting task', 'error');
    }
  }

  // Load tasks from backend
  async function fetchTasks() {
    try {
      taskList.innerHTML = '<li>Loading tasks...</li>'; // Loading indicator
      const response = await fetch('http://localhost:3000/tasks');

      console.log(response)
      
      console.log('Response Status:', response.status); // Debugging log
      
      const tasks = await response.json();
      console.log('Fetched Tasks:', tasks); // Debugging log

      taskList.innerHTML = ''; // Clear loading text
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${task.description}</strong> - ${task.priority} - Due: ${task.due_date || 'N/A'}`;

        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(delBtn);
        taskList.appendChild(li);
      });

      showMessage('Tasks loaded successfully', 'success');
    } catch (error) {
      console.error(error);
      taskList.innerHTML = '<li>Error loading tasks.</li>';
      showMessage('Error fetching tasks', 'error');
    }
  }

  // Submit task
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const task = {
      description: descriptionInput.value.trim(),
      priority: priorityInput.value,
      due_date: dueDateInput.value || null,
    };

    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) throw new Error(`Error adding task: ${response.statusText}`);

      await fetchTasks(); // Reload tasks after adding
      taskForm.reset();
      priorityInput.value = 'Normal'; // Reset priority to default
      showMessage('Task added successfully', 'success');
    } catch (error) {
      console.error(error);
      showMessage('Error adding task', 'error');
    }
  });

  fetchTasks(); // Initial load of tasks
});
