import React from 'react'
import { useContext } from 'react';
import { FirebaseContext } from '../firebase';
import { Link } from 'react-router-dom';
import { ref,deleteObject } from '@firebase/storage';
import { storage } from '../configFirebase';

export default function Productos({producto}) {

  // context de firebase para cambios en la BD
  const { firebase } = useContext(FirebaseContext)

  const {id, name, quantity,image} = producto;

           //FUNCIO BUSCAR IMAGEN Y ELIMINARLA 
        
         // Delete the old image from Firestore
         const deleteImage = async (folder, imageName) => {
            const imageRef = ref(storage, `${folder}/${imageName}`);
          
            try {
              await deleteObject(imageRef);
              console.log("Image deleted successfully!");
            } catch (error) {
              console.error("Error deleting image: ", error);
            }
          };

          //TERMINA FUNCION ELIMINAR


  const handleBorrarCliente = () => {
    if (window.confirm('¿Estás seguro de que deseas borrar este cliente?')) {
      deleteImage('files', image);
      // Utiliza la referencia adecuada a la ubicación de Firebase que deseas borrar
      const clienteRef = firebase.db.collection('products').doc(producto.id);

      clienteRef
        .delete()
        .then(() => {
          console.log('Cliente borrado con éxito');
        })
        .catch((error) => {
          console.error('Error al borrar el cliente:', error);
        });
    }
  };

  return (
    <tr key={producto.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    <td className="px-6 py-4">
      {name}                         
    </td>
    <td className="px-6 py-4">
      {quantity}
    </td>
    <td className="px-6 py-4 text-center flex text-lg">   
      <Link to={`/editar/${id}`} className="  bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </Link>
      
      <button className=" bg-red-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold" onClick={handleBorrarCliente}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>  
      </button>
    </td>
  </tr>
  )
}
