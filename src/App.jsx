import Agregar from "./screen/Agregar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './screen/Home'
import firebase, {FirebaseContext} from "./firebase";
import Editar from "./screen/Editar";

function App() {

 return (
    
        <FirebaseContext.Provider
      value={{
        firebase
      }}
    >
            <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} ></Route>
        <Route path="/añadir" element={<Agregar/>} ></Route>
        <Route path="/editar/:id" element={<Editar/>} ></Route>
      </Routes>
      </BrowserRouter>
    </FirebaseContext.Provider>
    
 );
}

export default App;
