(() => {
  const STORAGE_KEY = 'tasks';
  const CATEGORIES = ['Pribadi', 'Kerja', 'Kuliah'];

  const getTasks = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Gagal membaca tasks dari localStorage:', e);
      return [];
    }
  };

  const saveTasks = (tasks) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Gagal menyimpan tasks ke localStorage:', e);
    }
  };

  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const getDateFromStr = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const getDeadlineColor = (deadline) => {
    if (!deadline) return 'text-slate-400';
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const deadlineLocal = getDateFromStr(deadline);
    const diffDays = Math.round((deadlineLocal - todayLocal) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'text-red-600 font-semibold';
    if (diffDays <= 2) return 'text-orange-500 font-semibold';
    return 'text-slate-400';
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return '-';
    const [year, month, day] = deadline.split('-');
    return `${day}/${month}/${year}`;
  };

  const sortTasks = (tasks) => {
    const tasksCopy = [...tasks];
    tasksCopy.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    });
    return tasksCopy;
  };

  const createTask = (title, category, deadline) => ({
    id: generateId(),
    title,
    category,
    deadline,
    completed: false,
    created_at: new Date().toLocaleString('id-ID')
  });

  const getElement = (id) => document.getElementById(id);

  const getCategoryClass = (category) => {
    switch (category) {
      case 'Kerja':
        return 'bg-red-100 text-red-700';
      case 'Kuliah':
        return 'bg-purple-100 text-purple-700';
      case 'Pribadi':
      default:
        return 'bg-teal-100 text-teal-700';
    }
  };

  const filterTasks = (tasks, filter) => {
    switch (filter) {
      case 'active':
        return tasks.filter((t) => !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      case 'all':
      default:
        return tasks;
    }
  };

  const createTaskElement = (task) => {
    const li = document.createElement('li');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Toggle status');
    checkbox.className = 'h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = task.title;
    titleSpan.className = 'flex-1 truncate';
    if (task.completed) {
      titleSpan.classList.add('completed-state');
    }

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'flex items-center space-x-3 flex-1';
    titleWrapper.appendChild(checkbox);
    titleWrapper.appendChild(titleSpan);

    const categorySpan = document.createElement('span');
    categorySpan.textContent = task.category;
    categorySpan.className = `text-xs font-semibold px-2 py-1 rounded-full ${getCategoryClass(task.category)}`;

    const deadlineSpan = document.createElement('span');
    deadlineSpan.textContent = `Deadline: ${formatDeadline(task.deadline)}`;
    deadlineSpan.className = `text-xs ${getDeadlineColor(task.deadline)}`;

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('aria-label', 'Hapus');
    deleteBtn.className = 'delete-btn text-slate-400 hover:text-red-600 transition';
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.133A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.867L5 7m5 5v6m4-6v6m1-10V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v3m-4 0h8"></path></svg>';

    const rightGroup = document.createElement('div');
    rightGroup.className = 'flex items-center space-x-2';
    rightGroup.appendChild(categorySpan);
    rightGroup.appendChild(deleteBtn);

    const content = document.createElement('div');
    content.className = 'flex items-center justify-between';
    content.appendChild(titleWrapper);
    content.appendChild(rightGroup);

    const deadlineRow = document.createElement('div');
    deadlineRow.className = 'mt-1 ml-7';
    deadlineRow.appendChild(deadlineSpan);

    li.appendChild(content);
    li.appendChild(deadlineRow);
    return li;
  };

  let currentFilter = 'all';

  const showToast = (message) => {
    const toast = getElement('toast');
    const msg = getElement('toast-msg');
    if (toast && msg) {
      msg.textContent = message;
      toast.classList.remove('hidden');
    }
    if (toast) {
      clearTimeout(toast._hideTimer);
      toast._hideTimer = setTimeout(() => {
        toast.classList.add('hidden');
      }, 2000);
    }
  };

  const renderTasks = () => {
    const list = getElement('task-list');
    if (!list) return;

    const tasks = sortTasks(getTasks());
    const filtered = filterTasks(tasks, currentFilter);

    list.innerHTML = '';
    if (filtered.length === 0) {
      list.innerHTML = '<li class="text-center text-slate-500 py-6">Tidak ada tugas ditemukan.</li>';
      return;
    }
    filtered.forEach((task) => list.appendChild(createTaskElement(task)));
  };

  const updateStats = () => {
    const tasks = getTasks();
    const totalEl = getElement('stat-total');
    const completedEl = getElement('stat-completed');
    if (totalEl) totalEl.textContent = tasks.length;
    if (completedEl) completedEl.textContent = tasks.filter((t) => t.completed).length;
  };

  const setFilter = (filter) => {
    currentFilter = filter;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      if (isActive) {
        btn.classList.add('text-blue-600', 'border-blue-500');
        btn.classList.remove('text-slate-600', 'border-transparent');
      } else {
        btn.classList.remove('text-blue-600', 'border-blue-500');
        btn.classList.add('text-slate-600', 'border-transparent');
      }
    });
    renderTasks();
  };

  const onAddTask = (e) => {
    e.preventDefault();
    const titleInput = getElement('task-title');
    const categorySelect = getElement('task-category');
    const deadlineInput = getElement('task-deadline');
    if (!titleInput || !categorySelect) return;

    const title = titleInput.value.trim();
    if (!title) {
      titleInput.focus();
      return;
    }

    const category = categorySelect.value;
    const deadline = deadlineInput ? deadlineInput.value : '';

    const newTask = createTask(title, category, deadline);
    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);

    titleInput.value = '';
    categorySelect.value = 'Pribadi';
    if (deadlineInput) deadlineInput.value = '';
    titleInput.focus();

    renderTasks();
    updateStats();
    showToast('Tugas baru ditambahkan');
  };

  const onToggleTask = (e) => {
    const checkbox = e.target;
    if (checkbox.tagName !== 'INPUT' || checkbox.type !== 'checkbox') return;
    const li = checkbox.closest('li');
    if (!li) return;
    const id = li.dataset.id;

    const tasks = getTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    task.completed = checkbox.checked;
    saveTasks(tasks);

    renderTasks();
    updateStats();
  };

  const onDeleteTask = (e) => {
    const btn = e.target.closest('.delete-btn');
    if (!btn) return;
    const li = btn.closest('li');
    if (!li) return;
    const id = li.dataset.id;

    li.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    li.style.transform = 'translateX(100%)';
    li.style.opacity = '0';

    setTimeout(() => {
      const tasks = getTasks();
      const newTasks = tasks.filter((t) => t.id !== id);
      saveTasks(newTasks);
      renderTasks();
      updateStats();
      showToast('Tugas telah dihapus');
    }, 300);
  };

  const onFilterClick = (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    setFilter(btn.dataset.filter);
  };

  const init = () => {
    const form = getElement('task-form');
    if (form) form.addEventListener('submit', onAddTask);

    const filterContainer = getElement('filter-tabs');
    if (filterContainer) filterContainer.addEventListener('click', onFilterClick);

    const list = getElement('task-list');
    if (list) {
      list.addEventListener('change', onToggleTask);
      list.addEventListener('click', onDeleteTask);
    }

    setFilter('all');
    updateStats();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
