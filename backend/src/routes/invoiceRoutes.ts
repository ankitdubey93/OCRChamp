import { Router } from 'express';
import { uploadInvoice, getInvoice, listInvoices } from '../controllers/invoiceController';
import upload from '../middleware/upload';

const router = Router();

router.post('/', upload.single('file'), uploadInvoice);
router.get('/', listInvoices);
router.get('/:id', getInvoice);

export default router;
