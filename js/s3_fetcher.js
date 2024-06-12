// Importa la AWS SDK para Node.js
const AWS = require('aws-sdk');

// Configura las credenciales y la región de AWS
AWS.config.update({
  accessKeyId: 'TU_ACCESS_KEY_ID',
  secretAccessKey: 'TU_SECRET_ACCESS_KEY',
  region: 'TU_REGION'
});

// Crea un nuevo objeto S3 de la AWS SDK
const s3 = new AWS.S3();

// Función para obtener los datos del bucket de S3
async function fetchDataFromS3() {
  try {
    // Obtiene el JSON de metadata del bucket
    const metadataObject = await s3.getObject({ Bucket: 'NOMBRE_DEL_BUCKET', Key: 'metadata.json' }).promise();
    const metadataJSON = JSON.parse(metadataObject.Body.toString('utf-8'));

    // Obtiene la lista de imágenes del bucket
    const imageListObject = await s3.listObjectsV2({ Bucket: 'NOMBRE_DEL_BUCKET', Prefix: 'imagenes/' }).promise();
    const imageList = imageListObject.Contents.map(image => image.Key);

    return { metadata: metadataJSON, images: imageList };
  } catch (error) {
    console.error('Error fetching data from S3:', error);
    throw error;
  }
}

// Ejemplo de uso de la función fetchDataFromS3
async function main() {
  try {
    const data = await fetchDataFromS3();
    console.log('Metadata:', data.metadata);
    console.log('Image List:', data.images);
    // Aquí puedes realizar otras operaciones con los datos obtenidos
  } catch (error) {
    console.error('Main error:', error);
  }
}

// No se llama a la función fetchDataFromS3 aquí, se puede llamar cuando sea necesario
