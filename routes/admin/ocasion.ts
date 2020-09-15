import {Router,Request,Response,NextFunction} from 'express';

import multerImagen from '../../services/multerImagen';
import { newOcasionWhitImagen, getOcasions, putOcasionWhitImagen, putOcasion, deleteOcasion } from '../../controller/ocasion.data.acces';


const router = Router();

router.route('/admin77/newOcasion') 
.post(multerImagen.single("imagen"), newOcasionWhitImagen);

router.route('/admin77/getOcasion') 
.get(getOcasions);

router.route('/admin77/putOcasion') 
.post(putOcasion);

router.route('/admin77/putOcasionWhitImagen') 
.post(multerImagen.single("imagen"), putOcasionWhitImagen);

router.route('/admin77/deleteOcasion') 
.post(deleteOcasion);

export default router;