const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json()); 

const port = 5122;

// Arreglo de puertos disponibles
const dbURLs = [
  'mongodb://localhost:27217/Salida',
];

// Función para comprobar la conexión a la base de datos
const connectToDatabase = async (url, index) => {
  try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true,connectTimeoutMS: 1000 });
    
    const secondElement = dbURLs[index]; // Almacenar el segundo elemento en una variable
    dbURLs.splice(index, 1); // Eliminar el segundo elemento del arreglo
    dbURLs.unshift(secondElement); // Insertar el elemento almacenado en la primera posición
    console.log(`Todo bien en ${url}:`);
    return true;
  } catch (error) {
    // Si hay un error de conexión, muestra un mensaje y elimina el URL fallido
    console.error(`Error al conectar a la base de datos en ${url}:`, error);
   
    return false;
  }
};

// Ruta para comprobar la conexión a las bases de datos
app.get('/check-connection', async (req, res) => {
  let isConnected = false;
  let currentIndex = 0;

  while (!isConnected && currentIndex < dbURLs.length) {
    isConnected = await connectToDatabase(dbURLs[currentIndex], currentIndex);
    currentIndex++;
  }

  if (isConnected) {
    res.status(200).json({ message: 'Conexión exitosa a la base de datos' });
  } else {
    res.status(500).json({ message: 'No se pudo establecer conexión a ninguna base de datos' });
  }
});

// Definir el esquema del modelo
const productSchema = new mongoose.Schema({
  name: String,
  price:Number ,
  mrp: Number,
  rating: Number,
  ratingTotal:Number ,
  discount:Number ,
  seller: String,
  pca_1: Number

});

const Productos = mongoose.model('Product', productSchema, 'products');



// Listar Productos
app.get('/products', async (req, res) => {
  try {
    // Verificar la conexión a la base de datos
    const connectionResponse = await axios.get(`http://localhost:${port}/check-connection`);
    if (connectionResponse.status !== 200) {
      throw new Error('No se pudo establecer conexión a la base de datos');
    }

    const data = await Productos.find().sort({ _id: -1 }) // Ordenar por _id en orden descendente (últimos registros primero)
      .limit(100); // Limitar el resultado a los últimos 100 registros
;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar Productos por id
app.get('/products/:id', async (req, res) => {
  try {
    // Verificar la conexión a la base de datos
    const connectionResponse = await axios.get(`http://localhost:${port}/check-connection`);
    if (connectionResponse.status !== 200) {
      throw new Error('No se pudo establecer conexión a la base de datos');
    }

    const data = await Productos.findById(req.params.id);
    if (!data) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
