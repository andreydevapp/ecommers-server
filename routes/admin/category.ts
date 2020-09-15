import {Router,Request,Response,NextFunction} from 'express';
import { newCategory, putCategory, deleteCategory, getListCategories, getListSubCategories, newCategoryWhitImagen, putCategoryWhitImagen, getListAllSubCategories } from '../../controller/category.dataAccess';
import multerImagen from '../../services/multerImagen';

const router = Router();

router.route('/admin77/newCategory') 
.post(newCategory);

router.route('/admin77/newCategoryWhitImagen') 
.post(multerImagen.single("imagen"), newCategoryWhitImagen);

router.route('/admin77/getListCategories') 
.get(getListCategories);

router.route('/admin77/getListSubCategories') 
.post(getListSubCategories);

router.route('/admin77/getListAllSubCategories') 
.post(getListAllSubCategories);

router.route('/admin77/putCategory') 
.post(putCategory);

router.route('/admin77/putCategoryWhitImagen') 
.post(multerImagen.single("imagen"), putCategoryWhitImagen);

router.route('/admin77/deleteCategory') 
.post(deleteCategory);

export default router;