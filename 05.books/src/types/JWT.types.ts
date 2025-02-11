/**
 * JWT Payload Types
 */

export type JwtAccessTokenPayload = {
	sub: number;
	name: string | null;
	email: string;
}
