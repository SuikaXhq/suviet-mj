import type { UserLevel } from "@prisma/client";

declare module "#auth-utils" {
    interface User {
        id: number;
        name: string;
        level: UserLevel;
    }

    interface UserSession {
        user: User;
    }
}
