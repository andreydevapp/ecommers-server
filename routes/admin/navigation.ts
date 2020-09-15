import {Router,Request,Response,NextFunction} from 'express';
import {listNavigation, saveNavigation} from '../../controller/navigation.dataAccess';

const router = Router();

router.route('/admin77/navigation') 
.get(listNavigation);

router.route('/admin77/save_navigation') 
.get(saveNavigation);

export default router;