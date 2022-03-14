import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  abbr: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Department', departmentSchema);
