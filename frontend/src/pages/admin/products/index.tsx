
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from 'react';
import { getData } from '../../../services/axios.service';
import Loader from '../../../components/Loader';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import {Button, Container} from 'react-bootstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { config } from '../../../config';
import { errorToast, successToast } from '../../../services/toaster.service';
import ProductFormModal from '../../../components/admin/forms/ProductFormModal';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Products=()=> {

  const [products, setProducts] = useState<any>({});
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    category: '',
    productImage: '',
    countInStock: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [categories, setCategories] = useState<any>([]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {jwt} = useSelector((state: any)=> state.auth);
  const getProducts = async () =>{
    setIsLoading(true);
    const resp = await getData('/product');
    setProducts(resp.data);
    const newCategories = resp.data.results.map((result: any)=>{
      return result.category;
    })
    setCategories([...new Set(newCategories)]);
    setIsLoading(false);
  }

  useEffect(() =>{
    getProducts();
  },[]);

  const handleChange = (e: any) =>{
    setProduct((prev)=>{
      return {
        ...prev, [e.target.name]: e.target.name === 'productImage'? e.target.files[0]: e.target.value,
      };
    })
  }

  const deleteProduct = async (e: any, id: string) =>{
    e.preventDefault();
    console.log(id);
    try{
      const response = await axios.delete(`${config.SERVER_URL}/product/${id}`,{
        headers:{
          Authorization: `Bearer ${jwt}`,
        },
      });

      const deleteHandler = products.results.filter((product: any)=>{
        return product.id !== id;
      });
      setProducts((prev: any)=>{
        return {...prev,results:deleteHandler, count:deleteHandler.length};
      });
      successToast('Product Deleted Successfully');
      console.log(response)
    } catch (error: any){
      errorToast(error.response.data.error);
    }
  };

  const handleSubmit = async (e:any) =>{
    e.preventDefault();
    setIsSpinning(true);
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('brand', product.brand);
    formData.append('description', product.description);
    formData.append('productImage', product.productImage);
    formData.append('countInStock', product.countInStock);

    try{
      const {data} = await axios.post(`${config.SERVER_URL}/product`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
  
  
      if (data.status === 'success'){
        setProducts((prev:any)=>{
          return {...prev, results: [data.data, ...prev.results]};
        });
        successToast('Product Added Successfully');
        setOpen(false);
        setIsSpinning(false);
      }
    }catch(error: any){
      errorToast(error.response.data.error);
      setIsSpinning(false);
    }
  };


  return (
    <TableContainer component={Paper}>
      {
        isLoading?(<Loader/>):(
          <>
          <Container>
          <Button variant='primary' className='text-center mt-2 mb-2' onClick={handleClickOpen}> Add Product</Button>
          {products.status === 'success' && (
            <Table sx={{ minWidth: 100 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Brand</StyledTableCell>
                <StyledTableCell>Created At</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                products.results.map((product: any)=>{
                  return (
                    <StyledTableRow key={product.id}>
                  <StyledTableCell component="th" scope="row">
                    <img src={product.productImage} alt="product image" height={100} width={100} />
                  </StyledTableCell>
                  <StyledTableCell>{product.name}</StyledTableCell>
                  <StyledTableCell>{product.price}</StyledTableCell>
                  <StyledTableCell>{product.category}</StyledTableCell>
                  <StyledTableCell>{product.brand}</StyledTableCell>
                  <StyledTableCell>{moment(product.createdAt).format("YYYY-MM-DD")}</StyledTableCell>
                  <StyledTableCell>
                      <Button variant='primary' className='me-1'>
                        <FaEdit/>
                      </Button>
                      <Button variant='danger' className='ms-1' onClick={(e)=>deleteProduct(e,product.id)}>
                        <AiFillDelete/>
                      </Button>
                  </StyledTableCell>
                </StyledTableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          )}
          <ProductFormModal open={open} handleClose={handleClose} categories={categories}
          handleChange={handleChange} handleSubmit={handleSubmit} isSpinning={isSpinning}/>
          </Container>
          </>
        )
      }
    </TableContainer>
  );
}

export default Products;