import NavbarComponent from "../../../components/Navbar";
import {useState, useEffect} from 'react';
import { getData } from "../../../services/axios.service";
import { Col, Row } from "react-bootstrap";
import ProductList from "../../../components/user/ProductList";


const UserProducts = () => {
    const [products, setProducts] = useState<any>({});

    const getproducts = async () => {
        const resp = await getData('/product');
        setProducts(resp.data);
    }

    useEffect(()=> {
        getproducts();
    }, []);
  return (
    <>
    <NavbarComponent/>
    {
        products.status === 'success' &&(
            <Row>
                {
                    products.results.map((product: any) =>{
                        return (
                            <Col key={product.id} sm={12} md={6} lg={4} xs ={3}>
                            <ProductList product={product}/>
                        </Col>
                        )
                    })
                }
            </Row>
    )}
    </>
  );
};

export default UserProducts;