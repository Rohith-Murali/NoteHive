import UserDetails from "../models/UserDetails.js";

// Get user details
export const getUserDetailsService = async (userId) => {
  const details = await UserDetails.findOne({ user: userId }).populate("user", "email");
  if (!details) throw new Error("User details not found");
  return details;
};

// Create or update user details
export const updateUserDetailsService = async (userId, updates) => {
  const allowedFields = [
    "name",
    "bio",
    "avatar",
    "themePreference",
    "fontSizePreference",
  ];

  const filteredUpdates = {};
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) filteredUpdates[field] = updates[field];
  });

  const updatedDetails = await UserDetails.findOneAndUpdate(
    { user: userId },
    { $set: filteredUpdates },
    { new: true, upsert: true, runValidators: true }
  );

  return updatedDetails;
};

// Update password change timestamp (called from user password change logic)
export const markPasswordChangedService = async (userId) => {
  await UserDetails.findOneAndUpdate(
    { user: userId },
    { $set: { passwordLastChanged: new Date() } },
    { new: true, upsert: true }
  );
};
