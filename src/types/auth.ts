export interface LoginPayload {
    username: string
    password: string
    // keepMeLoggedIn: boolean
}

export interface LoginResponse {
    data: {
        idToken: string
        refreshToken: string
    }
}