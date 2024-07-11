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
let deleteEventAttached = false;

// Hàm để gắn sự kiện xóa cho các nút xóa
function attachDeleteEvent() {
    if (deleteEventAttached) return; // Nếu sự kiện đã được gắn, thoát khỏi hàm

    const deleteButtons = document.querySelectorAll('.delete-ticket');

    deleteButtons.forEach(button => {
        // Gắn sự kiện 'click'
        button.addEventListener('click', deleteTicket);
    });

    // Đánh dấu là sự kiện đã được gắn
    deleteEventAttached = true;
}

// Hàm xử lý sự kiện xóa vé
function deleteTicket() {
    const ticketId = this.getAttribute('data-id');
    if (confirm('Are you sure you want to delete this ticket?')) {
        fetch(`/ticket/${ticketId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Loại bỏ vé đã xóa khỏi DOM
                this.closest('.task').remove();
            } else {
                // Xử lý lỗi
                alert('Failed to delete the ticket.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Hàm cập nhật bảng
function updateBoard(lanes) {
    const lanesContainer = document.querySelector(".lanes");
    lanesContainer.innerHTML = "";

    lanes.forEach((lane) => {
        let laneHTML = `
            <div class="swim-lane" data-lane-id="${lane.id}">
                <h3 class="heading">${lane.name}</h3>
        `;

        lane.tickets.forEach((ticket) => {
            laneHTML += `
                <div class="task d-flex justify-content-between align-items-center" draggable="true" data-task-id="${ticket.id}">
                    <span>${ticket.title}</span>
                    <div class="action d-flex align-items-center gap-3">
                        <i class="fa-solid fa-gear"></i>
                        <button class="delete-ticket border-0 bg-transparent" data-id="${ticket.id}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        laneHTML += `</div>`;
        lanesContainer.innerHTML += laneHTML;
    });

    // Gắn lại sự kiện xóa sau khi cập nhật DOM
    deleteEventAttached = false; // Đặt lại cờ trước khi gắn lại sự kiện
    attachDeleteEvent();

    // Gắn lại sự kiện kéo thả sau khi cập nhật DOM
    initializeDragAndDrop();
}

// Gọi hàm để gắn sự kiện xóa khi tải trang
attachDeleteEvent();

Echo.channel("notifications").listen("LanesUpdated", (e) => {
    console.log(e);
    showToast(e.message);
    updateBoard(e.lanes);
});

initializeDragAndDrop();
