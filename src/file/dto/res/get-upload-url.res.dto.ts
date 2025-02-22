export class ResGetUploadUrl {
	url: string;
	submitKey: string;

	constructor(url: string, submitKey: string) {
		this.url = url;
		this.submitKey = submitKey;
	}
}
