// 사실 이게 어떻게 정의 되는지 잘 모르겠음. 검색 할 내용 2
const UserController = {};
const bcrpyt = require("bcryptjs");
const User = require("../Models/User");

UserController.createUser = async (req, res) => {
  try {
    let { name, password, email, level } = req.body;
    // email : email 같으면 email이라고 쓸 수 있는 문법
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("Email already exists");
    }
    const salt = await bcrpyt.genSaltSync(10);
    password = await bcrpyt.hashSync(password, salt);
    const newUser = new User({
      email,
      password,
      name,
      level: level ? level : "customer",
    });

    await newUser.save();
    return res
      .status(200)
      .json({ status: "success", message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
    console.log(error);
  }
};
//Bearer
UserController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({ status: "success", user });
    } else {
      throw new Error("Invalid token");
    }
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};
module.exports = UserController;
