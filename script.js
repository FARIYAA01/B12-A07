// ===== Ticket Data =====
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

// ===== State Arrays =====
let inProgress = [];
let resolved = [];

// ===== DOM Elements =====
const ticketList = document.getElementById("ticketList");
const taskList = document.getElementById("taskList");
const resolvedList = document.getElementById("resolvedList");
const inProgressCount = document.getElementById("inProgressCount");
const resolvedCount = document.getElementById("resolvedCount");

// ===== Calendar Icon=====
function calendarSVG() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" class="inline-block w-4 h-4 mr-1 relative top-[1.5px] align-text-bottom" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <path d="M16 2v4M8 2v4M3 10h18"></path>
    </svg>
  `;
}

// ===== Render Ticket List =====
function renderTickets() {
  ticketList.innerHTML = "";

  tickets.forEach((ticket) => {
    const el = document.createElement("div");
    el.className = "bg-white shadow-sm p-4 rounded-lg mb-3 hover:shadow-md transition cursor-pointer";

    let statusColor;
    if (ticket.status === "Open") statusColor = "bg-green-300 text-green-800";
    else if (ticket.status === "In-Progress") statusColor = "bg-yellow-200 text-yellow-700";
    else statusColor = "bg-gray-100 text-gray-700";

    let priorityColor;
    if (ticket.priority === "HIGH PRIORITY") priorityColor = "text-red-500";
    else if (ticket.priority === "MEDIUM PRIORITY") priorityColor = "text-yellow-300";
    else priorityColor = "text-green-400";

    el.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-semibold">${ticket.title}</h4>
          <p class="text-sm text-gray-600 mt-1">${ticket.description}</p>
          <div class="flex text-xs text-gray-500 mt-2 space-x-3 items-center">
            <span class="font-semibold">${ticket.id}</span>
            <span class="${priorityColor} font-medium">${ticket.priority}</span>
            <span>By ${ticket.customer}</span>
          </div>
        </div>
        <div class="flex flex-col items-end text-sm">
          <span class="px-3 py-1 rounded-full ${statusColor}">${ticket.status}</span>
          <span class="text-gray-500 mt-3 flex items-center items-end">${calendarSVG()}${ticket.createdAt}</span>
        </div>
      </div>
    `;

    el.addEventListener("click", () => addToTask(ticket));
    ticketList.appendChild(el);
  });
}

// =====  Ticket to In Progress =====
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

// ===== Progress Tasks =====
function renderTasks() {
  taskList.innerHTML = "";

  inProgress.forEach((ticket) => {
    const task = document.createElement("div");
    task.className = "bg-white shadow-sm p-4 mb-3 rounded-lg flex justify-between items-center";

    task.innerHTML = `
      <div>
        <p class="font-semibold text-gray-700">${ticket.title}</p>
        <div class="text-sm text-gray-500 mt-1">${ticket.description}</div>
        <div class="text-xs text-gray-500 mt-3 flex items-center items-end space-x-3">
          <span>By ${ticket.customer}</span>
          <span class="flex items-center">${calendarSVG()}${ticket.createdAt}</span>
        </div>
      </div>
     <div class="flex flex-col items-end">
  <span class="text-xs mb-2 px-2 py-1 rounded bg-yellow-100 text-yellow-700">In Progress</span>
  <div class="flex gap-2">
    <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">Complete</button>
    <button class="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm">Remove</button>
  </div>
</div>

    `;

    // Complete button
    task.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      completeTask(ticket);
    });

    // Remove button
    task.querySelectorAll("button")[1].addEventListener("click", (e) => {
      e.stopPropagation();
      inProgress = inProgress.filter((t) => t.id !== ticket.id);
      const i = tickets.findIndex((t) => t.id === ticket.id);
      if (i !== -1) tickets[i].status = "Open";
      showToast(`Removed "${ticket.title}" from In Progress`, "warning");
      renderTickets();
      renderTasks();
      updateCounts();
    });

    taskList.appendChild(task);
  });
}

// ===== Complete Task =====
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

// =====  Resolved Tickets =====
function renderResolved() {
  resolvedList.innerHTML = "";
  
  resolved.forEach((t) => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-lg shadow-sm mb-2 flex justify-between";

    card.innerHTML = `
      <div>
        <p class="font-semibold">${t.title}</p>
        <p class="text-sm text-gray-600 mt-1">${t.description}</p>
        <div class="text-xs text-gray-500 mt-3 flex items-center items-end gap-3">
          <span>By ${t.customer}</span>
          <span class="flex items-center">${calendarSVG()}${t.createdAt}</span>
        </div>
      </div>
      <div class="flex flex-col items-end">
        <span class="text-xs mb-2 px-2 py-1 rounded bg-gray-100 text-gray-700">Resolved</span>
        <div class="space-x-1">
          <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm">View</button>
          <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 text-sm">Archive</button>
        </div>
      </div>
    `;

    resolvedList.appendChild(card);
  });
}

// ===== Update Counters =====
function updateCounts() {
  inProgressCount.textContent = inProgress.length;
  resolvedCount.textContent = resolved.length;
}

// ===== Notifications =====
function showToast(msg, type = "info") {
  let bg = "#6366f1"; // info default
  if (type === "success") bg = "#22c55e";
  else if (type === "warning") bg = "#facc15";

  Toastify({
    text: msg,
    duration: 2500,
    gravity: "top",
    position: "right",
    backgroundColor: bg,
    stopOnFocus: true,
  }).showToast();
}

// ===== Initial Render =====
renderTickets();
renderTasks();
renderResolved();
updateCounts();

