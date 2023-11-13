import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Productos from "../components/Productos";
import { FirebaseContext } from "../firebase";

export default function Home() {
  //Llama a firebase
  const { firebase } = useContext(FirebaseContext);

  //define la constante donde se guardan los datos
  const [productos, setProductos] = useState([]);

  //Consultar la base de datos al cargar la pagina
  useEffect(() => {
    const obtenerProductos = () => {
      firebase.db.collection("products").onSnapshot(manejarSnapshot);
    };

    //Ejecutar funcion
    obtenerProductos();
  }, []);

  //llamado ala base en tiempo real
  function manejarSnapshot(snapshot) {
    const productos = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    //alamacena en el useState
    setProductos(productos);
  }

  return (
    <div className="w-full bg-gray-100 h-screen text-black">
      <Navbar />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="py-5">
                <div className="min-[422px]:flex min-[375px]:block min-[375px]:text-center min-[422px]:justify-between ">
                  <h3 className="font-bold text-3xl min-[375px]:mb-5 min-[422px]:mb-0">
                    Agregar Productos
                  </h3>
                  <Link
                    to="/añadir"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Agregar productos
                  </Link>
                </div>
              </div>
              <div className="relative overflow-x-auto min-[375px]:mt-4 ">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        quantity
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <Productos key={producto.id} producto={producto} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
