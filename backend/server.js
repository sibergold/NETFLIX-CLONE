import express from 'express';
import cookieParser from 'cookie-parser';
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import authRouter from './routers/authRouter.js';
import movieRouter from './routers/movieRouter.js'
import tvRouter from './routers/tvRouter.js'
import searchRouter from './routers/searchRouter.js'
import { protectRouter } from './middlewares/protectRouter.js';
import path from 'path'
const app = express();

const PORT = ENV_VARS.PORT;
 
const __dirname = path.resolve()

app.use(express.json());
app.use(cookieParser())

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/movie', protectRouter, movieRouter);
app.use('/api/v1/tv', protectRouter, tvRouter);
app.use('/api/v1/search', protectRouter, searchRouter);

if (ENV_VARS.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
  connectDB();
});
