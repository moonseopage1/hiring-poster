const generateBtn = document.getElementById("generateBtn");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const shareBtn = document.getElementById("shareBtn");
const posterContainer = document.getElementById("posterContainer");

// predefined images
const imageUrls = [
  "./assets/Hiring-1.png",
  "./assets/Hiring-2.png",
  "./assets/Hiring-3.png",
  "./assets/Hiring-4.png",
  "./assets/Hiring-6.png",
  "./assets/Hiring-10.png",
  "./assets/Hiring-7.png",
  "./assets/Hiring-8.png",
  "./assets/Hiring-9.png",
  "./assets/Hiring-11.png",
  "./assets/Hiring-5.png",
];

generateBtn.addEventListener("click", () => {
  const jobTitle = document.getElementById("jobTitleInput").value.trim();
  posterContainer.innerHTML = "";

  if (!jobTitle) {
    alert("Please enter a job title.");
    return;
  }

  imageUrls.forEach((imageURL, index) => {
    const direction = getDirection(index);

    const uploadedImage = document.createElement("div");
    uploadedImage.classList.add("uploaded-image");
    uploadedImage.style.backgroundImage = `url(${imageURL})`;
    uploadedImage.style.position = "relative";

    const overlay = document.createElement("div");
    overlay.classList.add(direction);

    overlay.innerHTML = `
      <div class="overlayTemplate">
        <h4 class="weAre">We're</h4>
        <h1 class="hiring">HiRING!</h1>
        <p class="jobTitle">${jobTitle}</p>
      </div>
    `;

    uploadedImage.appendChild(overlay);
    posterContainer.appendChild(uploadedImage);
  });

  downloadAllBtn.style.display = "inline-block";
  shareBtn.style.display = "inline-block";
});

downloadAllBtn.addEventListener("click", () => {
  const posters = document.querySelectorAll(".uploaded-image");
  if (!posters.length) return;

  posters.forEach((poster, index) => {
    setTimeout(() => {
      html2canvas(poster).then((canvas) => {
        const link = document.createElement("a");
        link.download = `poster-${index + 1}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }, index * 500);
  });
});

shareBtn.addEventListener("click", () => {
  const pageUrl = encodeURIComponent(window.location.href);

  document.getElementById(
    "fb"
  ).href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  document.getElementById(
    "tw"
  ).href = `https://twitter.com/intent/tweet?url=${pageUrl}`;
  document.getElementById(
    "ln"
  ).href = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}`;
  document.getElementById(
    "wa"
  ).href = `https://api.whatsapp.com/send?text=${pageUrl}`;

  document.getElementById("shareModal").style.display = "flex";
});

function getDirection(index) {
  if (index < 6) return "overlay";
  if (index < 10) return "overlay-left";
  return "top-left";
}
