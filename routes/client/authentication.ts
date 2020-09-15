import {Router} from 'express';
import { registerStoreUser } from '../../controller/authentication';


const router = Router();

router.route('/storage/user/authentication') 
.post(registerStoreUser);

export default router;