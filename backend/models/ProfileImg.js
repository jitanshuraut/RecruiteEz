import mongoose from "mongoose";

const profileImgSchema = new mongoose.Schema({
  contentType: {
    type: String,
  },
  data: {
    type: Buffer,
  },
  userId: {
    type: String,
  },
});

const ProfileImg = mongoose.model("ProfileImg", profileImgSchema);

export default ProfileImg;
