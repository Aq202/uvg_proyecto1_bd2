type User = {
	name: string;
	email: string;
	phone: string;
	id: ObjectId;
};

type session = {
	session?: User;
};

type AppRequest = session & Record<string,any>;

type AppResponse = Record<string,any>