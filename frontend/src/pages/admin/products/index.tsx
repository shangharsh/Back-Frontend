
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
import {Button} from 'react-bootstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { config } from '../../../config';
import { errorToast } from '../../../services/toaster.service';

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
  const [isLoading, setIsLoading] = useState(false);

  const {jwt} = useSelector((state: any)=> state.auth);
  const getProducts = async () =>{
    setIsLoading(true);
    const resp = await getData('/product');
    setProducts(resp.data);
    setIsLoading(false);
  }

  useEffect(() =>{
    getProducts();
  },[]);

  const deleteProduct = async (id: string) =>{
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
    } catch (error: any){
      errorToast(error.response.data.error);
    }
  };


  return (
    <TableContainer component={Paper}>
      {
        isLoading?(<Loader/>):(
          <>
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
                      <Button variant='danger' className='ms-1' onClick={(e)=>deleteProduct(product.id)}>
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
          </>
        )
      }
    </TableContainer>
  );
}

export default Products;