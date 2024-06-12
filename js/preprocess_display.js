async function logMetadata(objURL) {
  $.getJSON('https://api.allorigins.win/get?url=' + encodeURIComponent(objURL), function (data) {
    console.log(data.contents);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('search-button');

  searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    
    const s3URL = 'https://raw.githubusercontent.com/LoneHandyman/IA-as-a-Service/main/test/Park/';
    const imageList = [];

    logMetadata(s3URL)

    //const imagePath = `${objFolder}000${i}.jpg`;
    //imageList.push(imagePath);
  });
});

function drawRectangles(img, objectsMetadata) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  objectsMetadata.forEach(obj => {
    const [x, y, width, height] = obj.box;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width - x, height - y);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(obj.label, x, y - 5);
  });

  img.replaceWith(canvas);
}
