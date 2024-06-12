document.getElementById('video-input').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const videoURL = URL.createObjectURL(file);
    const video = document.getElementById('video-preview');
    video.src = videoURL;
    video.load();
    video.currentTime = 0;
  }
});