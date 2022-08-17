import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import handleVallErrors from "../utils/handleValidErrors.js";


export const register = async (req, res) => {
  try {
    
    const pass = req.body.password;
    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(pass, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      password: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    const { password, ...userData } = user._doc;

    return res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(`Ошибка регистрации`);
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).res.json(`Пользователь не существует`);
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.password
    ); // сравниваем пароли

    if (!isValidPass) {
      return res.status(400).json({
        message: `Неверный логин или пароль`,
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    const { password, ...userData } = user._doc;

    return res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(`не удалось авторизироваться`);
  }
};

export const me = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userid);
    if (!user) {
      res.status(400).json("ID не найден");
    }
    const { password, ...userData } = user._doc;

    return res.json({
      ...userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(`Не удалось найти пользователя`);
  }
};
