export class RegisterUser {
    constructor(
        public email: string,
        public updates: boolean,
        public termsAccepted: boolean
    ) { }
}

export class GeneralProfileData {
    constructor(
        public role: string,
        public screenName: string,
        public uiLanguage: string,
        public preferredLanguage: string,
        public gender: string,
        public highestEducation: string,
        public brainDominance: string,
        public password: string
    ) { }
}

export class GeneralUserProfile {
    constructor(
        public userId: string,
        public profileData: GeneralProfileData
    ) { }
}


export class CreatorProfileData {
    constructor(
        public role: string,
        public screenName: string,
        public uiLanguage: string,
        public preferredLanguage: string,
        public firstName: string,
        public lastName: string,
        public countryOfResidence: string,
        public dateOfBirth: string,
        public seniorityStatus: string,
        public gender: string,
        public highestEducation: string,
        public brainDominance: string,
        public password: string
    ) { }
}

export class CreatorUserProfile {
    constructor(
        public userId: string,
        public profileData: CreatorProfileData
    ) { }
}