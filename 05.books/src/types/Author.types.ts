import { Author} from '@prisma/client';

//detta behövs ej om jag gör en IMPORT från prisma, detta pga har redan skapat upp en Author i prisma.schema
// export type Author = {
//     id: number;
//     name: string;
//     birthyear: number | null;
// }

//gör detta istället:
//ta bort BARA id från author
export type CreateAuthorData = Omit<Author, 'id'>;

// export type CreateAuthorData = {
// 	name: string;
// 	birthyear: number | null;
// }



export type UpdateAuthorData = Partial<CreateAuthorData>;




//gör detta istället:
//inkludera BARA id från author
export type AuthorId = Pick<Author, 'id'>;

// export type AuthorId = {
// 	id: number;
// }

