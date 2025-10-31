import User from "../models/User.js";
import UserDetails from "../models/UserDetails.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

let refreshTokens = []; // (Later: store in DB/Redis)

const registerUser = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });
  if (!user) throw new Error("Invalid user data");
  await UserDetails.create({
    user: user._id,
    name: name,
    joinedAt: new Date(),
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  refreshTokens.push(refreshToken);

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  refreshTokens.push(refreshToken);
  await UserDetails.findOneAndUpdate(
    { user: user._id },
    { lastLogin: new Date() }
  );

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (token) => {
  if (!token) throw new Error("No token provided");
  if (!refreshTokens.includes(token))
    throw new Error("Invalid refresh token");

  const decoded = await new Promise((resolve, reject) => {
    import("jsonwebtoken").then(({ default: jwt }) => {
      jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) reject(new Error("Invalid refresh token"));
        else resolve(user);
      });
    });
  });

  return { accessToken: generateAccessToken(decoded.id) };
};

const logoutUser = async (token) => {
  refreshTokens = refreshTokens.filter((t) => t !== token);
  return { message: "Logged out successfully" };
};

const updatePassword = async (oldPassword,newPassword,userId) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password" });

    user.password = newPassword;
    await user.save();

    // update password change timestamp
    await UserDetails.findOneAndUpdate(
      { user: user._id },
      { passwordLastChanged: new Date() }
    );
};


export { registerUser, loginUser, refreshAccessToken, logoutUser,updatePassword };
