// Resolvers define how to fetch the types defined in your schema.
import prisma from "../prisma";

const resolvers = {
    Query: {
        books: () => {
            return prisma.book.findMany();
        },
    },
};

export default resolvers;
