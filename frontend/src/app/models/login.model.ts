export class LoginRequest {
    constructor(
        public email: string,
        public password: string
    ) { }
}
export class Tokens {
    constructor(
        public accessToken: string,
        public refreshToken: string,
        public accessExpiresIn: number,
        public refreshExpiresIn: number
    ) { }
}

export class User {
    constructor(
        public id: string,
        public email: string,
        public screenName: string,
        public uiLanguage: string,
        public preferredLanguage: string,
        public role: string,
        public firstName: string,
        public lastName: string,
        public countryOfResidence: string,
        public dateOfBirth: string,
        public seniorityStatus: string,
        public gender: string,
        public highestEducation: string,
        public brainDominance: string
    ) { }
}

export const enum UserModes {
    ADMIN_MODE = "Admin",
    CREATOR_MODE = "Creator",
    GENERAL_MODE = "General",
    GUEST_MODE = "Guest"
  }
  

export class LoginResponse {
    constructor(
        public tokens: Tokens,
        public user: User
    ) { }
}

export class ResetPassword {
    constructor(
        public token: string,
        public newPassword: string
    ) { }
}

export class VerifyForgetEmail {
    constructor(
        public email: string,
    ) { }
}
