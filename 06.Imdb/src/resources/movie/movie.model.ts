import { model, Schema, Document } from "mongoose";

export interface MovieDocument extends Document {
	title: string;
	runtime: number | null;
	release_year: number | null;
    genres: string[];
    watched: Date;
};

const currentYear = new Date().getFullYear();

const MovieSchema = new Schema<MovieDocument>({
	title: {
		type: String,
		required: true,
        trim: true,
        min: [2, 'Has to be at least 2 chars']
	},
	runtime: {
		type: Number,
        default: null,
        // min: [1, 'Need to have a positive runtime'],
        validate(value: number | null) {
            if (value !== null && value < 1 ) {
                throw new Error('just because you thought a movie was bad, it should not have zero or negative runtime');
            };
        },
	},
	release_year: {
		type: Number,
        default: null,
        min: [1888, 'Needs to be 1888 or later'],
        max: [currentYear, 'Cannot be in the future'],
	},
    genres: {
        type: [String],
        default: [],
        lowercase: true,
    },
    watched: {
        type: Date,
        default() {
            return Date.now();
        },
    },
});

export const Movie = model("Movie", MovieSchema);