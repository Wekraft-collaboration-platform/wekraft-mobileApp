import {View, Text, Image, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import {useUser} from "@clerk/clerk-expo";
import LinearBackgroundProvider from "@/providers/LinearBackgroundProvider";
import {Ionicons} from "@expo/vector-icons";
import {useGithubDashBoardInfo} from "@/queries/dashBoard/dashBoardGithub";
import ImpactRing from "@/components/Extras/ImpactRing";
import {ImpactScoreResult} from "@/lib/impactScore";
import {ImpactScoreBreakDownDialog} from "@/components/Dialogs/impactScoreBreakDownDialog";


const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "GOOD MORNING";
    if (hour >= 12 && hour < 17) return "GOOD AFTERNOON";
    if (hour >= 17 && hour < 21) return "GOOD EVENING";
    return "GOOD NIGHT";
};

const Index = () => {
    const {user} = useUser()

    const [impactScore, setImpactScore] =
        useState<ImpactScoreResult | null>(null);

    const [openImpactScore, setOpenImpactScore]  = useState(false)

    const {
        data,
        isLoading,
        isError,
    } = useGithubDashBoardInfo(user?.id ?? "",user?.username??"")


    return (

        <LinearBackgroundProvider>


            <View className='flex-1 '>

                {/*    Header*/}
                <View className={"flex-row w-full justify-between items-center gap-4"}>
                    <View>

                        <Image source={{uri: user?.imageUrl}} resizeMode={"cover"}
                               style={{width: 50, height: 50, borderRadius: 16}}/>
                        <View style={{
                            position: "absolute",
                            backgroundColor: "#10B982",
                            borderColor: "black",
                            borderWidth: 2,
                            borderRadius: 999,
                            width: 14,
                            height: 14,
                            right: 0,
                            bottom: 0
                        }}/>
                    </View>

                    <View style={{
                        flexDirection: "column",
                        flex: 1,
                        justifyContent: "center",
                        marginStart: 7,
                    }}>
                        <Text style={{
                            color: "#717682",
                            fontSize: 18,
                            letterSpacing: 2
                        }}>{getGreeting()}</Text>
                        <Text style={{
                            color: "white",
                            fontSize: 20,
                            fontWeight: "bold",
                            letterSpacing: 2
                        }}
                        >{user?.username}</Text>

                    </View>

                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                            console.log("clicked Notification");
                        }}
                        style={{
                            backgroundColor: "#1C1C1E",
                            borderColor: "#2D2D2F",
                            borderWidth: 2,
                            borderRadius: 16,
                            padding: 7,
                        }}
                    >

                        <Ionicons name={"notifications-outline"} color={"white"} size={24}/>
                    </TouchableOpacity>
                </View>


                {/*  Impact Score  */}

                <View>

                    <View
                        style={{
                            marginTop: 16,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            backgroundColor: "#161618",
                            borderColor: "#232325",
                            borderWidth: 2,
                            borderRadius: 24,
                            width: "100%"
                        }}
                    >


                        {/*Impact Score header*/}
                        <View style={{
                            width:"100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <View>
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        letterSpacing: 2
                                    }}
                                >IMPACT SCORE</Text>

                                <Text style={{
                                    color: "#9FA5B1",
                                    fontSize: 14
                                }}>
                                    RANKED:
                                    <Text style={{
                                        color:"#7db3fc",
                                        fontWeight:"bold"
                                    }}>
                                    {impactScore?.tier}
                                </Text>
                                </Text>
                            </View>

                            <TouchableOpacity style={{
                                paddingHorizontal: 16,
                                paddingVertical: 5,
                                backgroundColor: "#313034",
                                borderRadius: 24,
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 4
                            }}
                            onPress={() => {
                                setOpenImpactScore(true)
                            }}
                            >

                                <Text style={{
                                    color: "white",
                                    fontSize: 14,
                                    fontWeight: "bold"
                                }}>Analysis</Text>

                                <Ionicons name={"analytics"} size={16} color={"#fff"}/>
                            </TouchableOpacity>



                        </View>

                        {/*   Impact Deatisl  */}

                        <View style={{flexDirection:"row",marginTop:12,justifyContent:"space-between",width:"100%", alignItems:"center"}}>

                            <ImpactRing
                                size={120}
                                strokeWidth={14}
                                // gap={10}
                                stats={data}
                                onResult={setImpactScore}

                            />


                            <View style={{flexDirection:"column",flex:1,gap:8,justifyContent:"center",width:"100%", marginHorizontal:24}}>


                                <View>

                                <Text
                                style={{
                                    color:"#606671",
                                    fontSize:15,
                                    letterSpacing:1,
                                }}>
                                    EXPERIENCE
                                </Text>


                                <Text
                                style={{
                                    fontSize:16,
                                    color:"white",
                                    letterSpacing:1,
                                    fontWeight:"bold",

                                }}
                                >
                                    {formatRelativeTime(data?.accountAgeInYears)}


                                </Text>

                                </View>

                                <View style={{
                                    height:1,
                                    backgroundColor:"#262628"
                                }}/>

                                <View>

                                    <Text
                                        style={{
                                            color:"#606671",
                                            fontSize:15,
                                            letterSpacing:1,
                                        }}>
                                        TOTAL SCORE
                                    </Text>


                                    <Text
                                        style={{
                                            fontSize:16,
                                            color:"white",
                                            letterSpacing:1,
                                            fontWeight:"bold",

                                        }}
                                    >
                                        {impactScore?.weightedActivity}

                                    </Text>

                                </View>


                            </View>



                        </View>


                    </View>
                </View>




                {/*   Git Details     */}

                <View>

                    <View style={{
                        flexWrap:"wrap",
                        flexDirection:"row",
                        marginTop:16,
                        justifyContent:"space-between"
                    }}>

                        <GitCard
                            icon={
                            <View style={{
                                padding:7,
                                borderRadius:12,
                                alignSelf:"flex-start",
                                backgroundColor:"rgba(100,104,241,0.1)"
                            }}>
                            <Ionicons name={"git-commit-outline"} color={"#6468F1"} size={24}/>
                            </View>
                        }
                            score={data?.totalCommits ?? 0}
                            title={"commits"}
                        />
                        <GitCard
                            icon={
                            <View style={{
                                padding:7,
                                borderRadius:12,
                                alignSelf:"flex-start",
                                backgroundColor:"rgba(167,90,242,0.1)"
                            }}>
                            <Ionicons name={"git-pull-request-outline"} color={"#A75AF2"} size={24}/>
                            </View>
                        }
                            score={data?.totalPRs ?? 0}
                            title={"PRs"}
                        />
                        <GitCard
                            icon={
                            <View style={{
                                padding:7,
                                borderRadius:12,
                                alignSelf:"flex-start",
                                backgroundColor:"rgba(16,185,130,0.1)"
                            }}>
                            <Ionicons name={"git-merge-outline"} color={"#10B982"} size={24}/>
                            </View>
                        }
                            score={data?.totalMergedPRs ?? 0}
                            title={"merged"}
                        />
                        <GitCard
                            icon={
                            <View style={{
                                padding:7,
                                borderRadius:12,
                                alignSelf:"flex-start",
                                backgroundColor:"rgba(66,133,241,0.1)"
                            }}>
                            <Ionicons name={"eye-outline"} color={"#4285F1"} size={24}/>
                            </View>
                        }
                            score={data?.totalReviews ?? 0}
                            title={"Reviews"}
                        />






                    </View>

                </View>


            </View>

            <ImpactScoreBreakDownDialog
                impactScore={impactScore}
                onClose={() =>{
                    setOpenImpactScore(false)
                }}
                visible={openImpactScore}/>
        </LinearBackgroundProvider>

    )
}

export default Index

const GitCard = ({ icon, score, title }: { icon: React.ReactNode, score: number, title: string }) => (
    <View style={{
        width: "48%",
        backgroundColor: "#161618",
        borderWidth: 1,
        borderColor: '#232325',
        padding: 16,
        borderRadius: 20,
        marginBottom: 14,
    }}>
        <View style={{
            marginBottom: 12,
        }}>{icon}</View>
        <Text style={{
            color: "white",
            fontSize: 22,
            fontWeight: "800",
        }}>{score.toLocaleString()}</Text>
        <Text style={{
            color: "#64748B",
            fontSize: 13,
            fontWeight: '500',
            marginTop: 2,
        }}>{title}</Text>
    </View>
);

export const formatRelativeTime = (yearsFloat:any) => {
    if (!yearsFloat || yearsFloat < 0) return "";

    if (yearsFloat >= 1) {
        return `${yearsFloat.toFixed(1)} year${yearsFloat >= 2 ? "s" : ""}`;
    }

    const months = yearsFloat * 12;

    if (months >= 1) {
        return `${months.toFixed(1)} month${months >= 2 ? "s" : ""}`;
    }

    const days = months * 30;

    return `${Math.round(days)} day${days >= 2 ? "s" : ""}`;
};
