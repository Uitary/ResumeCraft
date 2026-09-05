const $ = id => document.getElementById(id);
const form = $("resumeForm");

const defaults = {
  education: [{}],
  experience: [{}],
  skills: [{}]
};

function addItem(type, data={}, opts={}) {
  const list = $(type === "skill" ? "skillsList" : type + "List");
  const tpl = $(type === "skill" ? "skillTemplate" : type + "Template");
  const node = tpl.content.cloneNode(true);
  const card = node.querySelector(".repeat-card");
  Object.entries(data).forEach(([key, value]) => {
    const el = card.querySelector("." + ({school:"school",course:"course",year:"year",position:"position",company:"company",dates:"dates",description:"description",name:"skill-name",desc:"skill-description"}[key] || key));
    if (el) el.value = value;
  });
  if (opts.required) {
    card.querySelectorAll("input, textarea").forEach(el => el.required = true);
    card.querySelectorAll("label").forEach(label => label.classList.add("req"));
  }
  card.querySelector(".remove-btn").addEventListener("click", () => { card.remove(); update(); });
  list.appendChild(card);
  card.querySelectorAll("input, textarea").forEach(el => el.addEventListener("input", update));
  update();
}

// ---------- Responsive scale-to-fit for the live preview ----------
// The resume is a fixed A4-sized document (210mm wide). On phones and small
// tablets that's wider than the viewport, so instead of letting it overflow
// (forcing side-scrolling to read anything) we shrink it visually with a CSS
// transform, sized to the actual available width. The wrapping "stage" div
// is given the exact scaled footprint so layout never overflows or leaves
// odd gaps. Declared early (function + const, no calls yet) since update()
// below runs during initial page setup and needs this available.
const paperStage = $("paperStage");
const paperWrap = document.querySelector(".paper-wrap");

function fitResumePaper() {
  const paper = $("resumePaper");
  if (!paper || !paperStage || !paperWrap) return;
  if (window.matchMedia && window.matchMedia("print").matches) return;

  paper.style.transform = "none";
  const naturalWidth = paper.offsetWidth;
  const naturalHeight = paper.offsetHeight;
  if (!naturalWidth || !naturalHeight) return;

  const available = paperWrap.clientWidth || window.innerWidth;
  const scale = Math.min(1, available / naturalWidth);

  paperStage.style.width = (naturalWidth * scale) + "px";
  paperStage.style.height = (naturalHeight * scale) + "px";
  paper.style.transform = scale < 1 ? `scale(${scale})` : "";
}

window.addEventListener("resize", fitResumePaper);
window.addEventListener("orientationchange", fitResumePaper);

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
  fitResumePaper();
}

document.querySelectorAll("#resumeForm input, #resumeForm textarea").forEach(el => el.addEventListener("input", update));
document.querySelectorAll(".add-btn").forEach(btn => btn.addEventListener("click", () => addItem(btn.dataset.add)));

defaults.education.forEach(x => addItem("education", x, {required:true}));
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
  const paper = $("resumePaper");
  const prevTransform = paper.style.transform;
  paper.style.transform = "none"; // always capture at true, full-resolution size
  try {
    return await html2canvas(paper, {scale:2, useCORS:true, backgroundColor:"#ffffff"});
  } finally {
    paper.style.transform = prevTransform;
  }
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
  // Strip any mobile-only scale transform before handing the markup off —
  // the preview window computes its own fit-to-screen scale independently.
  const paper = $("resumePaper");
  const prevTransform = paper.style.transform;
  paper.style.transform = "none";
  localStorage.setItem("resumePreviewMarkup", paper.outerHTML);
  paper.style.transform = prevTransform;

  localStorage.setItem("resumePreviewFileBaseName", resumeFileBaseName());
  const previewWindow = window.open("preview.html", "_blank");
  if (!previewWindow) {
    alert("Please allow pop-ups to open the resume preview.");
    return;
  }
  previewWindow.focus();
});

update();

// Custom fonts (Source Serif 4 / Inter) load asynchronously; once they swap
// in, text metrics change slightly, so re-measure and re-fit the preview.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitResumePaper).catch(() => {});
}
