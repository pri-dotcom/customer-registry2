const mongoose = require("mongoose");

const customFieldSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Field name is required"],
            unique: true,
            trim: true
        },
        type: {
            type: String,
            enum: ["text", "number", "date"],
            default: "text"
        },
        isRequired: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("CustomField", customFieldSchema);
