# Modelado-proyecto
Codigo editor.md




![](https://www.espe.edu.ec/wp-content/uploads/2022/01/ESPEtransparente.png)


Nombres:
NRC: 10049
FECHA:13-07-2023


#### Importe de Librerias
Las lineas de codigo de cabecera importan las bibliotecas necesarias para realizar operaciones relacionadas con bases de datos MongoDB, manipulación de matrices y vectores numéricos, análisis de componentes principales y preprocesamiento de datos utilizando escalado estándar. Estas bibliotecas proporcionan las herramientas necesarias para realizar operaciones avanzadas en el código y son ampliamente utilizadas en el campo de la ciencia de datos y el aprendizaje automático.
```python
from pymongo import MongoClient
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
```
####  Establecer la conexión con la base de datos MongoDB
 Define la URI de conexión para la base de datos MongoDB. En este caso, se establece la URI local 'mongodb://localhost', lo que indica que la base de datos se encuentra en la máquina local.
Client se encarga de Crear una instancia de la clase MongoClient y establece la conexión con la base de datos MongoDB utilizando la URI especificada. La instancia client se utilizará posteriormente para interactuar con la base de datos.
```python
MONGO_URI = 'mongodb://localhost'
client = MongoClient(MONGO_URI)
```
#### Seleccionar la base de datos y la colección


db = client['Proyecto'] se encarga de seleccionar la base de datos llamada 'Proyecto' en la conexión establecida. en si es la base de datos a la que se desea acceder.


collection = db['grupal'] Se encarga de seleccionar la colección llamada 'grupal' dentro de la base de datos llamada Proyecto.
```python
db = client['Proyecto']
collection = db['grupal']
```


#### Contar los elementos en la colección
```python
number_of_products = collection.count_documents({})
print(number_of_products, "elementos en la colección")
```


![](https://scontent.fuio10-1.fna.fbcdn.net/v/t39.30808-6/359824719_299659805752916_2416028469696423354_n.jpg?_nc_cat=109&cb=99be929b-59f725be&ccb=1-7&_nc_sid=0debeb&_nc_eui2=AeHxS5XZgsdZv8kWSIXvhiskBe2cqXw_vgcF7ZypfD--B2IPLMJoJXK2h64bagbwdaO-gaCTx6Osq3yYx_Sw_Uet&_nc_ohc=fGm6ewsFE6cAX9QCcaJ&_nc_ht=scontent.fuio10-1.fna&oh=00_AfCfzZXq6LegdQlI9FnrjZBx29UkXpXmFwPycAW3x_KXPg&oe=64B5C051)
```python
try:
# Extracción de datos


#-Se imprime el mensaje "Iniciando extracción de datos".
#-Se utiliza el método find() de la colección para obtener todos los documentos de la  #-Colección seleccionada y se almacenan en la variable documents.
#-Imprime el mensaje "Extracción de datos finalizada".
	print("Iniciando extracción de datos")
	documents = collection.find()
	print("Extracción de datos finalizada")


	# Validación y transformación de datos
#-Imprime el mensaje "Iniciando validación y transformación de datos".
#Itera sobre cada documento en documents.
#Verifica si el documento contiene la clave 'price'.
#Si contiene la clave 'price', se intenta convertir el valor correspondiente a tipo float y   #Elimina las claves 'img' y 'purl' del documento.
    
#Si no contiene la clave 'price', se imprime un mensaje indicando que el documento es #descartado debido a una propiedad faltante.
#Los documentos válidos se agregan a la lista transformed_data.
#Se imprime el mensaje "Validación y transformación de datos finalizada".
#finalmente se imprime el mensaje "Validación y transformación de datos exitosa".
    
    
	print("Iniciando validación y transformación de datos")
	transformed_data = []
	for document in documents:
    	if 'price' in document:
        	try:
            	document['price'] = float(document['price'])
            	del document['img']  # Eliminar la columna 'img'
            	del document['purl']  # Eliminar la columna 'purl'
            	transformed_data.append(document)
        	except ValueError:
            	print(f"Documento descartado debido a un valor no numérico en 'price': {document}")
    	else:
        	print(f"Documento descartado debido a una propiedad faltante: {document}")
	print("Validación y transformación de datos finalizada")


	################################################################
	print("Validación y transformación de datos exitosa")
    
# Crear una matriz numpy con los datos transformados


#Se crea una matriz numpy llamada data utilizando comprensión de listas y la función #values() para obtener los valores de cada documento en transformed_data.


	data = np.array([list(document.values()) for document in transformed_data])


 # Extraer solo la columna de 'price'
    
#Se extrae la columna 'price' de la matriz data y se guarda en la variable data_price.
#Se utiliza la función reshape() para asegurarse de que tenga la forma adecuada para  #ser procesada.


	data_price = data[:, 1].reshape(-1, 1)


	# Normalizar los datos
	#Se crea una instancia de la clase StandardScaler() llamada scaler.
	#Se utiliza el método fit_transform() de scaler para normalizar los datos en
    #data_price y se guarda el resultado en la variable data_normalized.
    
	scaler = StandardScaler()
	data_normalized = scaler.fit_transform(data_price)


	# Proceso de PCA
	print("Iniciando proceso de PCA")


	# Aplicar el PCA solo si hay datos válidos
	if len(data_normalized) > 0:
    	# Verificar que haya suficientes datos para calcular al menos un componente principal
    	if len(data_normalized) > 1:
        	# Aplicar el PCA
        	pca = PCA(n_components=1)  # Especifica el número de componentes principales deseadas
        	data_transformed = pca.fit_transform(data_normalized)


        	# Crear una nueva colección llamada 'PCA'
        	collection_pca = db['PCA']


        	# Guardar los datos transformados en la colección 'PCA'
        	for i, document in enumerate(transformed_data):
            	document['pca_1'] = data_transformed[i][0]
            	del document['id']  # Eliminar la propiedad 'id'
            	collection_pca.insert_one(document)


        	print("Proceso de PCA finalizado")
    	else:
        	print("No hay suficientes datos para calcular al menos un componente principal")
	else:
    	print("No hay datos válidos para aplicar PCA")
   ################################################################
	print("EJECUCIÓN EXITOSA")


except Exception as e:
	print("Error durante la ejecución del proceso de ETL:", str(e))
```


### Proceso de Análisis de Componentes Principales (PCA):
Se imprime el mensaje "Iniciando proceso de PCA".
Se verifica si hay datos válidos en data_normalized.
Se verifica si hay suficientes datos para calcular al menos un componente principal.
Si hay suficientes datos, se crea una instancia de la clase PCA con n_components=1 para obtener solo el primer componente principal.
Se aplica el método fit_transform() de pca a data_normalized y se guarda el resultado en la variable data_transformed.
Se crea una nueva colección llamada 'PCA' utilizando db['PCA'] y se guarda en collection_pca.
Se itera sobre los documentos en transformed_data.
Se agrega la información del componente principal transformado a cada documento.
Se elimina la propiedad 'id' de cada documento.
Se utiliza el método insert_one() de collection_pca para insertar cada documento en la colección 'PCA'.
Se imprime el mensaje "Proceso de PCA finalizado".
Si no hay suficientes datos para calcular al menos un componente principal, se imprime el mensaje "No hay suficientes datos para calcular al menos un componente principal".
Si no hay datos válidos, se imprime el mensaje "No hay datos válidos para aplicar PCA".


### Ejecución python
![](https://scontent.fuio10-1.fna.fbcdn.net/v/t39.30808-6/359790223_299542665764630_3906310885665390985_n.jpg?_nc_cat=106&cb=99be929b-59f725be&ccb=1-7&_nc_sid=0debeb&_nc_eui2=AeGMNEry29IrEI3lUeYIcgbFnS9K1ZiUCpadL0rVmJQKlmKCzJlKklESUeikWxmwTDaVrzwUDnGMFNm-4_8rU7iY&_nc_ohc=3RZZ6WMRo-oAX8CIl8c&_nc_ht=scontent.fuio10-1.fna&oh=00_AfDrGk2XrMua1LBJLyES8Mfl_79fqzYkDPDbBQOuGMnotg&oe=64B4233E)




### El siguiente codigo tiene como finalidad:
Realizar la extracción de datos desde una base de datos MongoDB,
Realiza la transformación y validación de los datos,
Aplica el análisis de Componentes Principales (PCA) a los datos normalizados y
Guarda los datos transformados en una nueva colección llamada 'PCA' dentro de la base llamada Proyecto.
