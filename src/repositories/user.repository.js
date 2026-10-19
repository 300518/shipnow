const User = require("../models/user.model");

const USER_FIELDS = "name email role createdAt updatedAt";

class UserRepository {
  async getAll() {
    return User.find({}, USER_FIELDS).sort({ createdAt: -1 }).lean();
  }

  async getById(id) {
    return User.findById(id, USER_FIELDS).lean();
  }

  async getByEmail(email) {
    return User.findOne({ email }, USER_FIELDS).lean();
  }

  async create(userData) {
    const user = await User.create(userData);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(id, userData) {
    return User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
      projection: USER_FIELDS,
    }).lean();
  }

  async delete(id) {
    return User.findByIdAndDelete(id).lean();
  }
}

module.exports = new UserRepository();
