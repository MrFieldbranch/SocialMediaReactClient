export interface IFetchState<T> {
	data: T | null;
	error: string | null;
}