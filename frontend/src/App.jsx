import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Header from "./components/Header";
import ProductCatalogue from "./pages/ProductCatalogue";
import Home from "./pages/Home";
import MyCart from "./pages/MyCart";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path='/' element={<Header/>}/>
                    <Route index element={<Home/>}/>
                    <Route path='products' element={<ProductCatalogue/>}/>
                    <Route path='cart' element={<MyCart/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='register' element={<Register/>}/>
                </Routes>
                <Footer/>
            </BrowserRouter>
        </>
    );
}

export default App;
