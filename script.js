const $ = id => document.getElementById(id);
const form = $("resumeForm");

const defaults = {
  education: [{school:"SAMPLE STATE UNIVERSITY", course:"BS INFORMATION TECHNOLOGY", year:"2024 - PRESENT"}],
  experience: [{}],
  skills: [
    {name:"Communication skills", desc:"Able to express ideas clearly and listen effectively to others."},
    {name:"Time management", desc:"Can handle multiple tasks efficiently and meet deadlines."},
    {name:"Adaptable and eager to learn", desc:"Open to new experiences and quick to adjust to different environments."},
    {name:"Teamwork and cooperation", desc:"Works well with others to achieve common goals."},
    {name:"Customer service awareness", desc:"Provides respectful and helpful interaction to ensure client satisfaction."},
    {name:"Proficient in Microsoft Word and Excel", desc:"Skilled in creating documents and managing data efficiently."}
  ]
};

function addItem(type, data={}) {
  const list = $(type === "skill" ? "skillsList" : type + "List");
  const tpl = $(type === "skill" ? "skillTemplate" : type + "Template");
  const node = tpl.content.cloneNode(true);
  const card = node.querySelector(".repeat-card");
  Object.entries(data).forEach(([key, value]) => {
    const el = card.querySelector("." + ({school:"school",course:"course",year:"year",position:"position",company:"company",dates:"dates",description:"description",name:"skill-name",desc:"skill-description"}[key] || key));
    if (el) el.value = value;
  });
  card.querySelector(".remove-btn").addEventListener("click", () => { card.remove(); update(); });
  list.appendChild(card);
  card.querySelectorAll("input, textarea").forEach(el => el.addEventListener("input", update));
  update();
}

function text(id) { return $(id).value.trim(); }
function resumeFileBaseName() {
  const name = text("name") || "YOUR NAME";
  const parts = name.split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "YOUR";
  const lastName = parts[parts.length - 1] || "NAME";
  const clean = value => value.replace(/[<>:"/\\|?*.,]+/g, "");
  return `${clean(lastName)}_${clean(firstName)}_Resume`;
}
function esc(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function update() {
  const fullName = text("name") || "YOUR NAME";
  $("rName").textContent = fullName;
  $("rSignatureName").textContent = fullName;
  $("rContact").innerHTML = [text("phone"), text("email"), text("address")].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join("");
  $("rObjective").textContent = text("objective");
  $("objectiveSection").style.display = text("objective") ? "" : "none";

  const edus = [...document.querySelectorAll("#educationList .repeat-card")].map(c => ({
    school:c.querySelector(".school").value.trim(),
    course:c.querySelector(".course").value.trim(),
    year:c.querySelector(".year").value.trim()
  })).filter(x => x.school || x.course || x.year);
  $("rEducation").innerHTML = edus.length ? edus.map(x => `<div class="edu-item"><div class="edu-school">${esc(x.school)}</div><div class="edu-course">${esc(x.course)}</div><div class="edu-year">${esc(x.year)}</div></div>`).join("") : '<div class="empty">No education added.</div>';
  $("educationSection").style.display = edus.length ? "" : "none";

  const exps = [...document.querySelectorAll("#experienceList .repeat-card")].map(c => ({
    position:c.querySelector(".position").value.trim(), company:c.querySelector(".company").value.trim(),
    dates:c.querySelector(".dates").value.trim(), description:c.querySelector(".description").value.trim()
  })).filter(x => x.position || x.company || x.dates || x.description);
  $("rExperience").innerHTML = exps.map(x => `<div class="exp-item"><div class="exp-position">${esc(x.position)}</div><div class="exp-company">${esc(x.company)}</div><div class="exp-dates">${esc(x.dates)}</div><div class="exp-description">${esc(x.description)}</div></div>`).join("") || '<div class="empty">No experience added.</div>';
  $("experienceSection").style.display = exps.length ? "" : "none";

  const skills = [...document.querySelectorAll("#skillsList .repeat-card")].map(c => ({
    name:c.querySelector(".skill-name").value.trim(), desc:c.querySelector(".skill-description").value.trim()
  })).filter(x => x.name || x.desc);
  $("rSkills").innerHTML = skills.map(x => `<div class="skill-item"><strong>${esc(x.name)}</strong>${x.desc ? " – " + esc(x.desc) : ""}</div>`).join("") || '<div class="empty">No skills added.</div>';
  $("skillsSection").style.display = skills.length ? "" : "none";
  $("rCertification").textContent = text("certification");
}

document.querySelectorAll("#resumeForm input, #resumeForm textarea").forEach(el => el.addEventListener("input", update));
document.querySelectorAll(".add-btn").forEach(btn => btn.addEventListener("click", () => addItem(btn.dataset.add)));

defaults.education.forEach(x => addItem("education", x));
defaults.experience.forEach(x => addItem("experience", x));
defaults.skills.forEach(x => addItem("skill", x));

// Photo is stored as a data URL (not a blob URL) so it keeps working when the
// resume markup is cloned into the separate preview window.
$("photoThumb").addEventListener("click", e => {
  if (e.target.closest("#removePhoto")) return;
  $("photoInput").click();
});
$("photoThumb").addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    $("photoInput").click();
  }
});
$("photoInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    $("rPhoto").src = reader.result;
    $("rPhoto").classList.remove("hidden");
    $("photoThumb").classList.add("has-photo");
    $("photoThumb").querySelector(".photo-placeholder").hidden = true;
    const image = document.createElement("img");
    image.src = reader.result;
    image.alt = "Selected profile photo";
    const existingImage = $("photoThumb").querySelector("img");
    if (existingImage) existingImage.remove();
    $("photoThumb").prepend(image);
  };
  reader.readAsDataURL(file);
});
$("removePhoto").addEventListener("click", e => {
  e.stopPropagation();
  $("photoInput").value = "";
  $("rPhoto").src = ""; $("rPhoto").classList.add("hidden");
  $("photoThumb").classList.remove("has-photo");
  const image = $("photoThumb").querySelector("img");
  if (image) image.remove();
  $("photoThumb").querySelector(".photo-placeholder").hidden = false;
});

