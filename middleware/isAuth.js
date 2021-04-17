const jwt = require("jsonwebtoken");
const User = require("../app/models/user")
module.exports = async (req, res, next) => {
  const token = req.header("token");
  let jsonResponse = {};
  if (!token) {
    jsonResponse.msg = "No token found, authorization denied!";
    jsonResponse.status = "false";
    return res
      .status(401)
      .json(jsonResponse);
  }

  try {
    const decoded = jwt.verify(token, "mysecretkey");
    req.userId = decoded._id;
    const user = await User.findOne({_id: req.userId});
    if(!user){
      jsonResponse.msg = "No User Data Found";
      jsonResponse.status = "false";
    }
    const isMatch = await User.findById(req.userId)
    if (!isMatch.token) {
      jsonResponse.msg = "No token found, authorization denied!";
      jsonResponse.status = "false";
      return res.status(401).json(jsonResponse);
    }

    next();
  } catch (error) {
    console.log(error, "ere");
    jsonResponse.msg = "token not valid!";
    jsonResponse.status = "false";
    res.status(500).json(jsonResponse);
  }
};