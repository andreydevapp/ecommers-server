import {Router,Request,Response,NextFunction} from 'express';
import { newBrand, getListBrand, putBrand, deleteBrand, newBrandWhitImagen, putBrandWithImagen} from '../../controller/brand.dataAccess';
import multerImagen from '../../services/multerImagen';


const router = Router();

router.route('/admin77/newBrand') 
.post(newBrand);

router.route('/admin77/newBrandWhitImagen') 
.post(multerImagen.single("imagen"), newBrandWhitImagen);

router.route('/admin77/getListBrand') 
.get(getListBrand);

router.route('/admin77/putBrand') 
.post(putBrand);

router.route('/admin77/putBrandWhithImagen') 
.post(multerImagen.single("imagen"), putBrandWithImagen);

router.route('/admin77/deleteBrand') 
.post(deleteBrand);

export default router;