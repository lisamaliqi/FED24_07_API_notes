import { model, Schema, Document } from "mongoose";

export interface PersonDocument extends Document {
	name: string;
};

const PersonSchema = new Schema<PersonDocument>({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: [5, "has to be at least 5 chars"],
	},
});

export const Person = model("Person", PersonSchema);