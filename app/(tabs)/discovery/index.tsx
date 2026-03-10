import React, { useState, useCallback, useMemo, memo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    FlatList,
    Pressable,
} from "react-native";
import { useDebounce } from "use-debounce";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeOut,
    Layout,
    LinearTransition, useAnimatedStyle, withTiming,
} from "react-native-reanimated";

import {
    Users, Compass, Github, Box, Search, ChevronDown,
    ChevronRight, SlidersHorizontal, Hash, UserCircle2,
    AlertTriangle, RotateCcw
} from "lucide-react-native";

import DiscoveryProjectCard from "@/components/Extras/DiscoveryProjectCard";
import { useSearchMode, setSearchModeState } from "@/queries/BasicAppData/SearchMode";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useDiscoveryProject } from "@/queries/Discovery/useDiscoveryProjec";
import { AVAILABLE_TAGS, roles as AVAILABLE_ROLES } from "@/constraints/StaticData";
import {DiscoveryProjectSkeletonView} from "@/components/SkeletonLayout/DiscoveryProjectSkeletonView";

const FilterChip = memo(({ label, active, onPress }: any) => (
    <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.chip, active && styles.chipActive]}
    >
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
));

const MODES = [
    {
        id: "Discovery",
        label: "DISCOVERY",
        description: "Explore trending profiles and algorithmic suggestions.",
        icon: Compass,
        color: "#3B82F6",
    },
    {
        id: "Collaborative",
        label: "COLLABORATIVE",
        description: "Find people through shared networks and connections.",
        icon: Users,
        color: "#8B5CF6",
    },
    {
        id: "OpenSource",
        label: "OPEN SOURCE",
        description: "Search developers across public open-source platforms.",
        icon: Github,
        color: "#F43F5E",
    },
    {
        id: "Product",
        label: "PRODUCT",
        description: "Discover people behind products, startups and launches.",
        icon: Box,
        color: "#F59E0B",
    },
];


