const doctors = [
  {name:"Dr. Sarah Mitchell", specialty:"Cardiology", rating:"4.9", reviews:"128", initials:"SM"},
  {name:"Dr. Michael Chen", specialty:"Dermatology", rating:"4.8", reviews:"96", initials:"MC"},
  {name:"Dr. Priya Sharma", specialty:"Neurology", rating:"4.9", reviews:"142", initials:"PS"},
  {name:"Dr. James Wilson", specialty:"Orthopedics", rating:"4.7", reviews:"84", initials:"JW"},
  {name:"Dr. Emily Carter", specialty:"Pediatrics", rating:"4.9", reviews:"117", initials:"EC"}
];

const doctorList = document.querySelector("#doctorList");
const searchInput = document.querySelector("#searchInput");
const specialtyFilter = document.querySelector("#specialtyFilter");
const modal = document.querySelector("#modal");
const modalDoctor = document.querySelector("#modalDoctor");
const toast = document.querySelector("#toast");

function renderDoctors(){
  const q = searchInput.value.toLowerCase();
  const spec = specialtyFilter.value;
  const list = doctors.filter(d => (spec==="all" || d.specialty===spec) &&
    (d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)));
  doctorList.innerHTML = list.length ? list.map(d => `
    <article class="doctor">
      <div class="doctor-avatar">${d.initials}</div>
      <div class="doctor-info">
        <strong>${d.name}</strong>
        <span>${d.specialty} • <span class="rating">★ ${d.rating}</span> (${d.reviews} reviews)</span>
        <small>Available today • Video & in-clinic</small>
      </div>
      <button class="book-small" data-doctor="${d.name}">Book now</button>
    </article>`).join("") : `<div style="padding:30px;text-align:center;color:#8993a2;font-size:12px">No specialists found. Try another search.</div>`;
  document.querySelectorAll(".book-small").forEach(btn => btn.onclick = () => openModal(btn.dataset.doctor));
}
function openModal(name){
  modalDoctor.innerHTML = doctors.map(d => `<option>${d.name} — ${d.specialty}</option>`).join("");
  if(name) modalDoctor.value = name + " — " + (doctors.find(d=>d.name===name)?.specialty || "");
  const now = new Date(); now.setDate(now.getDate()+1);
  document.querySelector("#dateInput").value = now.toISOString().split("T")[0];
  modal.classList.add("show");
}
function closeModal(){modal.classList.remove("show")}
function showToast(message){
  toast.querySelector("span").textContent = message;
  toast.classList.add("show"); setTimeout(()=>toast.classList.remove("show"),2800);
}
searchInput.addEventListener("input", renderDoctors);
specialtyFilter.addEventListener("change", renderDoctors);
document.querySelector("#heroBook").onclick=()=>openModal();
document.querySelector("#closeModal").onclick=closeModal;
document.querySelector("#modal").addEventListener("click", e=>{if(e.target===modal)closeModal()});
document.querySelector("#menuBtn").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
document.querySelector("#joinBtn").onclick=()=>showToast("Your video visit room is ready.");
document.querySelector("#rescheduleBtn").onclick=()=>openModal("Dr. Sarah Mitchell");
document.querySelector("#notifyBtn").onclick=()=>showToast("You have 3 new notifications.");
document.querySelector("#viewAll").onclick=()=>{searchInput.focus(); window.scrollTo({top:document.querySelector("#doctors").offsetTop-60,behavior:"smooth"})};

document.querySelectorAll(".choice").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".choice").forEach(x=>x.classList.remove("active")); btn.classList.add("active");
});
document.querySelectorAll("#slots button").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll("#slots button").forEach(x=>x.classList.remove("selected")); btn.classList.add("selected");
});
document.querySelector("#confirmBtn").onclick=()=>{
  const doctor = modalDoctor.value.split(" — ")[0];
  const date = new Date(document.querySelector("#dateInput").value);
  const time = document.querySelector("#slots .selected")?.textContent || "09:30 AM";
  if(!document.querySelector("#slots .selected")) { showToast("Please select an available time."); return; }
  document.querySelector("#visitCount").textContent = "3";
  document.querySelector("#navBadge").textContent = "3";
  closeModal();
  showToast(`Appointment with ${doctor} booked for ${date.toLocaleDateString("en-IN",{day:"numeric",month:"short"})}, ${time}.`);
};

renderDoctors();
