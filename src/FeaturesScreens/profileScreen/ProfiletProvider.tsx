import { Id } from "@/convex/_generated/dataModel";
import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type ProfileMode = "admin" | "user";

type ProfileContextType = {
    mode: ProfileMode;
    user: any;
    userId?: Id<"users">;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

type ProviderProps = {
    mode: ProfileMode;
    userId?: Id<"users">;
    children: ReactNode;
};

export function ProfileProvider({
                                    mode,
                                    userId,
                                    children,
                                }: ProviderProps) {

    // Logged in user
    const currentUser = useQuery(
        api.users.getCurrentUser,
        mode === "admin" ? {} : "skip"
    );

    // Public profile user
    const publicUser = useQuery(
        api.users.getUserbyId,
        mode === "user" && userId ? { userId } : "skip"
    );

    const user = mode === "admin" ? currentUser : publicUser;

    // Convex returns undefined while loading
    if (user === undefined) {
        return null;
    }

    return (
        <ProfileContext.Provider
            value={{
                mode,
                user,
                userId,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const ctx = useContext(ProfileContext);

    if (!ctx) {
        throw new Error("useProfile must be used inside ProfileProvider");
    }

    return ctx;
}