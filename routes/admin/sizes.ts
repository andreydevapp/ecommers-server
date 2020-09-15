import {Router,Request,Response,NextFunction} from 'express';
import { newSize, getSizes, getSize, putSize, deleteSize } from '../../controller/sizesProducts.data.access';


const router = Router();

router.route('/admin77/newSize') 
.post(newSize);

router.route('/admin77/getListSize') 
.get(getSizes);

router.route('/admin77/getSize') 
.post(getSize);

router.route('/admin77/putSize') 
.post(putSize);

router.route('/admin77/deleteSize') 
.post(deleteSize);

export default router;