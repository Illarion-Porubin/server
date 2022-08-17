import jwt from "jsonwebtoken";
// replace(/Bearer\s?/, '')

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  try {
    if (!token) {
      res.status(400).json("Ошибка токина");
    }
    const decrypt = jwt.verify(token, "secret123");
    req.userid = decrypt._id;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json("Ошибка верификации");
  }
};
