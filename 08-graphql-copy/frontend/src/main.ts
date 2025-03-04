import { ApolloClient, DocumentNode, InMemoryCache, gql } from "@apollo/client/core";
import { Book } from "./types";

/**
 * Create a new ApolloClient instance
 */
const client = new ApolloClient({
	uri: "http://localhost:4000/",
	cache: new InMemoryCache(),
});

/**
 * Define a query to get all books
 */
export const GET_BOOKS = gql`
		query GetBooks {
			books {
				id
				title
				pages
			}
		}
	`;

/**
 * Execute a query against the GraphQL server
 *
 * @param query
 * @returns
 */
export const execQuery = async (query: DocumentNode) => {
	const result = await client.query({
		query,
	});

	return result.data;
}

/**
 * Execute the query to get all books
 */
const bookResult: { books: Book[] } = await execQuery(GET_BOOKS);
console.log(bookResult);

/**
 * Render the books in the DOM
 */
const booksEl = document.querySelector("#books") as HTMLUListElement;
booksEl.innerHTML = bookResult.books
	.map((book) =>
		`<li>#${book.id} - ${book.title} (${book.pages})</li>`)
	.join("");
