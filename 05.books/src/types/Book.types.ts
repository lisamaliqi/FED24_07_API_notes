import { Book } from "@prisma/client";


export type CreateBookData = Omit<Book, 'id'>

export type UpdateBookData = Partial<CreateBookData>;

export type BookId = Pick<Book, 'id'>