import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Rating from '@mui/material/Rating';
import moment from 'moment';
import { BsFillCartCheckFill } from 'react-icons/bs';

const ProductList = ({product}: any) => {
  return (
    <Card sx={{ maxWidth: 345 }} className='mt-4'>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="add to cart">
            <BsFillCartCheckFill/>
          </IconButton>
        }
        title={product.name}
        subheader={moment(product.createdAt).format('lll')}
      />
      <CardMedia
        component="img"
        height="194"
        image={product.productImage}
        alt={product.name}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
        {product.description.slice(0,23)+"..."}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        Rs. {product.price}
        </Typography>
        <Rating name='read-only' value={product.averageRating} precision={0.5} readOnly/>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="view">
          <VisibilityIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
export default ProductList;





