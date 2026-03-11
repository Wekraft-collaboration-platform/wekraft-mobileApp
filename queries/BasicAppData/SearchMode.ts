import { QueryClient, useQuery } from "@tanstack/react-query";

// TO Make the Auth TransistionState
export type SearchMode =
    | "None"
    | "Collaborative"
    | "Discovery"
    | "OpenSource"
    | "Product";

const searchModeKey = ["search", "transition"]

const getDefaultSearchModeState = (): SearchMode => "None"

export const setSearchModeState = (
    queryClient: QueryClient,
    state: SearchMode
) => {
    queryClient.setQueryData(searchModeKey, state)
}


export const useSearchMode = () => {
    return useQuery({
            queryKey: searchModeKey,
            queryFn: () => getDefaultSearchModeState(),
            staleTime: Infinity,
        }
    )
}