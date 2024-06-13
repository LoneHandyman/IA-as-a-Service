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
  canvas.width = 400;
  canvas.height = 400;

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

async function getObjectsFromBucket() {
  const metadataURL = encodeURIComponent(resultsBucketName + metadataFileName);
  var objMetadata;

  await $.getJSON(metadataURL, function(metadata) {objMetadata = metadata;});

  const frameScrollableList = document.getElementById('frame-list');
  frameScrollableList.innerHTML = '';

  objMetadata.forEach(async element => {
    const img = new Image();
    img.src = resultsBucketName + element.frame;

    img.onload = function() {
      console.log(img.width, img.height);
      const imgM = drawBoxes(img, element.objects);
      console.log(imgM, img);

      frameScrollableList.appendChild(imgM);
    };
  });

  return {objMetadata}
}

document.addEventListener('DOMContentLoaded', async function() {
  const searchButton = document.getElementById('search-button');

  searchButton.addEventListener('click', async function(event) {
    event.preventDefault();

    try {
      const frameScrollableList = document.getElementById('frame-list');
      frameScrollableList.innerHTML = '';

      const data = await getObjectsFromBucket();

      console.log(data.objMetadata);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
});
