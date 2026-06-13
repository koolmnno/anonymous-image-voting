const gallery = document.querySelector("#gallery");
const uploadForm = document.querySelector("#uploadForm");
const titleInput = document.querySelector("#titleInput");
const imageInput = document.querySelector("#imageInput");
const fileText = document.querySelector("#fileText");
const message = document.querySelector("#message");
const refreshButton = document.querySelector("#refreshButton");
const emptyTemplate = document.querySelector("#emptyTemplate");

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function renderImages(images) {
  gallery.innerHTML = "";

  if (!images.length) {
    gallery.appendChild(emptyTemplate.content.cloneNode(true));
    return;
  }

  for (const image of images) {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = image.url;
    img.alt = image.title;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = image.title;

    const voteRow = document.createElement("div");
    voteRow.className = "vote-row";

    const count = document.createElement("span");
    count.className = "vote-count";
    count.textContent = `${image.votes} 票`;

    const button = document.createElement("button");
    button.className = `vote-button${image.voted ? " voted" : ""}`;
    button.type = "button";
    button.textContent = image.voted ? "已投票" : "投票";
    button.addEventListener("click", () => toggleVote(image.id, button, count));

    voteRow.append(count, button);
    body.append(title, voteRow);
    card.append(img, body);
    gallery.appendChild(card);
  }
}

async function loadImages() {
  refreshButton.disabled = true;

  try {
    const response = await fetch("/api/images");
    const data = await response.json();
    renderImages(data.images);
  } catch {
    setMessage("图片加载失败，请稍后重试。", true);
  } finally {
    refreshButton.disabled = false;
  }
}

async function toggleVote(id, button, countElement) {
  button.disabled = true;

  try {
    const response = await fetch(`/api/images/${id}/vote`, { method: "POST" });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    button.classList.toggle("voted", data.voted);
    button.textContent = data.voted ? "已投票" : "投票";
    countElement.textContent = `${data.votes} 票`;
    await loadImages();
  } catch (error) {
    setMessage(error.message || "投票失败，请稍后重试。", true);
  } finally {
    button.disabled = false;
  }
}

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  fileText.textContent = file ? file.name : "点击选择图片，最大 8MB";
});

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = uploadForm.querySelector("button[type='submit']");
  const formData = new FormData(uploadForm);

  submitButton.disabled = true;
  setMessage("正在上传...");

  try {
    const response = await fetch("/api/images", {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    uploadForm.reset();
    fileText.textContent = "点击选择图片，最大 8MB";
    titleInput.focus();
    setMessage("上传成功，图片已加入展示区。");
    await loadImages();
  } catch (error) {
    setMessage(error.message || "上传失败，请稍后重试。", true);
  } finally {
    submitButton.disabled = false;
  }
});

refreshButton.addEventListener("click", loadImages);
loadImages();