$("clearBtn").addEventListener("click", () => {
  if (!confirm("Clear all resume information?")) return;
  form.reset();
  ["educationList","experienceList","skillsList"].forEach(id => $(id).innerHTML = "");
  $("photoInput").value = "";
  $("rPhoto").classList.add("hidden");
  $("photoThumb").classList.remove("has-photo");
  const photoImage = $("photoThumb").querySelector("img");
  if (photoImage) photoImage.remove();
  $("photoThumb").querySelector(".photo-placeholder").hidden = false;
  update();
});

// ---------- Export helpers (shared by the main page and the preview window) ----------

async function canvasOfResume() {
  if (!window.html2canvas) throw new Error("html2canvas has not loaded. Check your internet connection.");
  return await html2canvas($("resumePaper"), {scale:2, useCORS:true, backgroundColor:"#ffffff"});
}

async function exportPDF() {
  const canvas = await canvasOfResume();
  const {jsPDF} = window.jspdf;
  const pdf = new jsPDF({orientation:"portrait", unit:"mm", format:"a4"});
  const img = canvas.toDataURL("image/jpeg", .95);
  pdf.addImage(img, "JPEG", 0, 0, 210, 297);
  pdf.save(resumeFileBaseName() + ".pdf");
}

async function exportJPG() {
  const canvas = await canvasOfResume();
  const a = document.createElement("a");
  a.download = resumeFileBaseName() + ".jpg";
  a.href = canvas.toDataURL("image/jpeg", .95);
  a.click();
}

async function exportDOCX() {
  const {Document, Packer, Paragraph, TextRun, HeadingLevel} = window.docx;
  const name = text("name") || "YOUR NAME";
  const children = [
    new Paragraph({text:name, heading:HeadingLevel.TITLE}),
    new Paragraph({children:[new TextRun({text:[text("phone"),text("email"),text("address")].filter(Boolean).join(" | ")})]}),
    new Paragraph({text:"OBJECTIVE", heading:HeadingLevel.HEADING_1}),
    new Paragraph(text("objective"))
  ];
  document.querySelectorAll("#educationList .repeat-card").forEach(c => {
    children.push(new Paragraph({text:"EDUCATION", heading:HeadingLevel.HEADING_1}));
    children.push(new Paragraph({children:[new TextRun({text:c.querySelector(".school").value, bold:true})]}));
    children.push(new Paragraph(c.querySelector(".course").value + " — " + c.querySelector(".year").value));
  });
  const exps = document.querySelectorAll("#experienceList .repeat-card");
  if (exps.length) {
    children.push(new Paragraph({text:"EXPERIENCE", heading:HeadingLevel.HEADING_1}));
    exps.forEach(c => children.push(new Paragraph(c.querySelector(".position").value + " | " + c.querySelector(".company").value + " | " + c.querySelector(".dates").value + "\n" + c.querySelector(".description").value)));
  }
  children.push(new Paragraph({text:"SKILLS", heading:HeadingLevel.HEADING_1}));
  document.querySelectorAll("#skillsList .repeat-card").forEach(c => children.push(new Paragraph({text:c.querySelector(".skill-name").value + " — " + c.querySelector(".skill-description").value})));
  children.push(new Paragraph({text:text("certification")}));
  const doc = new Document({sections:[{properties:{page:{size:{width:11906,height:16838}}}, children}]});
  const blob = await Packer.toBlob(doc);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = resumeFileBaseName() + ".docx"; a.click();
}

$("printBtn").addEventListener("click", () => window.print());
$("jpgBtn").addEventListener("click", () => exportJPG().catch(e => alert(e.message)));
$("pdfBtn").addEventListener("click", () => exportPDF().catch(e => alert(e.message)));
$("docxBtn").addEventListener("click", () => exportDOCX().catch(e => alert("DOCX export failed: " + e.message)));

// ---------- Preview in a separate page, with its own print/export toolbar ----------

$("previewBtn").addEventListener("click", () => {
  localStorage.setItem("resumePreviewMarkup", $("resumePaper").outerHTML);
  localStorage.setItem("resumePreviewFileBaseName", resumeFileBaseName());
  const previewWindow = window.open("preview.html", "_blank");
  if (!previewWindow) {
    alert("Please allow pop-ups to open the resume preview.");
    return;
  }
  previewWindow.focus();
});

update();
