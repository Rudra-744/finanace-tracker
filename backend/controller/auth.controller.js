import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "viewer",
    });

    const { accessToken, refreshToken } = generateToken(
      newUser._id,
      newUser.role
    );
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({
        message: "User created successfully",
        accessToken,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated. Contact admin." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const {accessToken,refreshToken}=generateToken(user._id,user.role);

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
    })

    res.status(200).json({
        message:"User logged in successfully",
        accessToken,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
        }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found." });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET || "refresh_secret",
      (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid or expired refresh token." });

        const newAccessToken = jwt.sign(
          { id: decoded.id }, 
          process.env.JWT_SECRET || "access_secret",
          { expiresIn: "10m" }
        );

        const newRefreshToken = jwt.sign({
          id:decoded.id,
          role:decoded.role,
        },process.env.REFRESH_SECRET || "refresh_secret",
        {expiresIn:"7d"}
        )

        res.cookie("refreshToken",newRefreshToken,{
          httpOnly:true,
          secure:process.env.NODE_ENV === "production",
          sameSite:"strict",
          maxAge:7*24*60*60*1000,
        })

        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
