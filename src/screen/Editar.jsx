import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { FirebaseContext } from "../firebase";
import Navbar from "../components/Navbar";
import { doc, updateDoc } from "firebase/firestore";
import {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";
import { storage } from "../firebase/config";
import { db } from "../configFirebase";
import Swal from "sweetalert2";

export default function Editar() {
  //NAVEGACION
  const navigate = useNavigate();

  //TRAE ID DE URL
  const { id } = useParams();

  //VARIABLES
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Context con las operaciones de firebase
  const { firebase } = useContext(FirebaseContext);

  //FUNCION PARA LLENAR LOS VALUES
  useEffect(() => {
    obtenerCursos(id);
  }, [id]);

  const obtenerCursos = (id) => {
    firebase.db.collection("products").doc(id).onSnapshot(manejarSnapshot);
  };

  //FUNCION PARA GUARDAR LOS DATOS
  function manejarSnapshot(snapshot) {
    const curso = snapshot.data();

    if (curso) {
      //inserta datos
      setName(curso.name);
      setQuantity(curso.quantity);
      setImage(curso.image);
      setImageUrl(curso.imageUrl);
    }
  }
  //TOMA DEL HANDLESUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target[0]?.value;
    const quantity = e.target[1]?.value;
    const file = e.target[2]?.files[0];

    //FUNCIO BUSCAR IMAGEN Y ELIMINARLA

    // Delete the old image from Firestore
    const deleteImage = async (folder, imageName) => {
      const imageRef = ref(storage, `${folder}/${imageName}`);

      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting image: ", error);
      }
    };

    //TERMINA FUNCION ELIMINAR

    if (file) {
      //LLAMADO BORRAR IMAGEN
      deleteImage("files", image);
      //INSERTAR IMAGEN
      const storageRef = ref(storage, `files/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      //VALIDACION
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // No need for handling unsuccessful uploads here, as errors will be handled in the next callback
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        () => {
          //TRAME EL LA URL DEL ARCHIVP
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Update the data in Firestore
            const productDocRef = doc(db, "products", id);
            updateDoc(productDocRef, {
              name: name,
              quantity: quantity,
              image: name,
              imageUrl: downloadURL,
            })
              .then(() => {
                //ALERTA
                Swal.fire({
                  title: "Good job!",
                  text: "You clicked the button!",
                  icon: "success",
                });
                //MANDAR A RAIZ
                navigate("/");
              })
              .catch((error) => {
                //ERROR
                console.error("Error updating document: ", error);
              });
          });
        }
      );
    } else {
      // Update the data in Firestore
      const productDocRef = doc(db, "products", id);
      //FUNCION EDITAR
      updateDoc(productDocRef, {
        name: name,
        quantity: quantity,
      })
        .then(() => {
          //ALERTA DE EXITO
          Swal.fire({
            title: "Good job!",
            text: "You clicked the button!",
            icon: "success",
          });
          //NAVEGACION A RAIZ
          navigate("/");
        })
        .catch((error) => {
          //MENSAJE DE ERROR
          console.error("Error updating document: ", error);
        });
    }
  };

  return (
    <div className="App">
      <Navbar />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16 shadow-xl rounded-xl">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Edit a new product
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Product Name
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                  required=""
                  onChange={(event) => setName(event.target.value)}
                  value={name}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Precio
                </label>
                <input
                  type="number"
                  name="precio"
                  id="precio"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="$2999"
                  required=""
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
              </div>
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Archivo
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required=""
                />
              </div>
              <div className="flex justify-center">
                <img src={imageUrl} alt="" className="w-[13rem] rounded-xl" />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-blue-800"
            >
              Add product
            </button>
            <Link
              to="/"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-red-800"
            >
              Cancel
            </Link>
          </form>
        </div>
      </section>
    </div>
  );
}
