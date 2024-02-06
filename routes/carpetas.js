import express from "express";
import {
    enlacesCarpeta
} from "../controllers/enlacesController.js";

const router = express.Router();

router.get('/:carpeta',
    enlacesCarpeta
);

export default router;