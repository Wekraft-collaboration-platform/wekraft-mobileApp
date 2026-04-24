import { useMutation } from "@tanstack/react-query";

export const useSyncTechStack = (fetchTechStack, updateUser, user) => {
    return useMutation({
        mutationFn: async () => {
            if (!user?.githubUsername) {
                throw new Error("Missing GitHub username");
            }

            const stack = await fetchTechStack({
                username: user.githubUsername,
            });

            if (!stack || stack.length === 0) {
                throw new Error("No repositories found");
            }

            await updateUser({ techStack: stack });

            return stack;
        },

        retry: 1, // prevent infinite retries
    });
};