export enum SleepStatus {
	asleep="asleep",
	awake="awake",
}

export interface User {
	email: string;
	_id: string;
	provider: "google";
	googleId: string;
	name: string;
	roomNumber: number;
	sleepStatus: SleepStatus;
}
