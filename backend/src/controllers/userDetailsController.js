import {
  getUserDetailsService,
  updateUserDetailsService,
} from "../services/userDetailsService.js";

export const getUserDetails = async (req, res) => {
  try {
    const details = await getUserDetailsService(req.user._id);
    res.json(details);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const updated = await updateUserDetailsService(req.user._id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
