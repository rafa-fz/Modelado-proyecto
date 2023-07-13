from pymongo import MongoClient
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

MONGO_URI = 'mongodb://localhost'

client = MongoClient(MONGO_URI)

db = client['Proyecto']  # nombre de la base de datos
collection = db['grupal']
print("Conexión establecida")

# Contar datos de mi colección
number_of_products = collection.count_documents({})
print(number_of_products, "elementos en la colección")

# Mineria de Datos
print("Minería de datos")

try:
    ################################################################

    # Extracción de datos
    print("Iniciando extracción de datos")
    documents = collection.find()
    print("Extracción de datos finalizada")

    # Validación y transformación de datos
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
    data = np.array([list(document.values()) for document in transformed_data])

    # Extraer solo la columna de 'price'
    data_price = data[:, 1].reshape(-1, 1)

    # Normalizar los datos
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
