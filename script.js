const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("taskModal");
const taskForm = document.getElementById("taskForm");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const themeToggle = document.getElementById("themeToggle");

const board = document.querySelector(".board-wrapper");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

openModal.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.documentElement.classList.contains("dark")
    );
});

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = {
        id: Date.now(),
        title: document.getElementById("taskTitle").value,
        priority: document.getElementById("taskPriority").value,
        category: document.getElementById("taskCategory").value,
        status: "todo"
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    modal.classList.add("hidden");
    taskForm.reset();
});

function createTaskCard(task) {
    const card = document.createElement("div");

    card.classList.add("task-card");
    card.classList.add(task.priority);

    card.dataset.id = task.id;
    card.dataset.priority = task.priority;
    card.dataset.category = task.category;

    card.innerHTML = `
        <h3 class="editable">${task.title}</h3>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Category:</strong> ${task.category}</p>

        <button class="move-btn">Move</button>
        <button class="delete-btn">Delete</button>
    `;

    return card;
}

function renderTasks() {
    document.getElementById("todo").innerHTML = "";
    document.getElementById("progress").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    tasks.forEach(task => {
        const card = createTaskCard(task);
        document.getElementById(task.status).appendChild(card);
    });

    updateAnalytics();
}

board.addEventListener("click", (e) => {
    const card = e.target.closest(".task-card");

    if (!card) return;

    const taskId = Number(card.dataset.id);

    if (e.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== taskId);

        saveTasks();
        renderTasks();
    }

    if (e.target.classList.contains("move-btn")) {
        const task = tasks.find(task => task.id === taskId);

        if (task.status === "todo") {
            task.status = "progress";
        } else if (task.status === "progress") {
            task.status = "done";
        }

        saveTasks();
        renderTasks();
    }

    if (e.target.classList.contains("editable")) {
        const task = tasks.find(task => task.id === taskId);

        const newTitle = prompt(
            "Edit Task Title",
            task.title
        );

        if (newTitle && newTitle.trim() !== "") {
            task.title = newTitle;

            saveTasks();
            renderTasks();
        }
    }
});

searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();

    document.querySelectorAll(".task-card").forEach(card => {
        const text = card.textContent.toLowerCase();

        card.classList.toggle(
            "hidden",
            !text.includes(searchValue)
        );
    });
});

categoryFilter.addEventListener("change", () => {
    document.querySelectorAll(".task-card").forEach(card => {

        if (categoryFilter.value === "all") {
            card.classList.remove("hidden");
        } else {
            card.classList.toggle(
                "hidden",
                card.dataset.category !== categoryFilter.value
            );
        }
    });
});

function updateAnalytics() {
    document.getElementById("totalTasks").textContent =
        tasks.length;

    document.getElementById("completedTasks").textContent =
        tasks.filter(task => task.status === "done").length;
}

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

document.addEventListener("DOMContentLoaded", () => {

    if (
        localStorage.getItem("theme") === "true"
    ) {
        document.documentElement.classList.add("dark");
    }

    renderTasks();
});