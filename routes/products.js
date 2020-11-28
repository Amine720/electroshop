import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { addProduct } from "../controllers/products/products.js";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads/");
	},
	filename: (req, file, cb) => {
		const ext = file.originalname.split(".").reverse()[0];
		cb(null, uuidv4() + "." + ext);
	},
});
const upload = multer({ storage });
const router = Router();

router.post("/add", upload.array("photos", 10), async (req, res) => {
	let photos = req.files.map((file) => file.path);
	const response = await addProduct({ ...req.body, photos });
	if (response.error) {
		res.send(response.error);
	}
	res.status(201).json({ message: response.message });
});

export default router;