const Discover = () => {
    const { data: searchMode } = useSearchMode();
    const queryClient = useQueryClient();

    const [isChangingMode, setIsChangingMode] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const [debouncedTags] = useDebounce(selectedTags, 300);
    const [debouncedRoles] = useDebounce(selectedRoles, 300);
    const [debouncedSearch] = useDebounce(searchText, 300);

    const { data, isLoading } = useDiscoveryProject(debouncedTags, debouncedRoles, debouncedSearch);
    const items = useMemo(() => data ?? [], [data]);

    const hasActiveFilters = selectedTags.length > 0 || selectedRoles.length > 0 || searchText.length > 0;

    const toggleTag = useCallback((tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 5 ? [...prev, tag] : prev);
    }, []);

    const toggleRole = useCallback((role: string) => {
        setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : prev.length < 3 ? [...prev, role] : prev);
    }, []);

    const resetFilters = () => {
        setSearchText("");
        setSelectedTags([]);
        setSelectedRoles([]);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(showFilters ? 200 : 0, { duration: 250 }),
            opacity: withTiming(showFilters ? 1 : 0),
        };
    });

    const activeMode = MODES.find((m) => m.id === searchMode);

    if (searchMode === "None") {
        return (
            <FlatList
                data={MODES}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View style={styles.header}>
                        <Text style={styles.overline}>DISCOVER</Text>
                        <Text style={styles.mainTitle}>Choose a Search Mode</Text>
                        <Text style={styles.subtitle}>
                            Select how you want to discover people, projects, and communities.
                            Each mode explores a different signal.
                        </Text>
                    </View>
                )}
                renderItem={({item, index}) => (
                    <Animated.View
                        entering={FadeInDown.delay(index * 100).springify()}
                    >
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.modeCard}
                            onPress={() => setSearchModeState(queryClient, item.id as any)}
                        >
                            <View style={[styles.iconBox, {backgroundColor: item.color + "15"}]}>
                                <item.icon size={22} color={item.color} strokeWidth={2.5}/>
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{item.label}</Text>
                                <Text style={styles.cardDesc} numberOfLines={2}>
                                    {item.description}
                                </Text>
                            </View>

                            <ChevronRight size={18} color="rgba(255,255,255,0.3)"/>
                        </TouchableOpacity>
                    </Animated.View>
                )}
                ItemSeparatorComponent={() => <View style={{height: 12}}/>}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View layout={LinearTransition.duration(200)} style={styles.headerStack}>
                <View style={styles.searchBarRow}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.activeIconPill, isChangingMode && styles.activeIconPillOpen]}
                        onPress={() => setIsChangingMode(!isChangingMode)}
                    >
                        {activeMode && <activeMode.icon size={18} color={activeMode.color} strokeWidth={2.5} />}
                        <ChevronDown size={12} color="rgba(255,255,255,0.3)" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>

                    <View style={styles.inputWrapper}>
                        <Search size={18} color="rgba(255,255,255,0.2)" />
                        <TextInput
                            placeholder={`Search ${searchMode}...`}
                            placeholderTextColor="rgba(255,255,255,0.15)"
                            style={styles.input}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                        <TouchableOpacity
                            onPress={() => setShowFilters(!showFilters)}
                            style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
                        >
                            <SlidersHorizontal size={18} color={showFilters ? "#3B82F6" : "rgba(255,255,255,0.4)"} />
                        </TouchableOpacity>
                    </View>
                </View>

                {isChangingMode && (
                    <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)} style={styles.modeSwitcherDropdown}>
                        {MODES.map((m) => (
                            <TouchableOpacity
                                key={m.id}
                                style={[styles.miniModeItem, searchMode === m.id && styles.miniModeItemActive]}
                                onPress={() => { setSearchModeState(queryClient, m.id as any); setIsChangingMode(false); }}
                            >
                                <m.icon size={16} color={searchMode === m.id ? m.color : "rgba(255,255,255,0.4)"} />
                                <Text style={[styles.miniModeText, searchMode === m.id && { color: '#fff' }]}>{m.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                )}

                {/*{showFilters && (*/}
                    <Animated.View
                        entering={FadeInDown.duration(200)}
                        exiting={FadeOut.duration(100)}
                        layout={Layout.springify()}   // <- important
                        style={[styles.filterPanel,animatedStyle]}
                    >
                        <View style={styles.panelHeader}>
                            <Text style={styles.panelLabel}>SEARCH FILTERS</Text>

                            {hasActiveFilters && (
                                <TouchableOpacity onPress={resetFilters}>
                                    <Text style={styles.clearAllText}>RESET_SYSTEM</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <FilterSection
                            label={`TAGS (${selectedTags.length}/5)`}
                            icon={Hash}
                            data={AVAILABLE_TAGS}
                            selected={selectedTags}
                            onSelect={toggleTag}
                        />

                        <FilterSection
                            label={`ROLES (${selectedRoles.length}/3)`}
                            icon={UserCircle2}
                            data={AVAILABLE_ROLES}
                            selected={selectedRoles}
                            onSelect={toggleRole}
                            isLast
                        />
                    </Animated.View>
                {/*)}*/}
            </Animated.View>

            <FlatList
                data={isLoading ? [1, 2, 3, 4] : items}
                keyExtractor={(item, index) => isLoading ? index.toString() : item._id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => isLoading ? (
                    <DiscoveryProjectSkeletonView/>
                ) : (
                    <DiscoveryProjectCard
                        item={item}
                        onPress={() => router.push(`/discovery/${item._id}`)}
                    />
                )}
                ListEmptyComponent={() => !isLoading && (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconBox}>
                            <AlertTriangle size={32} color="#27272A" strokeWidth={1.5} />
                        </View>

                        <Text style={styles.emptyTitle}>No matching sequences</Text>
                        <Text style={styles.emptySubtext}>
                            Adjust your search parameters or reset the discovery filters to broaden your results.
                        </Text>

                        <TouchableOpacity
                            onPress={resetFilters}
                            activeOpacity={0.8}
                            style={styles.purgeBtn}
                        >
                            <RotateCcw size={14} color="black" strokeWidth={2.5} />
                            <Text style={styles.purgeBtnText}>Reset Parameters</Text>
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
            />
        </View>
    );
};

const FilterSection = ({ label, icon: Icon, data, selected, onSelect, isLast }: any) => (
    <View style={[styles.filterRow, isLast && { borderBottomWidth: 0 }]}>
        <View style={styles.rowLabelBox}>
            <Icon size={12} color="rgba(255,255,255,0.3)" />
            <Text style={styles.rowLabel}>{label}</Text>
        </View>
        <FlatList
            horizontal
            data={data}
            renderItem={({ item }) => (
                <FilterChip
                    label={item}
                    active={selected.includes(item)}
                    onPress={() => onSelect(item)}
                />
            )}
            keyExtractor={it => it}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
        />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1,  },
    listContent: { paddingHorizontal: 16,  paddingBottom: 100, flexGrow: 1 },

    //  Mode is not Selected
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    header: {
        marginBottom: 32,
    },
    overline: {
        letterSpacing: 1.2,
        fontSize: 20,
        fontWeight: "800",
        color: "white",
        marginBottom: 6
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 1,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        color: '#A1A1AA',
        fontWeight: '400',
    },
    modeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181B',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 14,
        lineHeight: 20,
        color: '#71717A',
    },




    //  Header Section
    headerStack: { paddingHorizontal: 16,  zIndex: 100 },
    searchBarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    activeIconPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, height: 48, borderRadius: 12, borderWidth: 1, borderColor: "#2D2D2F" },
    activeIconPillOpen: { borderColor: '#3B82F6', backgroundColor: '#2D2D2F' },
    inputWrapper: { flex: 1, flexDirection: "row", alignItems: "center", borderRadius: 12, paddingLeft: 14, height: 48,  borderWidth: 1, borderColor: "#2D2D2F" },
    input: { flex: 1, color: "#fff", fontSize: 14, marginLeft: 10 },
    filterToggle: { padding: 12, borderLeftWidth: 1, borderColor: "#2D2D2F" },
    filterToggleActive: { backgroundColor: 'rgba(0,97,255,0.08)' },


    //  Filter Panels

    filterPanel: {  borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: "#2D2D2F", overflow: "hidden" },
    panelHeader: { flexDirection: "row", justifyContent: "space-between", padding: 14, paddingBottom: 6 },
    panelLabel: { color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: "900", letterSpacing: 1.2 },
    clearAllText: { color: "#F43F5E", fontSize: 10, fontWeight: "800" },
    filterRow: { paddingVertical: 12, borderBottomWidth: 1, borderColor: "#1A1A1A" },
    rowLabelBox: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, marginBottom: 10 },
    rowLabel: { color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: "700" },
    chipScroll: { paddingHorizontal: 14, gap: 8 },
    chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#111", borderWidth: 1, borderColor: "#222" },
    chipActive: { backgroundColor: "white", borderColor: "#2D2D2F" },
    chipText: { color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: "600" },
    chipTextActive: { color: "black",fontWeight:"bold" },


    // Mode Changing

    modeSwitcherDropdown: { position: "absolute", top: 62, left: 16, backgroundColor: "#1C1C1E", borderRadius: 12, padding: 6,zIndex:105, borderWidth: 1, borderColor: "#1A1A1A", width: 200, elevation: 10 },
    miniModeItem: { flexDirection: "row", alignItems: "center", padding: 12, gap: 10, borderRadius: 8 },
    miniModeItemActive: { backgroundColor: '#2d2d2d' },
    miniModeText: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: "700" },


    //  Project Card

    skeletonCard: { flexDirection: 'row', gap: 15, padding: 16, backgroundColor: '#0A0A0A', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#1A1A1A' },
    skeletonSquare: { width: 44, height: 44, backgroundColor: '#111', borderRadius: 6 },
    skeletonLine: { height: 10, backgroundColor: '#111', borderRadius: 4 },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 },
    emptySubtext: { color: "rgba(255,255,255,0.3)", fontSize: 14, marginTop: 12, marginBottom: 24 },
    purgeBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: "#3B82F640" },
    purgeBtnText: { color: "#3B82F6", fontSize: 12, fontWeight: "800" },


    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100, // Balanced vertical centering
        paddingHorizontal: 48,
    },
    emptyIconBox: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#18181B', // Zinc-900
        borderWidth: 1,
        borderColor: '#27272A', // Zinc-800
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: -0.4,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#71717A', // Zinc-500
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    purgeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // High-contrast primary action
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    purgeBtnText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },

});

export default Discover;