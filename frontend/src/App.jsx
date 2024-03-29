import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Header from "./components/Header";
import ProductCatalogue from "./pages/ProductCatalogue";
import Home from "./pages/Home";
import MyCart from "./pages/MyCart";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Profile from './pages/Profile'
import {ToastContainer} from 'react-toastify'
import MyOrders from "./pages/MyOrders";

function App() {
    return (<>
            <BrowserRouter>
                <div style={{minHeight: "90vh"}}>
                    <Header/>
                    <Routes>
                        <Route path='/' element={<Header/>}/>
                        <Route index element={<Home/>}/>
                        <Route path='products' element={<ProductCatalogue/>}/>
                        <Route path='cart' element={<MyCart/>}/>
                        <Route path='login' element={<Login/>}/>
                        <Route path='register' element={<Register/>}/>
                        <Route path='payment' element={<Payment/>}/>
                        <Route path='profile' element={<Profile/>}/>
                        <Route path='orders' element={<MyOrders/>}/>
                    </Routes>
                    <ToastContainer/>
                </div>
                <Footer/>
            </BrowserRouter>
        </>);
}

export default App;
