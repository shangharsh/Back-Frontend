
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from 'react';
import { getData, updateData } from '../../../services/axios.service';
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
import NavbarComponent from '../../../components/Navbar';
import ReactPaginate from "react-paginate";


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
  const [product, setProduct] = useState<any>({
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
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [originalProduct, setOriginalProduct] = useState<any>({});
  const [categories, setCategories] = useState<any>([]);

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  let itemsPerPage = 3;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    setProduct({
      name: '',
      brand: '',
      price: '',
      description: '',
      category: '',
      productImage: '',
      countInStock: '',
    });
  };
  
  const {jwt} = useSelector((state: any)=> state.auth);


  const getProducts = async () =>{
    setIsLoading(true);
    const resp = await getData('/product');
    setProducts(resp.data);
    setOriginalProduct(resp.data);
    paginate(resp.data);
    const newCategories = resp.data.results.map((result: any)=>{
      return result.category;
    })
    setCategories([...new Set(newCategories)]);
    setIsLoading(false);
  }
  
  useEffect(() =>{
    getProducts();
  },[]);

  useEffect(()=>{
    if(originalProduct.status === 'success'){
      paginate(originalProduct);
    }
  },[itemOffset]);

  function paginate(items:any){
    const endOffset = itemOffset + itemsPerPage;
    //Generate data according to items per page.....
    const currentItems = items.results.slice(itemOffset, endOffset);
    console.log(currentItems);
    //Calculate total page..............
    setPageCount(Math.ceil(items.results.length / itemsPerPage));

    setProducts((prev:any)=>{
      return {...prev, results:currentItems, count: currentItems.length}
    });
  }
  
  const handleChange = (e: any) =>{
    setProduct((prev:any)=>{
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

  interface ProductInterface{
    name:string;
    brand:string;
    category:string;
    price:string;
    description:string;
    productImage:string;
    countInStock:string;
  }

  const handleUpdate = async (e: any) =>{
    e.preventDefault();
    console.log(product)

    // delete product['id']
    // delete product['_id']
    // delete product['createdAt']
   const resp = await updateData(`/product/${product.id}`, product,jwt);

   if(resp.status==='success'){
    const updatedProd = products.results.map((prod:any)=>{
      return prod.id === product.id ? resp.data : prod;
    })
    setProducts((prev:any)=>{
      return {...prev, results: updatedProd}
    })
    successToast('Product Updated.')
    setOpen(false);
    setEdit(false);
   }
  };

  const editProduct = (product: ProductInterface) =>{
    setOpen(true);
    setEdit(true);
    setProduct(product);
  }

  const handlePageChange = (event:any) => {
    const newOffset = (event.selected * itemsPerPage) % originalProduct.results.length;
    console.log(newOffset);
    setItemOffset(newOffset);
  };



  return (
    <TableContainer component={Paper}>
      {
        isLoading?(<Loader/>):(
          <>
          <Container>
            <NavbarComponent/>
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
                      <Button variant='primary' className='me-1' onClick={(e)=> editProduct(product)}>
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
          handleChange={handleChange} handleSubmit={handleSubmit} isSpinning={isSpinning}
          edit={edit} product={product} handleUpdate={handleUpdate}/>

        <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName="pagination"
        activeClassName="active"
      />
          </Container>
          </>
        )
      }
    </TableContainer>
  );
}

export default Products;