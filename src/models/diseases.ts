import mongoose ,{Document,Schema} from "mongoose"

export interface IDisease extends Document{
  title: string;
  description: string;
  symptoms: string[];
  species: string;           
  createdBy: mongoose.Types.ObjectId; 
  imageUrl: string;          
  createdAt: Date;
  updatedAt: Date;
}

const diseaseSchema = new Schema<IDisease>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    symptoms: {
      type: [String],
      required: true,
    },

    species: {
      type: String,
      required: true,
      enum: [
        "Dog",
        "Cat",
        "Fish",
        "Hamster",
        "Horse",
        "Rabbit",
        "Bird",
        "All Pets",
      ],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Disease = mongoose.model<IDisease>("Disease",diseaseSchema)