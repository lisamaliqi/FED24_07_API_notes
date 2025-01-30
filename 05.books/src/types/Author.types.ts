export type CreateAuthorData = {
	name: string;
	birthyear: number | null;
}
export type UpdateAuthorData = Partial<CreateAuthorData>;

export type AuthorId = {
	id: number;
}