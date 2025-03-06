import prisma from "./prisma";

const getPublisherOfBook = async (bookId: number) => {
	const book = await prisma.book.findUnique({
		where: {
			id: bookId,
		},
	}).publisher();
	console.log(`Publisher of book #${bookId}:`, book);
}
getPublisherOfBook(2);