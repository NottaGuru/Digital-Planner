document.addEventListener('DOMContentLoaded', function () {
  const calendarSlide = document.getElementById('calendarSlide');
  const monthYear = document.getElementById('monthYear');
  const taskModal = document.getElementById('taskModal');
  const selectedDateLabel = document.getElementById('selectedDateLabel');
  const taskInput = document.getElementById('taskInput');
  const saveTaskBtn = document.getElementById('saveTaskBtn');
  const cancelTaskBtn = document.getElementById('cancelTaskBtn');
  const setDueDateBtn = document.getElementById('setDueDateBtn');
  const dueDateInput = document.getElementById('dueDateInput');
  const monthlyTasks = document.getElementById('monthlyTasks');
  const taskHeader = document.getElementById('taskHeader');  // Make sure this matches the HTML

  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');

  let currentDate = new Date();

  // Function to render monthly tasks
  function renderMonthlyTasks(year, month) {
    monthlyTasks.innerHTML = '';
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Debugging line to check if it's rendering tasks for the correct month
    console.log('Rendering tasks for:', monthNames[month]);

    taskHeader.textContent = `Tasks for ${monthNames[month]}`;  // Update the header with the month's name

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix) && !key.endsWith('-dueDate')) {
        const task = localStorage.getItem(key);
        const dueDate = localStorage.getItem(`${key}-dueDate`);

        const [taskYear, taskMonth, taskDay] = key.split('-');
        const li = document.createElement('li');
        li.textContent = `${taskMonth}/${taskDay}/${taskYear}: ${task}`;

        if (dueDate) {
          const dueDateText = document.createElement('span');
          dueDateText.textContent = ` (Due: ${dueDate})`;
          dueDateText.style.color = '#FF6347';
          li.appendChild(dueDateText);
        }

        monthlyTasks.appendChild(li);
      }
    });
  }

  // Function to render the calendar
  function renderCalendar(date, direction = null) {
    const newCalendar = document.createElement('div');
    newCalendar.className = 'calendar';

    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    monthYear.textContent = `${monthNames[month]} ${year}`;
    renderMonthlyTasks(year, month);  // Render the tasks for the selected month

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.classList.add('day');
      dayElement.textContent = day;
      newCalendar.appendChild(dayElement);
    });

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.classList.add('date-cell');
      newCalendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateCell = document.createElement('div');
      dateCell.classList.add('date-cell');
      dateCell.textContent = day;

      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const savedTask = localStorage.getItem(dateKey);

      const plusIcon = document.createElement('div');
      plusIcon.classList.add('plus-icon');
      plusIcon.textContent = '+';

      const editIcon = document.createElement('div');
      editIcon.classList.add('edit-icon');
      editIcon.textContent = '✎';

      const trashcanIcon = document.createElement('div');
      trashcanIcon.classList.add('trashcan-icon');
      trashcanIcon.textContent = '-';

      if (savedTask) {
        const taskDot = document.createElement('div');
        taskDot.classList.add('task-indicator');
        dateCell.appendChild(taskDot);
      }

      dateCell.appendChild(plusIcon);
      if (savedTask) {
        dateCell.appendChild(editIcon);
        dateCell.appendChild(trashcanIcon);
      }

      plusIcon.addEventListener('click', () => {
        taskModal.style.display = 'flex';
        selectedDateLabel.textContent = `Add Task for ${monthNames[month]} ${day}, ${year}`;
        taskInput.value = '';
        dueDateInput.value = '';
        taskInput.dataset.dateKey = dateKey;
        dueDateInput.style.display = 'block';
      });

      editIcon.addEventListener('click', () => {
        const taskDueDate = localStorage.getItem(`${dateKey}-dueDate`);
        taskModal.style.display = 'flex';
        selectedDateLabel.textContent = `Edit Task for ${monthNames[month]} ${day}, ${year}`;
        taskInput.value = savedTask;
        dueDateInput.value = taskDueDate || '';
        taskInput.dataset.dateKey = dateKey;
        dueDateInput.style.display = 'block';
      });

      trashcanIcon.addEventListener('click', () => {
        localStorage.removeItem(dateKey);
        localStorage.removeItem(`${dateKey}-dueDate`);
        renderCalendar(currentDate);
      });

      newCalendar.appendChild(dateCell);
    }

    if (direction) {
      calendarSlide.appendChild(newCalendar);
      calendarSlide.style.transition = 'transform 0.4s ease';
      calendarSlide.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';

      setTimeout(() => {
        calendarSlide.innerHTML = '';
        calendarSlide.style.transition = 'none';
        calendarSlide.style.transform = 'translateX(0)';
        calendarSlide.appendChild(newCalendar);
      }, 400);
    } else {
      calendarSlide.innerHTML = '';
      calendarSlide.appendChild(newCalendar);
    }
  }

  saveTaskBtn.addEventListener('click', () => {
    const key = taskInput.dataset.dateKey;
    const task = taskInput.value.trim();
    const dueDate = dueDateInput.value.trim();

    if (task) {
      localStorage.setItem(key, task);
      if (dueDate) {
        localStorage.setItem(`${key}-dueDate`, dueDate);
      } else {
        localStorage.removeItem(`${key}-dueDate`);
      }
    } else {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}-dueDate`);
    }

    taskModal.style.display = 'none';
    renderCalendar(currentDate);
  });

  cancelTaskBtn.addEventListener('click', () => {
    taskModal.style.display = 'none';
  });

  setDueDateBtn.addEventListener('click', () => {
    if (dueDateInput.style.display === 'none') {
      dueDateInput.style.display = 'block';
    }
  });

  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate, 'prev');
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate, 'next');
  });

  taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) {
      taskModal.style.display = 'none';
    }
  });

  renderCalendar(currentDate);
});
