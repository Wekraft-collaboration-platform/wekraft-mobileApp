import { GithubRepo } from "@/constraints/interface"
import React, { createContext, ReactNode, useContext, useState } from "react"

type onboardingProp = {

    occupation: string
    phoneNumber: string
    countryCode: string
    tags: string[]
    isPublic: boolean
    thumbnailUrl: String | undefined
    projectName: string
    projectdescription: string
    repos: GithubRepo[]
    selctedrepo: GithubRepo | null


}


type onboardingContextType = {
    data: onboardingProp,
    setData: React.Dispatch<React.SetStateAction<onboardingProp>>
}


const OnBoradingContext = createContext<onboardingContextType | null>(null)


export function OnBoardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<onboardingProp>({
        occupation: "",
        phoneNumber: "",
        countryCode: "",
        tags: [],
        isPublic: false,
        thumbnailUrl: undefined,
        projectName: "",
        projectdescription: "",
        repos: [],
        selctedrepo: null
    })

    return (
        <OnBoradingContext.Provider value={{ data, setData }}>
            {children}
        </OnBoradingContext.Provider>

    )
}


export const useOnboarding = () => {
    const context = useContext(OnBoradingContext)

    if (!context) {
        throw new Error("useOnboarding must be used within OnboardingProvider")
    }

    return context
}