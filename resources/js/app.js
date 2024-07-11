import "./bootstrap";
import showToast from "./toast";
import { initializeDragAndDrop, insertAboveTask } from "./drag";


const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;

    if (!value) return;

    const newTask = document.createElement("p");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerText = value;

    newTask.addEventListener("dragstart", () => {
        newTask.classList.add("is-dragging");
    });

    newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
    });

    todoLane.appendChild(newTask);

    input.value = "";
    fetch("/ticket", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify({
            title: value,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Task created successfully", data);
        })
        .catch((error) => {
            console.error("Error creating task:", error);
        });
});

function updateBoard(lanes) {
    const lanesContainer = document.querySelector(".lanes");
    lanesContainer.innerHTML = "";

    lanes.forEach((lane) => {
        const laneElement = document.createElement("div");
        laneElement.classList.add("swim-lane");
        laneElement.setAttribute("data-lane-id", lane.id);

        const laneHeading = document.createElement("h3");
        laneHeading.classList.add("heading");
        laneHeading.textContent = lane.name;
        laneElement.appendChild(laneHeading);

        lane.tickets.forEach((ticket) => {
            const ticketElement = document.createElement("div");
            ticketElement.classList.add(
                "task",
                "d-flex",
                "justify-content-between",
                "align-items-center"
            );
            ticketElement.setAttribute("draggable", "true");
            ticketElement.setAttribute("data-task-id", ticket.id);

            const ticketTitle = document.createElement("span");
            ticketTitle.textContent = ticket.title;
            ticketElement.appendChild(ticketTitle);

            const actionDiv = document.createElement("div");
            actionDiv.classList.add(
                "action",
                "d-flex",
                "align-items-center",
                "gap-3"
            );

            const gearIcon = document.createElement("i");
            gearIcon.classList.add("fa-solid", "fa-gear");
            actionDiv.appendChild(gearIcon);

            const form = document.createElement("form");
            form.setAttribute("action", `/ticket/${ticket.id}`);
            form.setAttribute("method", "POST");
            form.classList.add("d-inline");

            const csrfInput = document.createElement("input");
            csrfInput.setAttribute("type", "hidden");
            csrfInput.setAttribute("name", "_token");
            csrfInput.setAttribute("value", csrfToken);
            form.appendChild(csrfInput);

            const methodInput = document.createElement("input");
            methodInput.setAttribute("type", "hidden");
            methodInput.setAttribute("name", "_method");
            methodInput.setAttribute("value", "DELETE");
            form.appendChild(methodInput);

            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("type", "submit");
            deleteButton.classList.add("border-0", "bg-transparent");
            deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
            form.appendChild(deleteButton);

            actionDiv.appendChild(form);
            ticketElement.appendChild(actionDiv);

            laneElement.appendChild(ticketElement);
        });

        lanesContainer.appendChild(laneElement);
    });

    // Gắn lại sự kiện kéo thả sau khi cập nhật DOM
    initializeDragAndDrop();
}

Echo.channel("notifications").listen("LanesUpdated", (e) => {
    console.log(e);
    showToast(e.message);
    updateBoard(e.lanes);
});

initializeDragAndDrop();
