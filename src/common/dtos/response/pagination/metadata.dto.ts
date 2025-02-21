export class MetadataDto {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;

	constructor(
		currentPage: number,
		pageSize: number,
		totalItems: number,
		totalPages: number,
	) {
		this.currentPage = currentPage;
		this.pageSize = pageSize;
		this.totalItems = totalItems;
		this.totalPages = totalPages;
	}
}
