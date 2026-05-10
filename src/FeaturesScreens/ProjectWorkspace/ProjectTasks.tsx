import React, { useMemo, useState } from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Pressable,
    LayoutAnimation,
    Platform,
    UIManager,
    TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useLocalSearchParams } from 'expo-router'
import { Id } from '@/convex/_generated/dataModel'
import Toast from 'react-native-toast-message'
import CreateTaskDialog from '@/components/Dialogs/CreateTaskDialog'
import LinearBackgroundProvider from "@/providers/LinearBackgroundProvider";
import {Task} from "@/constraints/type";

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

type Priority = 'high' | 'medium' | 'low' | 'none'

type Status =
    | 'not-started'
    | 'in-progress'
    | 'reviewing'
    | 'testing'
    | 'completed'

interface UITask {
    id: string
    name: string
    description?: string
    priority: Priority
    dueDate?: string
    tags?: string[]
    assignees?: any[]
    status: Status
    done: boolean
    isBlocked?: boolean
}

const PRIORITY_COLOR: Record<Priority, string> = {
    high: '#E24B4A',
    medium: '#EF9F27',
    low: '#639922',
    none: '#2a2a2a',
}

const PRIORITY_BG: Record<Priority, string> = {
    high: 'rgba(226,75,74,0.12)',
    medium: 'rgba(239,159,39,0.12)',
    low: 'rgba(99,153,34,0.12)',
    none: 'rgba(42,42,42,0.3)',
}

const PRIORITY_LABEL: Record<Priority, string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    none: 'None',
}

const STATUS_COLOR: Record<Status, string> = {
    'not-started': '#888780',
    'in-progress': '#EF9F27',
    'reviewing': '#185FA5',
    'testing': '#7F77DD',
    'completed': '#639922',
}

const STATUS_ORDER: Status[] = [
    'not-started',
    'in-progress',
    'reviewing',
    'testing',
    'completed',
]

const STATUS_LABELS: Record<Status, string> = {
    'not-started': 'Not started',
    'in-progress': 'In progress',
    'reviewing': 'Reviewing',
    'testing': 'Testing',
    'completed': 'Completed',
}

