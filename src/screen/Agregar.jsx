import { useState } from 'react';
import { storage , db} from '../configFirebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Agregar() {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = e.target[0]?.files[0];
    const name = e.target[1]?.value;
    const quantity = e.target[2]?.value;

    if (!file) return;

    const storageRef = ref(storage, `files/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", 
      (snapshot) => {
        // No need for handling unsuccessful uploads here, as errors will be handled in the next callback
      }, 
      (error) => {
        console.error('Upload failed:', error);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addDoc(collection(db, "products"), {
            name: name,
            quantity: quantity,
            image:name,
            imageUrl: downloadURL
          }).then(() => {
            navigate("/");
          }).catch((error) => {
            console.error("Error writing document: ", error);
          });
        });
      }
    );
  }      

  return (
    <div className="App">
      <Navbar/>
      <form className='form' onSubmit={handleSubmit}>
        <input type='file' />
        <input type='text' placeholder='Name' />
        <input type='number' placeholder='Quantity' />
        <button type='submit'>Upload</button>
      </form>
    </div>
  );
}
