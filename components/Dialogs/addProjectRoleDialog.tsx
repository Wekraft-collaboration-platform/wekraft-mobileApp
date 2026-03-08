import React, {useEffect, useMemo, useState} from "react"
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Switch
} from "react-native"
import {roles} from "@/constraints/StaticData"
import {Ionicons} from "@expo/vector-icons";


const TYPES = [
    {label: "Casual", sub: "Side-Projects / Hobbies", value: "casual", color: "#3b82f6"},
    {label: "Part-Time", sub: "Hackathons / Events", value: "part-time", color: "#10b981"},
    {label: "Serious", sub: "MVP / Startup", value: "serious", color: "#f59e0b"},
];

export function AddProjectRoleDialog({visible, onClose, onSubmit}) {
    const [search, setSearch] = useState("")
    const [selectedRole, setSelectedRole] = useState<string | null>(null)
    const [type, setType] = useState(TYPES[0])
    const [typeOpen, setTypeOpen] = useState(false)
    const [keepOpen, setKeepOpen] = useState(false)


    useEffect(() => {
        if (!visible) return
        setSearch("")
        setType(TYPES[0])
        setSelectedRole(null)
        setTypeOpen(false)
        setKeepOpen(false)
    }, [visible])


    const filteredRoles = useMemo(() => {
        return roles.filter(r =>
            r.toLowerCase().includes(search.toLowerCase())
        )
    }, [search])

    const handleSubmit = () => {
        if (!selectedRole) return
        onSubmit({role: selectedRole, type: type.label})
        if (!keepOpen) {
            onClose()
        } else {
            setSearch("")
            setType(TYPES[0])
            setSelectedRole(null)
            setTypeOpen(false)
        }
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.container}>

                    {/* Header*/}
                    <View className={"flex-row w-full justify-center items-center"}>


                        <View className={"flex-1"}>

                            <Text style={styles.title}>Add Role</Text>
                            <Text style={[styles.subtitle, {fontSize: 12}]}>
                                Who are you looking for?
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                onClose()
                            }}
                            style={{
                                backgroundColor: "#1E1E1E",
                                padding: 5,
                                borderRadius: 999,

                            }}
                        >

                            <Ionicons name={"close"} size={24} color={"#666666"}/>

                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider}/>

                    {/* Role Search */}
                    <Text style={[styles.label, {fontSize: 12}]}>ROLE NAME</Text>
                    <View style={styles.searchBox}>
                        <Ionicons name={"search-outline"} size={24} color={"#666666"}/>

                        <TextInput
                            placeholder="Search role..."
                            placeholderTextColor="#777"
                            value={search}
                            onChangeText={setSearch}
                            style={{flex: 1, color: "white"}}
                        />


                    </View>


                    {/* Suggestions List */}
                    {search.length > 0 && (
                        <View style={styles.suggestionBox}>
                            <FlatList
                                data={filteredRoles.slice(0, 5)}
                                keyExtractor={(item) => item}
                                renderItem={({item}) => (
                                    <TouchableOpacity
                                        style={styles.suggestionItem}
                                        onPress={() => {
                                            setSelectedRole(item);
                                            setSearch(item);
                                        }}
                                    >
                                        <Ionicons name="arrow-forward" size={14} color="#444"/>
                                        <Text style={styles.suggestionText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}


                    {/* Level */}

                    <Text style={[styles.label, {fontSize: 13, marginTop: 24, marginBottom: 10}]}>COMMITMENT
                        LEVEL</Text>

                    <View style={{
                        gap: 8,
                        alignItems: "center",
                        flexDirection: "row"
                    }}>

                        {TYPES.map((t) => {
                            const isSelected = type.value === t.value
                            return (
                                <TouchableOpacity
                                    key={t.value}
                                    onPress={() => {
                                        setType(t)
                                    }}
                                    style={[styles.typeCard,
                                        isSelected ? {borderColor: t.color} : {borderColor: `${t.color}15`}]}
                                >
                                    <View
                                        style={{
                                            gap: 3
                                        }}>
                                        <View
                                            style={[styles.dot, {backgroundColor: t.color}, !isSelected && {opacity: 0.3}]}/>
                                        <Text style={[styles.typeLabel, isSelected && {color: "#fff"}]}>{t.label}</Text>
                                        <Text style={styles.typeSub}>{t.sub.split(" ")[0]}</Text>
                                    </View>

                                </TouchableOpacity>

                            )

                        })}

                    </View>

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 20,
                        justifyContent: "space-between"
                    }}>


                        <View className={"flex-row items-center gap-2"}>
                            <Switch
                                value={keepOpen}
                                trackColor={{false: "#333", true: "#fff"}}
                                thumbColor={keepOpen ? "#fff" : "#888"}
                                // style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                onValueChange={setKeepOpen}
                            />
                            <Text style={[styles.label, {
                                marginBottom: 0,
                                marginTop: 0,
                                fontSize: 13
                            }, keepOpen ? {color: 'white'} : {color: '#aaa'}]}>Bulk Add</Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!selectedRole}
                            style={[styles.submitBtn, !selectedRole && styles.submitBtnDisabled]}
                        >
                            <Text style={styles.submitBtnText}>Add Role</Text>
                            <Ionicons name="add" size={18} color="black"/>
                        </TouchableOpacity>

                    </View>


                </View>

            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        width: "85%",
        backgroundColor: "#121214",
        borderRadius: 16,
        borderColor: "#212121",
        padding: 16,
        borderWidth: 1
    },

    divider: {
        width: "100%",
        height: 2,
        marginVertical: 16,
        backgroundColor: "#1E1E1E",
    },


    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "600"
    },
    subtitle: {
        color: "#888",
        marginTop: 4,

    },
    label: {
        color: "#aaa",
        marginTop: 12,
        marginBottom: 6
    },
    input: {
        backgroundColor: "#1e1e22",
        borderRadius: 10,
        padding: 12,
        color: "white"
    },

    searchBox: {
        flexDirection: "row",
        width: "100%",
        marginTop: 10,
        alignItems: "center",
        gap: 7,
        paddingHorizontal: 16,
        borderRadius: 26,
        borderWidth: 1,
        paddingVertical: 5,
        backgroundColor: "black",
        borderColor: "#212121"
    },

    suggestionBox: {
        backgroundColor: "#1a1a1c",
        borderRadius: 12,
        marginTop: 4,
        borderWidth: 1,
        borderColor: "#222",
        maxHeight: 150,
    },
    suggestionItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
    },
    suggestionText: {color: "#bbb", fontSize: 14},

    typeCard: {
        flex: 1,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#222",
        backgroundColor: "#1a1a1c",
    },
    dot: {width: 6, height: 6, borderRadius: 3, marginBottom: 8},
    typeLabel: {color: "#888", fontWeight: "700", fontSize: 13},
    typeSub: {color: "#555", fontSize: 10, marginTop: 2},

    submitBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 14,
        gap: 8,
    },
    submitBtnDisabled: {opacity: 0.2},
    submitBtnText: {color: "black", fontWeight: "700", fontSize: 15},

})
