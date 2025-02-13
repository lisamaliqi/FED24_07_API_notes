import { model, Schema, Document } from "mongoose";

export interface MovieDocument extends Document {
	title: string;
	runtime?: number;
	release_year?: number;
};

const currentYear = new Date().getFullYear();

const MovieSchema = new Schema<MovieDocument>({
	title: {
		type: String,
		required: true,
	},
	runtime: {
		type: Number,
        min: [1, 'Need to have a positive runtime'],
	},
	release_year: {
		type: Number,
        min: [1888, 'Needs to be 1888 or later'],
        max: [currentYear, 'Cannot be in the future'],
	},
});

export const Movie = model("Movie", MovieSchema);