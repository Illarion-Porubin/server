import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const data = req.userid;
    if (!data) {
      res.status(400).json(`Не удалось получить данные`);
    }
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userid,
    });

    const post = await doc.save();

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: `Не удалось создать статью`,
    });
  }
};

export const getALL = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec(); //связываем таьлицу с юзером
    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Не удалось получиь статьи`,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: `Не удалось получиь статью.`,
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найден",
          });
        }
        return res.json(doc);
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: `Не удалось получиь статью.`,
    });
  }
};

export const getById = async (req, res) => {
  //////////
  try {
    const post = await PostModel.findById(req.params.id).exec();
    return res.json(post);
  } catch (error) {
    return res.status(500).json({
      message: `Не удалось получиь статью.`,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findByIdAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: `Не удалось удалить статью.`,
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найден",
          });
        }
        return res.json({ success: true });
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: `Не удалось получиь статью.`,
    });
  }
};
//////////////////////

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userid,
        tags: req.body.tags,
      }
    );
    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Не удалось получиь статью.`,
    });
  }
};

export const deleteAll = async (req, res) => {
  try {
    await PostModel.deleteMany();
    return res.json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Не удалось удалить посты.`,
    });
  }
};
