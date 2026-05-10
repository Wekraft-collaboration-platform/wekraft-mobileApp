import React, {useEffect, useMemo, useState} from "react"

import {
    View,
    Text,
    Modal,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native"

import {
    Ionicons
} from "@expo/vector-icons"

import {
    useMutation,
    useQuery
} from "convex/react"

import { api } from "@/convex/_generated/api"

import { Id } from "@/convex/_generated/dataModel"

import Toast from "react-native-toast-message"

import DateTimePicker
    from '@react-native-community/datetimepicker'

import * as DocumentPicker from "expo-document-picker"

type Props = {
    visible: boolean
    onClose: () => void
    projectId: Id<"projects">
}

export default function CreateTaskDialog({
                                             visible,
                                             onClose,
                                             projectId,
                                         }: Props) {

    const createTask =
        useMutation(api.workspace.createTask)

    const members = useQuery(
        api.projects.getProjectMembers,
        { projectId }
    )

    const existingTags = useQuery(
        api.workspace.getUniqueTags,
        { projectId }
    )

    const [title, setTitle] =
        useState("")

    const [description, setDescription] =
        useState("")

    const [priority, setPriority] =
        useState("none")

    const [status, setStatus] =
        useState("not started")

    const [selectedTag, setSelectedTag] =
        useState<any>(null)

    const [selectedMembers, setSelectedMembers] =
        useState<any[]>([])

    const [attachments, setAttachments] =
        useState<any[]>([])

    const [linkedCodePath, setLinkedCodePath] =
        useState("")

    const [startDate, setStartDate] =
        useState(new Date())

    const [endDate, setEndDate] =
        useState(new Date())

    const [showStartPicker, setShowStartPicker] =
        useState(false)

    const [showEndPicker, setShowEndPicker] =
        useState(false)

    const [isPending, setIsPending] =
        useState(false)

    useEffect(() => {

        if (visible) {

            setTitle("")
            setDescription("")
            setPriority("none")
            setStatus("not started")
            setSelectedTag(null)
            setSelectedMembers([])
            setAttachments([])
            setLinkedCodePath("")
            setStartDate(new Date())
            setEndDate(new Date())
            setShowStartPicker(false)
            setShowEndPicker(false)
            setIsPending(false)

        }

    }, [visible])

    const pickAttachment = async () => {

        try {

            const result =
                await DocumentPicker.getDocumentAsync({
                    multiple: true,
                })

            if (result.canceled) return

            setAttachments(prev => [
                ...prev,
                ...result.assets
            ])

        } catch (e) {
            console.log(e)
        }
    }

    const validate = () => {

        if (!title.trim()) {

            Toast.show({
                type: "error",
                text1: "Task title required",
                position: "bottom",
            })

            return false
        }

        if (title.trim().length < 3) {

            Toast.show({
                type: "error",
                text1: "Title too short",
                position: "bottom",
            })

            return false
        }

        if (endDate < startDate) {

            Toast.show({
                type: "error",
                text1: "Invalid duration",
                position: "bottom",
            })

            return false
        }

        return true
    }

    const handleCreateTask = async () => {

        if (!validate()) return

        try {

            setIsPending(true)

            // console.log("Task created : ", selectedMembers)
            console.log(
                "Task created : ",
                JSON.stringify(selectedMembers, null, 2)
            )

            await createTask({

                title,

                description:
                    description.trim() || undefined,

                projectId,

                priority:
                    priority === "none"
                        ? undefined
                        : priority,

                status,

                type:
                    selectedTag || undefined,

                assignees:
                    selectedMembers.length > 0
                        ? selectedMembers
                        : undefined,

                estimation: {
                    startDate:
                        startDate.getTime(),

                    endDate:
                        endDate.getTime(),
                },

                linkWithCodebase:
                    linkedCodePath || undefined,

                attachments:
                    attachments.length > 0
                        ? attachments.map(file => ({
                            name: file.name,
                            uri: file.uri,
                        }))
                        : undefined,
            })

            Toast.show({
                type: "success",
                text1: "Task created",
                position: "bottom",
            })

            onClose()

        } catch (e) {

            Toast.show({
                type: "error",
                text1: "Failed to create task",
                position: "bottom",
            })

        } finally {

            setIsPending(false)
        }
    }

    return (

        <Modal
            visible ={visible}
            transparent
            animationType="fade"
        >
            <View style={styles.backdrop}>

                <View style={styles.container}>


            <KeyboardAvoidingView
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
                style={{
                    backgroundColor: "#121214",
                }}
            >

                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        padding: 18,
                        paddingBottom: 120,
                    }}
                    showsVerticalScrollIndicator={false}
                >



                <View style={styles.header}>

                    <TouchableOpacity
                        onPress={onClose}
                    >
                        <Ionicons
                            name="close"
                            size={26}
                            color="#aaa"
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Create Task
                    </Text>

                    <TouchableOpacity
                        onPress={handleCreateTask}
                        disabled={isPending}
                        style={styles.createBtn}
                    >
                        <Text style={styles.createBtnText}>
                            {
                                isPending
                                    ? "Creating..."
                                    : "Create"
                            }
                        </Text>
                    </TouchableOpacity>

                </View>

                <ScrollView
                    contentContainerStyle={{
                        padding: 18,
                        paddingBottom: 120,
                    }}
                    showsVerticalScrollIndicator={false}
                >

                    {/* TITLE */}

                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Task title"
                        placeholderTextColor="#555"
                        style={styles.titleInput}
                    />

                    {/* DESCRIPTION */}

                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Description"
                        placeholderTextColor="#555"
                        multiline
                        textAlignVertical="top"
                        style={styles.descriptionInput}
                    />

                    {/* PRIORITY */}

                    <SectionTitle title="Priority" />

                    <View style={styles.row}>

                        {[
                            "none",
                            "low",
                            "medium",
                            "high",
                        ].map(p => {

                            const selected =
                                priority === p

                            return (

                                <TouchableOpacity
                                    key={p}
                                    style={[
                                        styles.chip,
                                        selected &&
                                        styles.chipSelected
                                    ]}
                                    onPress={() =>
                                        setPriority(p)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            selected &&
                                            styles.chipTextSelected
                                        ]}
                                    >
                                        {p}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}

                    </View>

                    {/* STATUS */}

                    <SectionTitle title="Status" />

                    <View style={styles.row}>

                        {[
                            "not started",
                            "inprogress",
                            "reviewing",
                            "testing",
                            "completed",
                        ].map(s => {

                            const selected =
                                status === s

                            return (

                                <TouchableOpacity
                                    key={s}
                                    style={[
                                        styles.chip,
                                        selected &&
                                        styles.chipSelected
                                    ]}
                                    onPress={() =>
                                        setStatus(s)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            selected &&
                                            styles.chipTextSelected
                                        ]}
                                    >
                                        {s}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}

                    </View>

                    {/* DURATION */}

                    <SectionTitle title="Duration" />

                    <View style={styles.durationRow}>

                        <TouchableOpacity
                            style={styles.dateBtn}
                            onPress={() =>
                                setShowStartPicker(true)
                            }
                        >

                            <Ionicons
                                name="calendar-outline"
                                size={16}
                                color="#888"
                            />

                            <Text style={styles.dateText}>

                                {
                                    startDate.toLocaleDateString(
                                        "en-US",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )
                                }

                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.dateBtn}
                            onPress={() =>
                                setShowEndPicker(true)
                            }
                        >

                            <Ionicons
                                name="calendar-outline"
                                size={16}
                                color="#888"
                            />

                            <Text style={styles.dateText}>

                                {
                                    endDate.toLocaleDateString(
                                        "en-US",
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )
                                }

                            </Text>

                        </TouchableOpacity>

                    </View>

                    {/* TAGS */}

                    <SectionTitle title="Tags" />

                    <View style={styles.row}>

                        {existingTags?.map(tag => {

                            const selected =
                                selectedTag?.label ===
                                tag.label

                            return (

                                <TouchableOpacity
                                    key={tag.label}
                                    style={[
                                        styles.tagChip,
                                        selected &&
                                        styles.tagSelected
                                    ]}
                                    onPress={() =>
                                        setSelectedTag(tag)
                                    }
                                >
                                    <Text style={styles.tagText}>
                                        {tag.label}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}

                    </View>

                    {/* ASSIGNEES */}

                    <SectionTitle title="Assignees" />

                    {members?.map(member => {

                        const selected =
                            selectedMembers.some(
                                m => m.userId === member.userId
                            )

                        return (

                            <TouchableOpacity
                                key={member.userId}
                                style={[
                                    styles.memberItem,
                                    selected && styles.memberSelected
                                ]}
                                onPress={() => {

                                    if (selected) {

                                        setSelectedMembers(
                                            prev =>
                                                prev.filter(
                                                    m => m.userId !== member.userId
                                                )
                                        )

                                    } else {

                                        setSelectedMembers(prev => [
                                            ...prev,
                                            {
                                                userId: member.userId,
                                                avatar: member.userImage,
                                                name: member.userName,
                                            }
                                        ])
                                    }
                                }}
                            >

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >

                                    {member.userImage ? (

                                        <Image
                                            source={{ uri: member.userImage }}
                                            style={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: 999,
                                            }}
                                        />

                                    ) : (

                                        <View
                                            style={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: 999,
                                                backgroundColor: "#2563EB",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: "#fff",
                                                    fontWeight: "700",
                                                }}
                                            >
                                                {member.userName?.charAt(0)}
                                            </Text>
                                        </View>

                                    )}

                                    <Text style={styles.memberName}>
                                        {member.userName}
                                    </Text>

                                </View>

                                {selected && (
                                    <Ionicons
                                        name="checkmark"
                                        size={18}
                                        color="#3B82F6"
                                    />
                                )}

                            </TouchableOpacity>
                        )
                    })}

                    {/* LINK CODE */}

                    <SectionTitle title="Link Code" />

                    <TextInput
                        value={linkedCodePath}
                        onChangeText={setLinkedCodePath}
                        placeholder="src/components/Button.tsx"
                        placeholderTextColor="#555"
                        style={styles.input}
                    />

                    {/* ATTACHMENTS */}

                    <SectionTitle title="Attachments" />

                    <TouchableOpacity
                        style={styles.uploadBtn}
                        onPress={pickAttachment}
                    >
                        <Ionicons
                            name="attach"
                            size={18}
                            color="#3B82F6"
                        />

                        <Text style={styles.uploadText}>
                            Add Attachment
                        </Text>
                    </TouchableOpacity>

                    {attachments.map((file, index) => (

                        <View
                            key={index}
                            style={styles.attachmentItem}
                        >

                            <Text
                                numberOfLines={1}
                                style={styles.attachmentText}
                            >
                                {file.name}
                            </Text>

                        </View>
                    ))}

                </ScrollView>

                {showStartPicker && (

                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {

                            setShowStartPicker(false)

                            if (selectedDate) {
                                setStartDate(selectedDate)
                            }
                        }}
                    />

                )}

                {showEndPicker && (

                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {

                            setShowEndPicker(false)

                            if (selectedDate) {
                                setEndDate(selectedDate)
                            }
                        }}
                    />

                )}
                </ScrollView>


            </KeyboardAvoidingView>
                </View>
            </View>

        </Modal>
    )
}

function SectionTitle({
                          title
                      }: {
    title: string
}) {

    return (
        <Text style={styles.sectionTitle}>
            {title}
        </Text>
    )
}

const styles = StyleSheet.create({

    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        width: "92%",
        maxHeight: "88%",
        backgroundColor: "#121214",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#212121",
        overflow: "hidden",
    },

    header: {
        height: 64,
        borderBottomWidth: 1,
        borderBottomColor: "#1f1f1f",
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },

    createBtn: {
        backgroundColor: "#2563EB",
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 12,
    },

    createBtnText: {
        color: "#fff",
        fontWeight: "700",
    },

    titleInput: {
        backgroundColor: "#151515",
        borderRadius: 14,
        padding: 16,
        color: "#fff",
        fontSize: 17,
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },

    descriptionInput: {
        backgroundColor: "#151515",
        borderRadius: 14,
        padding: 16,
        color: "#fff",
        minHeight: 160,
        marginTop: 16,
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },

    sectionTitle: {
        color: "#aaa",
        marginTop: 24,
        marginBottom: 12,
        fontSize: 13,
        fontWeight: "700",
    },

    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },

    chip: {
        backgroundColor: "#171717",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },

    chipSelected: {
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.15)",
    },

    chipText: {
        color: "#888",
    },

    chipTextSelected: {
        color: "#3B82F6",
    },

    durationRow: {
        flexDirection: "row",
        gap: 12,
    },

    dateBtn: {
        flex: 1,
        backgroundColor: "#171717",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },

    dateText: {
        color: "#ddd",
    },

    tagChip: {
        backgroundColor: "#1d1d1d",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
    },

    tagSelected: {
        borderWidth: 1,
        borderColor: "#3B82F6",
    },

    tagText: {
        color: "#ddd",
    },

    memberItem: {
        height: 54,
        borderRadius: 14,
        backgroundColor: "#171717",
        paddingHorizontal: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    memberSelected: {
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.08)",
    },

    memberName: {
        color: "#eee",
        fontSize: 14,
    },

    input: {
        height: 54,
        borderRadius: 14,
        backgroundColor: "#171717",
        paddingHorizontal: 16,
        color: "#fff",
        borderWidth: 1,
        borderColor: "#2a2a2a",
    },

    uploadBtn: {
        height: 54,
        borderRadius: 14,
        backgroundColor: "#171717",
        borderWidth: 1,
        borderColor: "#2a2a2a",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    uploadText: {
        color: "#3B82F6",
        fontWeight: "600",
    },

    attachmentItem: {
        height: 48,
        borderRadius: 12,
        backgroundColor: "#171717",
        marginTop: 10,
        justifyContent: "center",
        paddingHorizontal: 14,
    },

    attachmentText: {
        color: "#ccc",
    },
})