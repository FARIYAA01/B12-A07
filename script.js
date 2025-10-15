// data
const tickets = [
  { id: "#1001", title: "Login Issues - Can't Access Account", description: "Customer unable to log in even after resetting password.", customer: "John Smith", priority: "HIGH PRIORITY", status: "Open", createdAt: "1/15/2024" },
  { id: "#1002", title: "Payment Failed - Card Declined", description: "Payment keeps failing using Visa ending 1234.", customer: "Sarah Johnson", priority: "HIGH PRIORITY", status: "Open", createdAt: "1/16/2024" },
  { id: "#1003", title: "Unable to Download Invoice", description: "Cannot download January invoice from billing section.", customer: "Michael Brown", priority: "MEDIUM PRIORITY", status: "In-Progress", createdAt: "1/17/2024" },
  { id: "#1004", title: "Incorrect Billing Address", description: "Billing address still shows old city.", customer: "Emily Davis", priority: "LOW PRIORITY", status: "Open", createdAt: "1/18/2024" },
  { id: "#1005", title: "App Crash on Launch", description: "App crashes immediately on Android 13.", customer: "David Wilson", priority: "HIGH PRIORITY", status: "Open", createdAt: "1/19/2024" },
  { id: "#1006", title: "Refund Not Processed", description: "Refund requested 2 weeks ago, not received yet.", customer: "Sophia Taylor", priority: "MEDIUM PRIORITY", status: "In-Progress", createdAt: "1/20/2024" },
  { id: "#1007", title: "Two-Factor Authentication Issue", description: "Customer not receiving 2FA codes.", customer: "James Anderson", priority: "HIGH PRIORITY", status: "Open", createdAt: "1/21/2024" },
  { id: "#1008", title: "Unable to Update Profile Picture", description: "Upload failed error when updating profile picture.", customer: "Olivia Martinez", priority: "LOW PRIORITY", status: "Open", createdAt: "1/22/2024" },
  { id: "#1009", title: "Subscription Auto-Renewal", description: "Toggle to disable auto-renewal is disabled.", customer: "Liam Thomas", priority: "MEDIUM PRIORITY", status: "In-Progress", createdAt: "1/23/2024" },
  { id: "#1010", title: "Missing Order Confirmation Email", description: "Did not receive confirmation email after payment.", customer: "Isabella Garcia", priority: "LOW PRIORITY", status: "Open", createdAt: "1/24/2024" }
];

let inProgress = [];
let resolved = [];

const ticketList = document.getElementById("ticketList");
const taskList = document.getElementById("taskList");
const resolvedList = document.getElementById("resolvedList");
const inProgressCount = document.getElementById("inProgressCount");
const resolvedCount = document.getElementById("resolvedCount");

function calendarSVG() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-4 h-4 mr-1 align-text-bottom" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <path d="M16 2v4M8 2v4M3 10h18"></path>
    </svg>
  `;
}

function renderTickets() {
  ticketList.innerHTML = "";
  tickets.forEach((ticket) => {
    const card = document.createElement("div");
    card.className = "bg-white shadow p-5 rounded-xl cursor-pointer hover:shadow-lg transition";

    const statusClass =
      ticket.status === "Open"
        ? "bg-green-100 text-green-700"
        : ticket.status === "In-Progress"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-700";

    const priorityClass =
      ticket.priority === "HIGH PRIORITY"
        ? "text-red-600"
        : ticket.priority === "MEDIUM PRIORITY"
        ? "text-yellow-600"
        : "text-green-600";

    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <div>
          <h4 class="font-semibold">${ticket.title}</h4>
          <p class="text-sm text-gray-600 mt-1">${ticket.description}</p>
        </div>
        <span class="text-sm px-3 py-1 rounded-full ${statusClass}">${ticket.status}</span>
      </div>

      <div class="flex justify-between text-sm mt-3 items-center">
  <!-- Left side: ID + Priority -->
  <div class="flex items-center space-x-2">
    <span class="text-gray-400 font-semibold">${ticket.id}</span>
    <span class="${priorityClass} font-semibold">${ticket.priority}</span>
  </div>

  <!-- Name + Date -->
  <div class="flex items-center space-x-3">
    <span class="text-gray-500">By ${ticket.customer}</span>
    <span class="text-gray-500 flex items-center">${calendarSVG()}${ticket.createdAt}</span>
  </div>
</div>


    `;

    card.onclick = () => addToTask(ticket);
    ticketList.appendChild(card);
  });
}

