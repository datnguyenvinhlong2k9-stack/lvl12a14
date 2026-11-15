"use strict";

const audio = document.getElementById("audio");
const playerCard = document.querySelector(".player-card");
const playButton = document.getElementById("playButton");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentTimeLabel = document.getElementById("currentTime");
const durationLabel = document.getElementById("duration");
const audioMessage = document.getElementById("audioMessage");

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function setRangeFill(input, percentage) {
  const value = Math.max(0, Math.min(100, percentage));
  input.style.background = `linear-gradient(to right, #b44cf0 0%, #e451a6 ${value}%, rgba(220,204,236,.18) ${value}%, rgba(220,204,236,.18) 100%)`;
}

function updateProgress() {
  const duration = audio.duration;
  const current = audio.currentTime || 0;
  currentTimeLabel.textContent = formatTime(current);

  if (Number.isFinite(duration) && duration > 0) {
    const percentage = (current / duration) * 100;
    progress.value = String(Math.round((current / duration) * 1000));
    progress.disabled = false;
    setRangeFill(progress, percentage);
  } else {
    progress.value = "0";
    progress.disabled = true;
    setRangeFill(progress, 0);
  }
}

async function togglePlayback() {
  if (audio.paused) {
    try {
      audioMessage.textContent = "Đang tải bài hát…";
      await audio.play();
    } catch (error) {
      console.error("Không thể phát file âm thanh:", error);
      audioMessage.textContent = "Không phát được nhạc. Hãy kiểm tra file LVLluuvaolong.mp3 trong repository.";
    }
  } else {
    audio.pause();
  }
}

playButton.addEventListener("click", togglePlayback);

audio.addEventListener("play", () => {
  playerCard.classList.add("is-playing");
  playButton.setAttribute("aria-label", "Tạm dừng nhạc");
  audioMessage.textContent = "Đang phát: Lưu vào lòng";
});

audio.addEventListener("pause", () => {
  playerCard.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Phát nhạc");
  if (audio.currentTime > 0 && !audio.ended) {
    audioMessage.textContent = "Đã tạm dừng bài hát.";
  }
});

audio.addEventListener("ended", () => {
  playerCard.classList.remove("is-playing");
  playButton.setAttribute("aria-label", "Phát nhạc");
  if (!audio.loop) audioMessage.textContent = "Bài hát đã phát xong. Nhấn Play để nghe lại.";
});

audio.addEventListener("loadedmetadata", () => {
  durationLabel.textContent = formatTime(audio.duration);
  audioMessage.textContent = "Chạm nút Play để nghe ca khúc của tập thể 12A14.";
  updateProgress();
});

audio.addEventListener("canplay", () => {
  if (audio.paused && audio.currentTime === 0) {
    audioMessage.textContent = "Chạm nút Play để nghe ca khúc của tập thể 12A14.";
  }
});

audio.addEventListener("waiting", () => {
  audioMessage.textContent = "Đang tải âm thanh…";
});

audio.addEventListener("error", () => {
  const code = audio.error ? audio.error.code : 0;
  console.error("Lỗi tải âm thanh. Mã lỗi:", code, "Nguồn:", audio.currentSrc);
  audioMessage.textContent = "Không tải được file LVLluuvaolong.mp3. Hãy kiểm tra tên file và bảo đảm file nằm cùng thư mục với index.html.";
});

audio.addEventListener("timeupdate", updateProgress);

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(progress.value) / 1000) * audio.duration;
    setRangeFill(progress, (Number(progress.value) / 1000) * 100);
  }
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
  setRangeFill(volume, Number(volume.value) * 100);
});

audio.volume = Number(volume.value);
setRangeFill(volume, Number(volume.value) * 100);
setRangeFill(progress, 0);

// Phát lại từ đầu.
document.getElementById("restartButton").addEventListener("click", () => {
  audio.currentTime = 0;
  if (audio.paused) togglePlayback();
});

// Tua đến gần cuối bài.
document.getElementById("restartEndButton").addEventListener("click", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = Math.max(0, audio.duration - 1);
  }
});

// Với một ca khúc duy nhất, nút ngẫu nhiên chỉ thể hiện trạng thái bật/tắt.
document.getElementById("shuffleButton").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const active = button.classList.toggle("active");
  button.setAttribute("aria-pressed", String(active));
});

document.getElementById("repeatButton").addEventListener("click", (event) => {
  audio.loop = !audio.loop;
  event.currentTarget.classList.toggle("active", audio.loop);
  event.currentTarget.setAttribute("aria-pressed", String(audio.loop));
  audioMessage.textContent = audio.loop ? "Đã bật lặp lại bài hát." : "Đã tắt lặp lại bài hát.";
});

document.getElementById("favoriteButton").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const active = button.classList.toggle("active");
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute("aria-label", active ? "Bỏ yêu thích bài hát" : "Yêu thích bài hát");
});
