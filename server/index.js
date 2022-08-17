import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { registerValidation, loginValidation, postCreateValidation } from "./validations/validations.js";
import { PostController, UserController } from "./controllers/Controllers.js"
import { checkAuth, handleValidErrors } from "./utils/utils.js"

mongoose
  .connect(
    `mongodb+srv://Admin:Admin123@cluster0.j0w4mvi.mongodb.net/blog?retryWrites=true&w=majority`
  )
  .then(() => console.log(`DB ok`))
  .catch((err) => console.log(`DB error`, err));

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server OK`);
});

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
}); // используем мидлвоур и ожидаем формат image

app.post('/auth/register',
  registerValidation,
  handleValidErrors,
  UserController.register);
app.post(
  "/auth/login",
  loginValidation,
  handleValidErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.me);

///UserPost///
app.post(
  "/posts",
  postCreateValidation,
  checkAuth,
  PostController.create
);

app.get("/posts", PostController.getALL);
app.get("/posts/:id", checkAuth, PostController.getOne);
app.get("/posts/get/:id", checkAuth, PostController.getById);

app.patch(
  "/posts/:id",
  postCreateValidation,
  checkAuth,
  PostController.update
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.delete("/posts", checkAuth, PostController.deleteAll);
