const dotenv = require('dotenv');

dotenv.config(); // hace accesibles las variables de entorno

module.exports = {
  port: 3000,
  dbConnectionUri: "mongodb+srv://diego:123@clusteruvg.aryjpty.mongodb.net/?retryWrites=true&w=majority&appName=clusterUVG"
};
