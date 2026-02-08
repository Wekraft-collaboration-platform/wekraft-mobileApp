import { QueryClient, useQuery } from "@tanstack/react-query";


// TO Make the Auth TransistionState
export type AuthTransitionState =
    | "idle"
    | "sso_in_progress"
    | "authenticated"
    | "error";


const authTransitionKey = ["auth", "transition"]

const getDefaultAuthTransitionState = (): AuthTransitionState => "idle"

export const setAuthTransitionState = (
    queryClient: QueryClient,
    state: AuthTransitionState
) => {
    queryClient.setQueryData(authTransitionKey, state)
}


export const useAuthTransition = () => {
    return useQuery({
        queryKey: authTransitionKey,
        queryFn: () => getDefaultAuthTransitionState(),
        staleTime: Infinity,
    }
    )
}