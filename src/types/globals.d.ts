export {}

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
        role?: "STUDENT" | "TEACHER"
        }
    }
}