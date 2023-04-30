import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required:  true },
    email: {type: String, required: true},
    password: {type: String, required: true},
    batch: {type: String, required: true},
    major: {type: String, required: true},
    location: {type: String},
    isgradschool: {type: Boolean},
    gradschool: {type: String},
    gradschoolDate: {type: Date},
    isemployed: {type: Boolean},
    employment: {type: String},
    employmentdate: {type: Date},
    huID: {type: String},
    id: {type: String},
    skills: [{type: String}],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

});

export default mongoose.model("User", userSchema);
