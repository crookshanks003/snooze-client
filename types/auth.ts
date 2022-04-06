export enum SleepStatus {
	asleep="asleep",
	awake="awake",
}

export enum MealTime {
	DINNER="dinner",
	LUNCH="lunch",
	BREAKFAST="breakfast",
	SNACKS="snacks"
}

export interface User {
	email: string;
	_id: string;
	provider: "google";
	googleId: string;
	name: string;
	roomNumber: number;
	sleepStatus: SleepStatus;
	mealTime: MealTime[];
	image?: string;
}
