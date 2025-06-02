export {}

export type SortType = "ATIME" | "DTIME" | "ADUR" | "DDUR" | "AENDS" | "DENDS";

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
        role?: "STUDENT" | "TEACHER"
        }
    }

    /**
    * Sorting types for various operations.
    * 
    * - "ATIME": Ascending by time.
    * - "DTIME": Descending by time.
    * - "ADUR": Ascending by duration.
    * - "DDUR": Descending by duration.
    * - "AENDS": Ascending by end timestamp.
    * - "DENDS": Descending by end timestamp.
    */

    interface sorting{
        /**
        * Sorting option to apply.
        * 
        * Example: "ATIME" for ascending by time.
        */
        sortType: SortType
    }
}