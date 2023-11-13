import { useState, useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FirebaseContext } from '../firebase';
import Navbar from '../components/Navbar';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytesResumable,getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase/config';
import { db } from '../configFirebase';

export default function Editar() {

    const navigate = useNavigate();

   const { id } = useParams();

    const [name,setName] = useState("");
    const [quantity ,setQuantity]  = useState("");
    const [image,setImage] = useState("");
    const [imageUrl,setImageUrl] = useState("");

   // Context con las operaciones de firebase
   const { firebase } = useContext(FirebaseContext);

   useEffect(() => {
       obtenerCursos(id);
     }, [id]);

     const obtenerCursos = (id) => {
       firebase.db.collection('products').doc(id).onSnapshot(manejarSnapshot);
     };

     function manejarSnapshot(snapshot) {
        const curso = snapshot.data();
      
        if (curso) {
          //inserta datos
          setName(curso.name)
          setQuantity(curso.quantity)
          setImage(curso.image)
          setImageUrl(curso.imageUrl)
        }
      }
      

     //funcion editar

     const handleSubmit = async (e) => {
        e.preventDefault();
      
        const file = e.target[0]?.files[0];
        const name = e.target[1]?.value;
        const quantity = e.target[2]?.value;

         //FUNCIO BUSCAR IMAGEN Y ELIMINARLA 
        
         // Delete the old image from Firestore
         const deleteImage = async (folder, imageName) => {
            const imageRef = ref(storage, `${folder}/${imageName}`);
          
            try {
              await deleteObject(imageRef);
              console.log("Image deleted successfully!");
              navigate('/')
            } catch (error) {
              console.error("Error deleting image: ", error);
            }
          };

          //TERMINA FUNCION ELIMINAR

            if (file) {
                deleteImage('files', image);
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
   
                      // Update the data in Firestore
                      const productDocRef = doc(db, "products", id);
                      updateDoc(productDocRef, {
                        name: name,
                        quantity: quantity,
                        image:name,
                        imageUrl: downloadURL
                      }).then(() => {
                       
                        navigate("/");
                      }).catch((error) => {
                        console.error("Error updating document: ", error);
                      });
                    });
                  }
                );
            }else{
                                      // Update the data in Firestore
                                      const productDocRef = doc(db, "products", id);
                                      updateDoc(productDocRef, {
                                        name: name,
                                        quantity: quantity,
                                      }).then(() => {
                                       
                                        navigate("/");
                                      }).catch((error) => {
                                        console.error("Error updating document: ", error);
                                      });
            }
      };
      


 return (
  <div className="App">
    <Navbar />
    <form className="form" onSubmit={handleSubmit} >
        <input 
            className='bg-red-700 mr-10' 
            type='file' 
 
        />
        <input 
            type='text' 
            placeholder='Name' 
            value={name}
            onChange={(event) => setName(event.target.value)}
        />
        <input 
            type='number' 
            placeholder='Quantity' 
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
        />
        <button className='px-10 py-2 bg-red-900 text-white rounded-xl mx-10' type="submit">Upload</button>
    </form>
    <div className='p-10'>
        <h1 className='font-bold text-3xl mb-10'>{image}</h1>
        
        <img src={imageUrl} alt="" />

        </div>
  </div>
 );
}
