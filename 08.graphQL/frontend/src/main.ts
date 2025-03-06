import { ApolloClient, DocumentNode, InMemoryCache, gql } from "@apollo/client/core";
import { BookWithAuthors } from "./types";

/**
 * Create a new ApolloClient instance
 */
const client = new ApolloClient({
	uri: "http://localhost:4000/",
	cache: new InMemoryCache(),
});

/**
 * Define a query to get all books (with authors)
 */
const GET_BOOKS_WITH_AUTHORS = gql`
	query GetBooksWithAuthors {
		books {
			id
			title
			pages
			authors {
				id
				name
			}
		}
    }
`;

/**
 * Execute a query against the GraphQL server
 *
 * @param query
 * @returns
 */
const execQuery = async (query: DocumentNode) => {
	const result = await client.query({
		query,
	});

	return result.data;
}

/**
 * Execute the query to get all books
 */
const bookResult: { books: BookWithAuthors[] } = await execQuery(GET_BOOKS_WITH_AUTHORS);
console.log(bookResult);

/**
 * Render the books in the DOM
 */
const booksEl = document.querySelector("#books") as HTMLUListElement;
booksEl.innerHTML = bookResult.books
	.map((book) =>
		`<li>
			#${book.id} - ${book.title} (${book.pages} pages)
			by ${book.authors.length > 0
				? book.authors.map(author => author.name).join(", ")
				: 'anonymous'}
		</li>`)
	.join("");
