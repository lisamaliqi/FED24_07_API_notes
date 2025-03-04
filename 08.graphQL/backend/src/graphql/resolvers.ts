// Resolvers define how to fetch the types defined in your schema.
import { Book, Publisher } from "@prisma/client";
import prisma from "../prisma";

const resolvers = {
    Query: {
        authors: () => {
            return prisma.author.findMany();
        },
        books: () => {
            return prisma.book.findMany();
        },
        publishers: () => {
            return prisma.publisher.findMany();
        },

        author: (_parent: void, args: { id: number }) => {
            return prisma.author.findUnique({
                where: {
                    id: args.id,
                },
            });
        },
        book: (_parent: void, args: { id: number }) => {
            return prisma.book.findUnique({
                where: {
                    id: args.id,
                },
            });
        },
        publisher: (_parent: void, args: { id: number }) => {
            return prisma.publisher.findUnique({
                where: {
                    id: args.id,
                },
            });
        },
    },

    // Resolvers for the relation fields
    Book: {
        publisher: (parent: Book) => {
            return prisma.book.findUnique({
                where: {
                    id: parent.id,
                },
            })
            .publisher(); 
        },
    },
    Publisher: {
        books: (parent: Publisher) => {
            return prisma.publisher.findUnique({
                where: {
                    id: parent.id,
                },
            })
            .books();
        },
    },
};

export default resolvers;
