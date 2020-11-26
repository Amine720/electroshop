import express from "express";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
const __dirname = path.resolve();
app.use(helmet());
app.use(morgan("common"));
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.send("Home route");
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
	console.log(`Running on port ${PORT}`);
});