export default function ProjectTasksScreen() {

    const insets = useSafeAreaInsets()
    const { slug } = useLocalSearchParams()

    const [taskLimit, setTaskLimit] = useState(10)
    const [expandedTask, setExpandedTask] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [createTaskVisible, setCreateTaskVisible] = useState(false)
    const [collapsed, setCollapsed] = useState<Record<Status, boolean>>({
        'not-started': false,
        'in-progress': false,
        'reviewing': false,
        'testing': true,
        'completed': false,
    })

    const project = useQuery(
        api.projects.getProjectBySlug,
        slug ? { slug: slug as string } : 'skip'
    )

        const tasks = useQuery(
            api.workspace.getTasks,
            project?._id
                ? { projectId: project._id as Id<'projects'>, limit: taskLimit }
                : 'skip'
        )

        console.log("tasks", tasks)
        // console.log("tasks assignees", tasks?.map(task => task.assignees))
        tasks?.forEach(task => {
            task.assignees?.forEach(person => {
                console.log("FULL PERSON", JSON.stringify(person, null, 2))
            })
        })

    const deleteTasks = useMutation(api.workspace.deleteTasks)

    const filteredTasks = useMemo(() => {
        if (!tasks) return []

        return tasks.filter(task =>
            task.title.toLowerCase().includes(search.toLowerCase())
        )
    }, [tasks, search])

    const groups = useMemo(() => {
        return STATUS_ORDER.map(status => ({
            status,
            tasks: filteredTasks.filter(task => {

                switch (task.status) {
                    case 'not started':
                        return status === 'not-started'

                    case 'inprogress':
                        return status === 'in-progress'

                    case 'reviewing':
                        return status === 'reviewing'

                    case 'testing':
                        return status === 'testing'

                    case 'completed':
                        return status === 'completed'

                    default:
                        return false
                }
            }),
        }))
    }, [filteredTasks])

    const hasMoreTasks = (tasks?.length || 0) >= taskLimit

    const toggleCollapse = (status: Status) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setCollapsed(prev => ({ ...prev, [status]: !prev[status] }))
    }

    const tapCard = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExpandedTask(prev => prev === id ? null : id)
    }

    const deleteTask = async (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        try {
            await deleteTasks({ taskIds: [id as Id<'tasks'>] })
            setExpandedTask(null)
            Toast.show({ type: 'success', text1: 'Task deleted', position: 'bottom' })
        } catch {
            Toast.show({ type: 'error', text1: 'Failed to delete task', position: 'bottom' })
        }
    }

    if (project === undefined || tasks === undefined) {
        return (
            <View style={styles.loader}>
                <Text style={{ color: '#888' }}>Loading…</Text>
            </View>
        )
    }

    const renderTask = ({ item: task }: { item: Task }) => {



        const isExpanded = expandedTask === task._id
        const priorityColor = PRIORITY_COLOR[(task.priority || 'none') as Priority]
        const priorityBg = PRIORITY_BG[(task.priority || 'none') as Priority]




        return (
            <View>
                <Pressable
                    onPress={() => tapCard(task._id)}
                    style={[styles.taskCard, task.status === "completed" && styles.taskCardDone]}
                >
                    {/* Priority strip on the left */}
                    <View style={[styles.priorityStrip, { backgroundColor: priorityColor }]} />

                    <View style={styles.cardBody}>

                        {/* Top row: checkbox + title */}
                        <View style={styles.cardTop}>
                            <View style={[styles.checkbox, task.status === "completed" && styles.checkboxDone]}>
                                {task.status === "completed" && (
                                    <Ionicons name="checkmark" size={12} color="#fff" />
                                )}
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text
                                    numberOfLines={2}
                                    style={[styles.taskTitle, task.status === "completed" && styles.taskTitleDone]}
                                >
                                    {task.isBlocked && (
                                        <Text style={{ color: '#E24B4A' }}>⚑ </Text>
                                    )}
                                    {task.title}
                                </Text>
                            </View>
                        </View>

                        {/* Meta row: duration, tags, assignees */}
                        <View style={styles.metaRow}>

                            {!!task.estimation && (
                                <View style={styles.durationPill}>
                                    <Ionicons name="time-outline" size={11} color="#666" />
                                    <Text style={styles.durationText}>
                                        {formatDate(task.estimation.startDate)} — {formatDate(task.estimation.endDate)}
                                    </Text>
                                </View>
                            )}

                            {task.type && (
                                <View style={styles.tagChip}>
                                    <Text style={styles.tagText}>
                                        {task.type.label}
                                    </Text>
                                </View>
                            )}


                            {!!task.assignees?.length && (

                                <View style={styles.avatarStack}>

                                    {task.assignees.slice(0, 3).map((a, i) => (

                                        <View
                                            key={a._id}
                                            style={[
                                                styles.avatar,
                                                { marginLeft: i === 0 ? 0 : -8 }
                                            ]}
                                        >

                                            {a.avatar ? (

                                                <Image
                                                    source={{ uri: a.avatar }}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: 999,
                                                    }}
                                                />

                                            ) : (

                                                <Text style={styles.avatarText}>
                                                    {a.name?.charAt(0)?.toUpperCase()}
                                                </Text>

                                            )}

                                        </View>

                                    ))}

                                </View>
                            )}

                            {!task.assignees?.length && (

                                <View style={styles.unassigned}>

                                    <View
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 999,
                                            backgroundColor: "#1E1E1E",
                                            borderWidth: 1,
                                            borderColor: "#2A2A2A",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Ionicons
                                            name="person-outline"
                                            size={12}
                                            color="#666"
                                        />
                                    </View>

                                    <Text style={styles.unassignedText}>
                                        Unassigned
                                    </Text>

                                </View>
                            )}

                            {!task.assignees?.length && (
                                <View style={styles.unassigned}>
                                    <Ionicons name="person-remove-outline" size={11} color="#555" />
                                    <Text style={styles.unassignedText}>Unassigned</Text>
                                </View>
                            )}

                        </View>

                        {/* Expanded: description + priority badge + actions */}
                        {isExpanded && (
                            <View style={styles.expandedArea}>

                                <View style={styles.divider} />

                                {!!task.description && (
                                    <Text style={styles.descText}>{task.description}</Text>
                                )}
                                {!task.description && (
                                    <Text style={styles.descTextEmpty}>No description provided yet…</Text>
                                )}

                                <View style={styles.priorityRow}>
                                    <Text style={styles.priorityLabel}>Priority</Text>
                                    <View style={[styles.priorityBadge, { backgroundColor: priorityBg }]}>
                                        <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                                        <Text style={[styles.priorityBadgeText, { color: priorityColor }]}>
                                            {PRIORITY_LABEL[(task.priority || 'none') as Priority]}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <Ionicons name="create-outline" size={14} color="#aaa" />
                                        <Text style={styles.actionText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.actionBtnDanger]}
                                        onPress={() => deleteTask(task._id)}
                                    >
                                        <Ionicons name="trash-outline" size={14} color="#F09595" />
                                        <Text style={[styles.actionText, { color: '#F09595' }]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        )}

                    </View>
                </Pressable>
            </View>
        )
    }

    return (
        <LinearBackgroundProvider >

        <View style={[styles.container, ]}>

            {/* Toolbar */}
            <View style={styles.toolbar}>
                <View style={styles.searchBox}>
                    <Ionicons name="search-outline" size={15} color="#555" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search tasks…"
                        placeholderTextColor="#444"
                        style={styles.searchInput}
                    />
                </View>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="options-outline" size={17} color="#888" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => setCreateTaskVisible(true)}
                >
                    <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Groups list */}
            <FlatList
                data={groups}
                keyExtractor={item => item.status}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => (
                    <View style={styles.section}>

                        {/* Section header */}
                        <TouchableOpacity
                            style={styles.sectionHeader}
                            onPress={() => toggleCollapse(item.status)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="chevron-forward"
                                size={12}
                                color="#555"
                                style={{
                                    transform: [{
                                        rotate: collapsed[item.status] ? '0deg' : '90deg'
                                    }]
                                }}
                            />
                            <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[item.status] }]} />
                            <Text style={styles.sectionTitle}>
                                {STATUS_LABELS[item.status].toUpperCase()}
                            </Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{item.tasks.length}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Tasks */}
                        {!collapsed[item.status] && (
                            <FlatList
                                data={item.tasks}
                                keyExtractor={t => t._id}
                                renderItem={renderTask}
                                scrollEnabled={false}
                                contentContainerStyle={styles.tasksList}
                                ListEmptyComponent={
                                    <View style={styles.emptyRow}>
                                        <Text style={styles.emptyText}>No tasks here</Text>
                                    </View>
                                }
                            />
                        )}

                    </View>
                )}
                ListFooterComponent={
                    hasMoreTasks ? (
                        <TouchableOpacity
                            style={styles.loadMoreBtn}
                            onPress={() => setTaskLimit(prev => prev + 10)}
                        >
                            <Text style={styles.loadMoreText}>Load more</Text>
                        </TouchableOpacity>
                    ) : null
                }
            />

            {project?._id && (
                <CreateTaskDialog
                    visible={createTaskVisible}
                    onClose={() => setCreateTaskVisible(false)}
                    projectId={project._id}
                />
            )}

        </View>
        </LinearBackgroundProvider>

    )
}

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(ts: number): string {
    const d = new Date(ts)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

    container: {
        flex: 1,
        // backgroundColor: '#0c0c0e',
    },

    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0c0c0e',
    },

    // ── toolbar ──────────────────────────────────────────────────────────────

    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: '#1e1e1e',
    },

    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#181818',
        borderWidth: 0.5,
        borderColor: '#2a2a2a',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 9,
    },

    searchInput: {
        flex: 1,
        color: '#aaa',
        fontSize: 14,
    },

    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#181818',
        borderWidth: 0.5,
        borderColor: '#2a2a2a',
        alignItems: 'center',
        justifyContent: 'center',
    },

    addBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#185FA5',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ── section ───────────────────────────────────────────────────────────────

    section: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#181818',
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        // paddingHorizontal: 16,
        paddingVertical: 16,
    },

    statusDot: {
        width: 3,
        height: 16,
        borderRadius: 99,
    },

    sectionTitle: {
        flex: 1,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.9,
        color: '#666',
    },

    countBadge: {
        backgroundColor: '#1e1e1e',
        borderRadius: 99,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },

    countText: {
        fontSize: 11,
        color: '#555',
        fontWeight: '600',
    },

    tasksList: {
        // paddingHorizontal: 12,
        paddingBottom: 10,
        gap: 10,
    },

    // ── task card ─────────────────────────────────────────────────────────────

    taskCard: {
        flexDirection: 'row',
        backgroundColor: '#131316',
        borderWidth: 1,
        marginBottom:10,
        borderColor: '#1f1f25',
        borderRadius: 18,
        overflow: 'hidden',
    },

    taskCardDone: {
        opacity: 0.5,
    },

    priorityStrip: {
        width: 5,
        flexShrink: 0,
    },

    cardBody: {
        flex: 1,
        padding: 14,
    },

    cardTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },

    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: '#2e2e2e',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
        flexShrink: 0,
    },

    checkboxDone: {
        backgroundColor: '#185FA5',
        borderColor: '#185FA5',
    },

    taskTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#f0f0f0',
        lineHeight: 21,
    },

    taskTitleDone: {
        textDecorationLine: 'line-through',
        color: '#555',
    },

    // ── meta row ─────────────────────────────────────────────────────────────

    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 10,
    },

    durationPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#181818',
        borderWidth: 0.5,
        borderColor: '#252525',
        borderRadius: 8,
        // paddingHorizontal: 8,
        paddingVertical: 3,
    },

    durationText: {
        fontSize: 11,
        color: '#777',
    },

    tagChip: {
        backgroundColor: '#1c1c1c',
        borderWidth: 1,
        borderColor: '#272727',
        borderRadius: 99,
        // paddingHorizontal: 9,
        paddingVertical: 3,
    },

    tagText: {
        fontSize: 11,
        color: '#999',
        fontWeight: '500',
    },

    avatarStack: {
        flexDirection: 'row',
        marginLeft: 'auto',
    },

    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#0C447C',
        borderWidth: 2,
        borderColor: '#131316',
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarText: {
        fontSize: 8,
        fontWeight: '700',
        color: '#85B7EB',
    },

    unassigned: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginLeft: 'auto',
    },

    unassignedText: {
        fontSize: 11,
        color: '#555',
    },

    // ── expanded area ─────────────────────────────────────────────────────────

    expandedArea: {
        marginTop: 10,
    },

    divider: {
        height: 0.5,
        backgroundColor: '#1e1e1e',
        marginBottom: 10,
    },

    descText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        marginBottom: 10,
    },

    descTextEmpty: {
        fontSize: 12,
        color: '#444',
        fontStyle: 'italic',
        marginBottom: 10,
    },

    priorityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },

    priorityLabel: {
        fontSize: 11,
        color: '#666',
    },

    priorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderRadius: 6,
        // paddingHorizontal: 8,
        paddingVertical: 3,
    },

    priorityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },

    priorityBadgeText: {
        fontSize: 11,
        fontWeight: '600',
    },

    actionRow: {
        flexDirection: 'row',
        gap: 8,
    },

    actionBtn: {
        flex: 1,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#1b1b1b',
        borderWidth: 1,
        borderColor: '#2a2a2a',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },

    actionBtnDanger: {
        borderColor: 'rgba(240,149,149,0.2)',
        backgroundColor: 'rgba(240,149,149,0.05)',
    },

    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#aaa',
    },

    // ── footer ───────────────────────────────────────────────────────────────

    loadMoreBtn: {
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#1a1a1a',
        // paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 99,
        borderWidth: 0.5,
        borderColor: '#2a2a2a',
    },

    loadMoreText: {
        color: '#aaa',
        fontSize: 12,
    },

    emptyRow: {
        paddingVertical: 20,
        alignItems: 'center',
    },

    emptyText: {
        fontSize: 13,
        color: '#444',
    },
})