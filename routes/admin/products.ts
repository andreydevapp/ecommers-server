import {Router,Request,Response,NextFunction} from 'express';
import {newProduct, getProducts, getProduct, getProductUrl, putProductWhitImagen, putProduct, deleteProduct, getProductsStoreCategory, filterProduct, saveTypeProduct, putTypeProduct, prueba, deleteTypeProduct} from "./../../controller/products.dataAcces";
import multerImagen from '../../services/multerImagen';

const router = Router();

router.route('/admin77/saveTypeProduct') 
.post(saveTypeProduct);

router.route('/admin77/putTypeProduct') 
.post(putTypeProduct);

router.route('/admin77/deleteTypeProduct') 
.post(deleteTypeProduct);

router.route('/admin77/newProduct') 
.post(multerImagen.fields([{name: "imagen"}, {name: "images"}]), newProduct);

router.route('/admin77/getListProducts') 
.get(getProducts);

router.route('/admin77/getProduct') 
.post(getProduct);

router.route('/admin77/getProductsStoreCategory') 
.post(getProductsStoreCategory);

router.route('/admin77/getUrlProducts') 
.post(getProductUrl);

router.route('/admin77/filterProducts') 
.post(filterProduct);

router.route('/admin77/putProductWhitImagen') 
.post(multerImagen.single("imagen"),putProductWhitImagen);

router.route('/admin77/putProduct') 
.post(putProduct);

router.route('/admin77/deleteProduct') 
.post(deleteProduct);

router.route('/admin77/pruebaProduct') 
.post(prueba);

export default router;