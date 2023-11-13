import { useState } from "react";
import { storage, db } from "../configFirebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Agregar() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target[0]?.value;
    const quantity = e.target[1]?.value;
    const file = e.target[2]?.files[0];

    if (!file) return;

    const storageRef = ref(storage, `files/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // No need for handling unsuccessful uploads here, as errors will be handled in the next callback
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addDoc(collection(db, "products"), {
            name: name,
            quantity: quantity,
            image: name,
            imageUrl: downloadURL,
          })
            .then(() => {
              Swal.fire({
                title: "Good job!",
                text: "You clicked the button!",
                icon: "success",
              });
              navigate("/");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        });
      }
    );
  };

  return (
    <div className="App">
      <Navbar />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16 shadow-xl rounded-xl">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
            Add a new product
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
