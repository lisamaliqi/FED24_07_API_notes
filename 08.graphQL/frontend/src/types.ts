/**
 * Author
 */
export type Author = {
	id: number;
	name: string;
	birthyear: number | null;
}


/**
 * Book
 */
export type Book = {
	id: number;
	title: string;
	pages: number;
}

export type BookWithAuthors = {
	id: number;
	title: string;
	pages: number;
	authors: Author[];
}