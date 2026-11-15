// File nhạc cần đặt cùng thư mục với index.html và tên đúng là:
// luu-vao-long.mp3
const AUDIO_FILE = "LVLluuvaolong.mp3";

// Lời bài hát và hợp âm. Cú pháp [C], [Am], [F], [G] sẽ tạo hộp hợp âm.
const verses = [
  [
    "[C] Vừa đây thôi",
    "Mình ngân nga [Am] những câu chuyện qua",
    "Dòng thời gian thôi đưa [F]",
    "Lặng nhìn cơn mưa, lòng chợt nhớt những kỉ niệm xưa [G]"
  ],
  [
    "[C] Nhớ phút giây ngày ấy",
    "Có bạn và ta [Am]",
    "[F] Có những khoảnh khắc",
    "Chúng mình hoà ca [G]"
  ],
  [
    "[C] Sẽ có những lúc, trái tim u buồn [Am]",
    "[F] Sẽ có những phút ta chẳng [G] hiểu nhau",
    "[C] Bạn bè phải cùng nhau [Am]",
    "Những tình cảm ấy [F] sẽ rồi phải xa [G]"
  ],
  [
    "[C] Ngày mai sau ta chẳng gặp lại nhau",
    "[Am] Những thành phố lớn mỗi đứa đi một hướng",
    "[F] Chung bước đi chỉ là, [G] mỗi đứa đi một ngã",
    "Sau giấc mơ này rồi cũng phải chia xa"
  ],
  [
    "[C] Dòng thời gian sau chẳng thể ngừng trôi",
    "[Am] Để ta thấy những kỉ niệm ở đây",
    "Sẽ ít thôi nhưng yêu nhiều",
    "Sẽ mến nhau thêm thân nhiều",
    "Xin thời gian cứ trôi, cứ trôi chậm lại thôi",
    "Để tôi còn được ở đây"
  ]
];

const audio = document.getElementById("audio");
const playerCard = document.querySelector(".player-card");
const playButton = document.getElementById("playButton");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentTimeLabel = document.getElementById("currentTime");
const durationLabel = document.getElementById("duration");
const audioMessage = document.getElementById("audioMessage");

// Render lời ca thành các dòng, tách riêng hộp hợp âm khỏi phần lời.
const lyricsContent = document.getElementById("lyricsContent");
verses.forEach((verse) => {
  const verseElement = document.createElement("div");
  verseElement.className = "lyric-verse";

  verse.forEach((line) => {
    const lineElement = document.createElement("div");
    lineElement.className = "lyric-line";

    const parts = line.split(/(\[(?:C|Am|F|G)\])/g).filter(Boolean);
    parts.forEach((part) => {
      const chordMatch = part.match(/^\[(C|Am|F|G)\]$/);
      if (chordMatch) {
        const chord = document.createElement("span");
        chord.className = "chord-chip";
        chord.textContent = chordMatch[1];
        lineElement.appendChild(chord);
      } else {
        const text = document.createElement("span");
        text.className = "lyric-text";
        text.textContent = part;
        lineElement.appendChild(text);
      }
    });
    verseElement.appendChild(lineElement);
  });
  lyricsContent.appendChild(verseElement);
});

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
    progress.value = String(Math.round((current / duration) * 1000));
    setRangeFill(progress, (current / duration) * 100);
  } else {
    progress.value = "0";
    setRangeFill(progress, 0);
  }
}

async function togglePlayback() {
  if (audio.paused) {
    try {
      await audio.play();
      audioMessage.textContent = "Đang phát: Lưu vào lòng";
    } catch (error) {
      audioMessage.textContent = "Chưa phát được nhạc. Hãy tải đúng file luu-vao-long.mp3 lên repository.";
    }
  } else {
    audio.pause();
  }
}

playButton.addEventListener("click", togglePlayback);
audio.addEventListener("play", () => playerCard.classList.add("is-playing"));
audio.addEventListener("pause", () => playerCard.classList.remove("is-playing"));
audio.addEventListener("ended", () => {
  playerCard.classList.remove("is-playing");
  if (!audio.loop) audioMessage.textContent = "Bài hát đã phát xong. Nhấn Play để nghe lại.";
});
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("loadedmetadata", () => {
  durationLabel.textContent = formatTime(audio.duration);
  audioMessage.textContent = "Chạm nút Play để nghe ca khúc của tập thể 12A14.";
  updateProgress();
});
audio.addEventListener("error", () => {
  audioMessage.textContent = "Chưa tìm thấy file nhạc. Hãy tải luu-vao-long.mp3 lên cùng thư mục với index.html.";
});

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

// Nút tua về đầu và tua đến gần cuối bài.
document.getElementById("restartButton").addEventListener("click", () => {
  audio.currentTime = 0;
  if (audio.paused) togglePlayback();
});
document.getElementById("restartEndButton").addEventListener("click", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = Math.max(0, audio.duration - 1);
  }
});

// Bật/tắt phát ngẫu nhiên (một bài đơn nên nút này chỉ đổi trạng thái giao diện).
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
