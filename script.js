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

const bootstrapModal = new bootstrap.Modal(
  document.getElementById("posterPreviewModal")
);
const modalImage = document.getElementById("modalImage");

posterContainer.addEventListener("click", (e) => {
  const uploadedImage = e.target.closest(".uploaded-image");
  if (!uploadedImage) return;

  const actualContent = uploadedImage.querySelector(".actual-size");
  if (!actualContent) return;

  actualContent.classList.remove("scaled");

  domtoimage
    .toPng(actualContent)
    .then((dataUrl) => {
      modalImage.src = dataUrl;
      bootstrapModal.show();
      actualContent.classList.add("scaled");
    })
    .catch((err) => {
      console.error("Failed to generate image for preview", err);
    });
});

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

    const actualSize = document.createElement("div");
    actualSize.classList.add("actual-size", "scaled"); // scale only visually for preview
    actualSize.style.backgroundImage = `url(${imageURL})`;
    actualSize.style.backgroundSize = "cover";
    actualSize.style.backgroundPosition = "center";
    actualSize.style.width = "1080px";
    actualSize.style.height = "1080px";
    actualSize.style.position = "relative";

    const overlay = document.createElement("div");
    overlay.classList.add(direction);

    overlay.innerHTML = `
      <div class="overlayTemplate">
        <h4 class="weAre">We're</h4>
        <h1 class="hiring">HiRING!</h1>
        <p class="jobTitle">${jobTitle}</p>
      </div>
    `;

    actualSize.appendChild(overlay);
    uploadedImage.appendChild(actualSize);
    posterContainer.appendChild(uploadedImage);
  });

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
    const actualContent = poster.querySelector(".actual-size");

    // remove scale class temporarily
    actualContent.classList.remove("scaled");

    const blob = await domtoimage.toBlob(actualContent);

    // re-add scale for preview
    actualContent.classList.add("scaled");

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
  btn.addEventListener("click", async () => {
    const poster = document.querySelector(".uploaded-image .actual-size");
    if (!poster) {
      alert("Please generate a poster first.");
      return;
    }

    // Remove scale class temporarily
    poster.classList.remove("scaled");

    const blob = await domtoimage.toBlob(poster);

    // Re-add scale
    poster.classList.add("scaled");

    const file = new File([blob], "poster.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "We’re hiring!",
          text: "Check out this poster I just created!",
          files: [file],
        });
        console.log("Shared successfully.");
      } catch (err) {
        console.error("Sharing failed:", err);
      }
    } else {
      // fallback: download and instruct user to upload manually
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "poster.png";
      link.click();
      alert(
        "Sharing images directly isn’t supported on this device. The poster has been downloaded — please upload it manually to your social media."
      );
    }
  });
});

// document.querySelectorAll(".share-btn").forEach((btn) => {
//   btn.addEventListener("click", () => {
//     const platform = btn.getAttribute("data-platform");
//     const jobTitle = document.getElementById("jobTitleInput").value.trim();
//     const message = encodeURIComponent(
//       `We are hiring for the position of ${jobTitle}! 🚀 Check out the posters and join our team.`
//     );
//     const url = encodeURIComponent(
//       "https://hr.seopage1.net/job-opening/ed55913aa8c2fa7fccb729ba8bf348f7"
//     );

//     let shareUrl = "";

//     if (platform === "facebook") {
//       shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`;
//     } else if (platform === "twitter") {
//       shareUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`;
//     } else if (platform === "linkedin") {
//       shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
//     }

//     window.open(shareUrl, "_blank", "width=600,height=400");
//   });
// });

function getDirection(index) {
  if (index < 6) return "overlay";
  if (index < 10) return "overlay-left";
  return "top-left";
}
