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
		createAuthor: (_parent: void, args: { data: Omit<Author, "id"> }) => { // Mutation to create an author
			return prisma.author.create({
				data: args.data,
			});
		},
	},
};

export default resolvers;
