import bcryptjs from 'bcryptjs';
import { User } from '../models/userModel.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!email || !username || !password)
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' });

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!emailRegex.test(email))
      return res.status(400).json({ success: false, message: 'Invalid mail' });

    if (password.length < 6)
      return res
        .status(400)
        .json({ success: false, message: 'Password must be at least 6' });

    const existingUserByEmail = await User.findOne({ email: email });

    if (existingUserByEmail)
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });

    const existingUserByUsername = await User.findOne({ username: username });

    if (existingUserByUsername)
      return res
        .status(400)
        .json({ success: false, message: 'Username already exists' });

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = [
      '../img/Netflix-avatar1.png',
      '../img/netflix-profile-pictures-1000-x-1000-2fg93funipvqfs9i.png',
      '../img/netflix-profile-pictures-1000-x-1000-w3lqr61qe57e9yt8.png',
    ];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password: hashPassword,
      username,
      image,
    });

    generateTokenAndSetCookie(newUser._id, res);

    await newUser.save();

    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: '',
      },
    });
  } catch (error) {
    console.log('Error in signup controller', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email' });

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({ success: true, message: 'Invalid password' });

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({ success: true, user: { ...user._doc, password: '' } });
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie('jwt-netflix');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export async function  authCheck(req,res) {
  try {
    res.status(200).json({success:true,user:req.user  })
  } catch (error) {
    
  }
}