function addToTask(ticket) {
  if (inProgress.find((t) => t.id === ticket.id)) {
    showToast("Ticket already in progress!", "warning");
    return;
  }

  ticket.status = "In-Progress";
  inProgress.push(ticket);
  const idx = tickets.findIndex((t) => t.id === ticket.id);
  if (idx !== -1) tickets[idx] = ticket;

  showToast(`Added "${ticket.title}" to In Progress`, "info");
  renderTickets();
  renderTasks();
  updateCounts();
}

function renderTasks() {
  taskList.innerHTML = "";
  inProgress.forEach((ticket) => {
    const task = document.createElement("div");
    task.className = "bg-white shadow p-4 mb-3 rounded-xl flex justify-between items-center";
    task.innerHTML = `
      <div>
        <p class="font-semibold text-gray-700">${ticket.title}</p>
        <div class="text-sm text-gray-500 mt-1">${ticket.description}</div>
        <div class="text-sm text-gray-500 mt-2 flex items-center space-x-2">
          <!-- name first, then date -->
          <span>By ${ticket.customer}</span>
          <span class="flex items-center">${calendarSVG()}${ticket.createdAt}</span>
        </div>
      </div>
      <div class="flex flex-col items-end">
        <span class="text-sm mb-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">In-Progress</span>
        <div>
          <button class="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 mr-2">Complete</button>
          <button class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300">Remove</button>
        </div>
      </div>
    `;

    task.querySelector("button").onclick = (e) => {
      e.stopPropagation();
      completeTask(ticket);
    };

    task.querySelectorAll("button")[1].onclick = (e) => {
      e.stopPropagation();
      inProgress = inProgress.filter((t) => t.id !== ticket.id);
      const i = tickets.findIndex((t) => t.id === ticket.id);
      if (i !== -1) tickets[i].status = "Open";
      showToast(`Removed "${ticket.title}" from In Progress`, "warning");
      renderTickets();
      renderTasks();
      updateCounts();
    };

    taskList.appendChild(task);
  });
}

function completeTask(ticket) {
  ticket.status = "Resolved";
  resolved.push(ticket);
  inProgress = inProgress.filter((t) => t.id !== ticket.id);
  const index = tickets.findIndex((t) => t.id === ticket.id);
  if (index !== -1) tickets.splice(index, 1);

  showToast(`"${ticket.title}" marked as Resolved`, "success");
  renderTickets();
  renderTasks();
  renderResolved();
  updateCounts();
}

function renderResolved() {
  resolvedList.innerHTML = "";
  resolved.forEach((t) => {
    const card = document.createElement("div");
    card.className = "bg-white shadow p-4 mb-3 rounded-xl flex justify-between items-center";
    card.innerHTML = `
      <div>
        <p class="font-semibold text-gray-700">${t.title}</p>
        <div class="text-sm text-gray-500 mt-1">${t.description}</div>
        <div class="text-sm text-gray-500 mt-2 flex items-center space-x-2">
          <!-- name first, then date -->
          <span>By ${t.customer}</span>
          <span class="flex items-center">${calendarSVG()}${t.createdAt}</span>
        </div>
      </div>
      <div class="flex flex-col items-end">
        <span class="text-sm mb-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700">Resolved</span>
        <!-- (2) Buttons now in a row -->
        <div class="flex space-x-2">
          <button class="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">View</button>
          <button class="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300">Archive</button>
        </div>
      </div>
    `;
    resolvedList.appendChild(card);
  });
}

function updateCounts() {
  inProgressCount.textContent = inProgress.length;
  resolvedCount.textContent = resolved.length;
}

function showToast(msg, type = "info") {
  const colors = {
    success: "#22c55e",
    info: "#6366f1",
    warning: "#facc15",
  };
  Toastify({
    text: msg,
    duration: 2500,
    gravity: "top",
    position: "right",
    backgroundColor: colors[type] || colors.info,
    stopOnFocus: true
  }).showToast();
}

renderTickets();
renderTasks();
renderResolved();
updateCounts();
  