// Resolvers define how to fetch the types defined in your schema.
import { Author, Book, Publisher } from "@prisma/client";
import prisma from "../prisma";

const resolvers = {
    // Resolvers for the Query fields
    Query: {
        authors: () => { // Query for all authors
            return prisma.author.findMany();
        },
        books: () => { // Query for all books
            return prisma.book.findMany();
        },
        publishers: () => { // Query for all publishers
            return prisma.publisher.findMany();
        },


        author: (_parent: void, args: { id: number }) => { // Query for a single author
            return prisma.author.findUnique({
                where: {
                    id: args.id,
                },
            });
        },
        book: (_parent: void, args: { id: number }) => { // Query for a single book
            return prisma.book.findUnique({
                where: {
                    id: args.id,
                },
            });
        },
        publisher: (_parent: void, args: { id: number }) => { // Query for a single publisher
            return prisma.publisher.findUnique({
                where: {
                    id: args.id,
                },
            });
        },
    },


    // Resolvers for the relation fields
    Author: {
        books: (parent: Author) => { // Query for all books by an author
            return prisma.author.findUnique({
                where: {
                    id: parent.id,
                },
            })
            .books();
        },
    },
    Book: {
        authors: (parent: Book) => { // Query for all authors of a book
            return prisma.book.findUnique({
                where: {
                    id: parent.id,
                },
            })
            .authors(); 
        },
        publisher: (parent: Book) => { // Query for the publisher of a book
            return prisma.book.findUnique({
                where: {
                    id: parent.id,
                },
            })
            .publisher(); 
        },
    },
    Publisher: {
        books: (parent: Publisher) => { // Query for all books by a publisher
            return prisma.publisher.findUnique({
                where: {
                    id: parent.id,
                },
            })
            .books();
        },
    },






	// Resolvers for the Mutation fields
	Mutation: {
        // Author create, update and delete
		createAuthor: (_parent: void, args: { data: Omit<Author, "id"> }) => { // Mutation to create an author
			return prisma.author.create({
				data: args.data,
			});
		},
        updateAuthor: (_parent: void, args: { id: number, data: Omit<Author, "id"> }) => { // Mutation to update an author
            return prisma.author.update({
                where: {
                    id: args.id,
                },
                data: args.data,
            });
        },
        deleteAuthor: (_parent: void, args: { id: number }) => { // Mutation to delete an author
            return prisma.author.delete({
                where: {
                    id: args.id,
                },
            });
        },


        // Book create, update and delete
        createBook: (_parent: void, args: { data: Omit<Book, "id"> }) => { // Mutation to create an book
			return prisma.book.create({
				data: args.data,
			});
		},
        updateBook: (_parent: void, args: { id: number, data: Omit<Book, "id"> }) => { // Mutation to update an book
            return prisma.book.update({
                where: {
                    id: args.id,
                },
                data: args.data,
            });
        },
        deleteBook: (_parent: void, args: { id: number }) => { // Mutation to delete an book
            return prisma.book.delete({
                where: {
                    id: args.id,
                },
            });
        },
        addAuthorToBook: (_parent: void, args: { authorId: number, bookId: number }) => { // Mutation to add an author to a book
            return prisma.book.update({
                where: {
                    id: args.bookId,
                },
                data: {
                    authors: {
                        connect: {
                            id: args.authorId,
                        },
                    },
                },
            });
        },
        removeAuthorFromBook: (_parent: void, args: { authorId: number, bookId: number }) => { // Mutation to remove an author to a book
            return prisma.book.update({
                where: {
                    id: args.bookId,
                },
                data: {
                    authors: {
                        disconnect: {
                            id: args.authorId,
                        },
                    },
                },
            });
        },


        // Publisher create, update and delete
        createPublisher: (_parent: void, args: { data: Omit<Publisher, "id"> }) => { // Mutation to create an publisher
			return prisma.publisher.create({
				data: args.data,
			});
		},
        updatePublisher: (_parent: void, args: { id: number, data: Omit<Publisher, "id"> }) => { // Mutation to update an publisher
            return prisma.publisher.update({
                where: {
                    id: args.id,
                },
                data: args.data,
            });
        },
        deletePublisher: (_parent: void, args: { id: number }) => { // Mutation to delete an publisher
            return prisma.publisher.delete({
                where: {
                    id: args.id,
                },
            });
        },
	},
};

export default resolvers;
