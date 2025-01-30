export type CreatePublisherData = {
	name: string;
}
export type UpdatePublisherData = Partial<CreatePublisherData>;

export type BookId = {
	id: number;
}