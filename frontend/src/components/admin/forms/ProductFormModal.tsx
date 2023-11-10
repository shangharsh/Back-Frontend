
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Col, Row } from 'react-bootstrap';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import ButtonSpinner from '../../Loader/Spinner';

const ProductFormModal = ({open, handleClose, categories, handleChange, handleSubmit, isSpinning}: any) => {

  return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Product Form</DialogTitle>
        <DialogContent>
          <Row>
            <Col>
            <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Product Name"
            type="text"
            name='name'
            fullWidth
            variant="outlined"
            required
            onChange={handleChange}
          />
            </Col>
            <Col>
            <TextField
            autoFocus
            margin="dense"
            id="price"
            name='price'
            label="Product Price"
            type="text"
            fullWidth
            variant="outlined"
            required
            onChange={handleChange}
          />
            </Col>
          </Row>
          <Row>
            <Col>
            <TextField
            autoFocus
            margin="dense"
            id="countInStock"
            name="countInStock"
            label="Product Count"
            type="number"
            fullWidth
            variant="outlined"
            required
            onChange={handleChange}
          />
            </Col>
            <Col>
            <TextField
            autoFocus
            margin="dense"
            id="brand"
            name="brand"
            label="Product Brand"
            type="text"
            fullWidth
            variant="outlined"
            required
            onChange={handleChange}
          />
            </Col>
          </Row>
          <Row>
            <Col>
            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select label='category' name='category' onChange={handleChange}>
                    {categories.map((category:any)=>{
                        return (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                        ) 
                    })}
                </Select>
            </FormControl>
            </Col>
            <Col>
            <TextField
            autoFocus
            margin="dense"
            id="description"
            name="description"
            label="Product Description"
            type="text"
            fullWidth
            variant="outlined"
            required
            onChange={handleChange}
          />
            </Col>
          </Row>
          <Row>
            <Col>
            <TextField type='file' id='productImage' name='productImage' margin='normal' fullWidth variant='outlined' required onChange={handleChange}/>
            </Col>
          </Row>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant='outlined' disabled={isSpinning} onClick={handleSubmit}>{isSpinning?<ButtonSpinner/>: 'submit'}</Button>
        </DialogActions>
      </Dialog>
  );
}

export default ProductFormModal;
