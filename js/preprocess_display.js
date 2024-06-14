const colors = [
  '#FF0000', // Rojo
  '#008000', // Verde
  '#0000FF', // Azul
  '#FFA500', // Naranja
  '#008080', // Verde claro
  '#FFC0CB', // Rosa
  '#00FF00', // Verde intenso
  '#000000', // Negro
  '#FFFFFF', // Blanco
  '#808080', // Gris claro
  '#C0C0C0', // Gris oscuro
];

var resultsBucketName = 'test/Park/';
var metadataFileName = 'objects_info.json';
/*
AWS.config.region = "REGION";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "IDENTITY_POOL_ID",
});

var s3 = new AWS.S3({
  apiVersion: "API_VERSION",
  params: { Bucket: resultsBucketName },
});
*/

function drawBoxes(image, metadata) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  
  metadata.forEach(obj => {
    const [x, y, width, height] = obj.box;
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width - x, height - y);
    ctx.font = '12px Arial';
    ctx.fillStyle = color;
    ctx.fillText(obj.label, x, y - 5);
  });

  const modImage = new Image();

  modImage.src = canvas.toDataURL();
  return modImage;
}

function showLargeImage(src) {
  let modal = document.getElementById('image-modal');
  if (!modal) {
      modal = document.createElement('div');
      modal.id = 'image-modal';
      document.body.appendChild(modal);
  }

  const img = document.createElement('img');
  img.src = src;

  modal.innerHTML = '';
  modal.appendChild(img);

  modal.addEventListener('click', function(e) {
    if (e.target === this) {
        document.body.removeChild(modal);
    }
});
}

async function getObjectsFromBucket() {
  const metadataURL = encodeURIComponent(resultsBucketName + metadataFileName);
  var objMetadata;

  await $.getJSON(metadataURL, function(metadata) {objMetadata = metadata;});

  const frameScrollableList = document.getElementById('image-selector');
  frameScrollableList.innerHTML = '';

  objMetadata.forEach(async element => {
    const img = new Image();
    img.src = resultsBucketName + element.frame;

    img.onload = function() {
      const imgM = drawBoxes(img, element.objects);
      const lItem = document.createElement('li');
      lItem.appendChild(imgM);

      lItem.onclick = function(){
        showLargeImage(imgM.src);
      }

      frameScrollableList.appendChild(lItem);
    };
  });

  return {objMetadata}
}

document.addEventListener('DOMContentLoaded', async function() {
  const searchButton = document.getElementById('lambda-button');

  searchButton.addEventListener('click', async function(event) {
    event.preventDefault();

    try {
      const data = await getObjectsFromBucket();

      console.log(data.objMetadata);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
});
