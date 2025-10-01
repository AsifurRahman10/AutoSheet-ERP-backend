const { Schema, mongoose } = require("mongoose");

const SubmissionSchema = new Schema({
    imageUrl: { type: String, required: true },
    extracted_data: { type: Object, required: true },
    status: { type: String, enum: ['pending', 'processed', 'rejected'], default: 'pending' },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });


export const Submission = mongoose.model("Submission", SubmissionSchema);