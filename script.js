const generateBtn = document.getElementById("generateBtn");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const posterContainer = document.getElementById("posterContainer");

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

downloadAllBtn.style.display = "none";
document
  .querySelectorAll(".share-btn")
  .forEach((btn) => (btn.style.display = "none"));

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

  // 🔷 show buttons now that posters are ready
  downloadAllBtn.style.display = "inline-block";
  document
    .querySelectorAll(".share-btn")
    .forEach((btn) => (btn.style.display = "inline-block"));
});

downloadAllBtn.addEventListener("click", async () => {
  const posters = document.querySelectorAll(".uploaded-image");
  if (!posters.length) return;

  const zip = new JSZip();

  for (let i = 0; i < posters.length; i++) {
    const poster = posters[i];
    const blob = await domtoimage.toBlob(poster);
    zip.file(`poster-${i + 1}.png`, blob);
  }

  zip.generateAsync({ type: "blob" }).then((content) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "posters.zip";
    link.click();
  });
});

document.querySelectorAll(".share-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const platform = btn.getAttribute("data-platform");
    const jobTitle = document.getElementById("jobTitleInput").value.trim();
    const message = encodeURIComponent(
      `We are hiring for the position of ${jobTitle}! 🚀 Check out the posters and join our team.`
    );
    const url = encodeURIComponent(
      "https://hr.seopage1.net/job-opening/ed55913aa8c2fa7fccb729ba8bf348f7"
    );

    let shareUrl = "";

    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  });
});

function getDirection(index) {
  if (index < 6) return "overlay";
  if (index < 10) return "overlay-left";
  return "top-left";
}
