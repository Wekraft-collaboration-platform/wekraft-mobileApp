import React, { useState } from "react";
import { useDebounce } from "use-debounce";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    FlatList,
} from "react-native";

import Animated, {
    FadeInDown,
    FadeInUp,
    FadeOutUp,
} from "react-native-reanimated";

import {
    Users,
    Compass,
    Github,
    Box,
    Search,
    ChevronDown,
    ChevronRight,
    SlidersHorizontal,
    Hash,
    UserCircle2,
    AlertTriangle,
    RotateCcw,
    Activity
} from "lucide-react-native";

import DiscoveryProjectCard from "@/components/Extras/DiscoveryProjectCard";
import { useSearchMode, setSearchModeState } from "@/queries/BasicAppData/SearchMode";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useDiscoveryProject } from "@/queries/Discovery/useDiscoveryProjec";
import { AVAILABLE_TAGS } from "@/constraints/StaticData";
import { roles as AVAILABLE_ROLES } from "@/constraints/StaticData";

const MODES = [
    { id: "Discovery", label: "DISCOVERY", icon: Compass, color: "#3B82F6" },
    { id: "Collaborative", label: "COLLABORATIVE", icon: Users, color: "#8B5CF6" },
    { id: "OpenSource", label: "OPEN SOURCE", icon: Github, color: "#F43F5E" },
    { id: "Product", label: "PRODUCT", icon: Box, color: "#F59E0B" },
];

const Discover = () => {
    const { data: searchMode } = useSearchMode();
    const queryClient = useQueryClient();

    const [isChangingMode, setIsChangingMode] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    const [debouncedTags] = useDebounce(selectedTags, 400);
    const [debouncedRoles] = useDebounce(selectedRoles, 400);
    const [debouncedSearch] = useDebounce(searchText, 400);

    const { data, isLoading } = useDiscoveryProject(debouncedTags, debouncedRoles,debouncedSearch);
    const items = data ?? [];

    const hasActiveFilters = selectedTags.length > 0 || selectedRoles.length > 0 || searchText.length > 0;

    const toggleItem = (item: string, limit: number, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
        setList((prev) => {
            if (prev.includes(item)) return prev.filter((i) => i !== item);
            if (prev.length >= limit) return prev;
            return [...prev, item];
        });
    };

    const resetFilters = () => {
        setSearchText("");
        setSelectedTags([]);
        setSelectedRoles([]);
    };

    const handleSelectMode = (mode: string) => {
        setSearchModeState(queryClient, mode as any);
        setIsChangingMode(false);
    };

    const activeMode = MODES.find((m) => m.id === searchMode);

    // --- Technical Empty State ---
    const RenderEmptyState = () => (
        <Animated.View entering={FadeInDown} style={styles.emptyContainer}>
            <View style={styles.alertIconBox}>
                <AlertTriangle size={32} color="rgba(255,255,255,0.1)" strokeWidth={1} />
            </View>
            <Text style={styles.emptySubtext}>
                No projects found matching your current parameters. Adjust filters or purge search query.
            </Text>
            {hasActiveFilters && (
                <TouchableOpacity onPress={resetFilters} style={styles.purgeBtn}>
                    <RotateCcw size={14} color="#3B82F6" />
                    <Text style={styles.purgeBtnText}>Reset Filter</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            {searchMode === "None" ? (
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInDown.duration(600)}>
                        <Text style={styles.overline}>SYSTEM // EXPLORE</Text>
                        <Text style={styles.mainTitle}>Identify Target</Text>
                    </Animated.View>
                    <View style={styles.listContainer}>
                        {MODES.map((item, index) => (
                            <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
                                <TouchableOpacity style={styles.modeCard} onPress={() => handleSelectMode(item.id)}>
                                    <View style={[styles.iconBox, { borderColor: item.color + "40" }]}>
                                        <item.icon size={22} color={item.color} />
                                    </View>
                                    <Text style={styles.cardTitle}>{item.label}</Text>
                                    <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.activeContainer}>
                    <View style={styles.headerStack}>
                        <View style={styles.searchBarRow}>
                            <TouchableOpacity style={styles.activeIconPill} onPress={() => setIsChangingMode((v) => !v)}>
                                {activeMode && <activeMode.icon size={18} color={activeMode.color} strokeWidth={2.5} />}
                                <ChevronDown size={12} color="rgba(255,255,255,0.3)" style={{ marginLeft: 4 }} />
                            </TouchableOpacity>

                            <View style={styles.inputWrapper}>
                                <Search size={18} color="rgba(255,255,255,0.2)" />
                                <TextInput
                                    placeholder={`Filter ${searchMode}...`}
                                    placeholderTextColor="rgba(255,255,255,0.15)"
                                    style={styles.input}
                                    value={searchText}
                                    onChangeText={setSearchText}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowFilters((v) => !v)}
                                    style={[styles.filterToggle, showFilters && styles.filterToggleActive]}
                                >
                                    <SlidersHorizontal size={18} color={showFilters ? "#3B82F6" : "rgba(255,255,255,0.4)"} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {showFilters && (
                            <Animated.View entering={FadeInUp.springify()} exiting={FadeOutUp} style={styles.filterPanel}>
                                <View style={styles.panelHeader}>
                                    <Text style={styles.panelLabel}>SEARCH FILTER</Text>
                                    {(selectedTags.length > 0 || selectedRoles.length > 0) && (
                                        <TouchableOpacity onPress={resetFilters}>
                                            <Text style={styles.clearAllText}>CLEAR_ALL</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <View style={styles.filterRow}>
                                    <View style={styles.rowLabelBox}>
                                        <Hash size={12} color="rgba(255,255,255,0.3)" />
                                        <Text style={styles.rowLabel}>TAGS ({selectedTags.length}/5)</Text>
                                    </View>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                                        {AVAILABLE_TAGS.map((tag) => {
                                            const active = selectedTags.includes(tag);
                                            return (
                                                <TouchableOpacity key={tag} onPress={() => toggleItem(tag, 5, setSelectedTags)} style={[styles.chip, active && styles.chipActive]}>
                                                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{tag}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>

                                <View style={[styles.filterRow, { borderBottomWidth: 0 }]}>
                                    <View style={styles.rowLabelBox}>
                                        <UserCircle2 size={12} color="rgba(255,255,255,0.3)" />
                                        <Text style={styles.rowLabel}>ROLES ({selectedRoles.length}/3)</Text>
                                    </View>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                                        {AVAILABLE_ROLES.map((role) => {
                                            const active = selectedRoles.includes(role);
                                            return (
                                                <TouchableOpacity key={role} onPress={() => toggleItem(role, 3, setSelectedRoles)} style={[styles.chip, active && styles.chipActive]}>
                                                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{role}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            </Animated.View>
                        )}

                        {isChangingMode && (
                            <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.modeSwitcherDropdown}>
                                {MODES.filter((m) => m.id !== searchMode).map((m) => (
                                    <TouchableOpacity key={m.id} style={styles.miniModeItem} onPress={() => handleSelectMode(m.id)}>
                                        <m.icon size={16} color={m.color} />
                                        <Text style={styles.miniModeText}>{m.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </Animated.View>
                        )}
                    </View>

                    <FlatList
                        data={items}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={{ paddingTop: 10, paddingBottom: 120, flexGrow: 1 }}
                        renderItem={({ item }) => <DiscoveryProjectCard item={item} onPress={() => router.push(`/discovery/${item._id}`)} />}
                        ListEmptyComponent={!isLoading ? RenderEmptyState : null}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, marginHorizontal: 16 },
    scrollContent: { paddingBottom: 40, paddingTop: 60 },
    overline: { color: "#3B82F6", fontSize: 10, fontWeight: "900", letterSpacing: 1.5, marginBottom: 4 },
    mainTitle: { fontSize: 32, fontWeight: "800", color: "#fff", marginBottom: 40 },
    listContainer: { gap: 10 },
    modeCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#0A0A0A", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#1A1A1A" },
    iconBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: "#000", justifyContent: "center", alignItems: "center", borderWidth: 1 },
    cardTitle: { color: "#fff", fontSize: 13, fontWeight: "800", flex: 1, marginLeft: 16 },
    activeContainer: { flex: 1, paddingTop: 10 },
    headerStack: { zIndex: 100 },
    searchBarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    activeIconPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, height: 52, borderRadius: 12, borderWidth: 1, borderColor: "#252525" },
    inputWrapper: { flex: 1, flexDirection: "row", alignItems: "center", borderRadius: 12, paddingLeft: 16, height: 52, borderWidth: 1, borderColor: "#252525" },
    input: { flex: 1, color: "#fff", fontSize: 15, marginLeft: 10 },
    filterToggle: { padding: 14, borderLeftWidth: 1, borderColor: "#252525" },
    filterToggleActive: {  },
    filterPanel: { borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: "#252525", overflow: "hidden" },
    panelHeader: { flexDirection: "row", justifyContent: "space-between", padding: 12, paddingBottom: 0 },
    panelLabel: { color: "rgba(255,255,255,0.2)", fontSize: 8, fontWeight: "900", letterSpacing: 1 },
    clearAllText: { color: "#F43F5E", fontSize: 9, fontWeight: "900" },
    filterRow: { paddingVertical: 12, borderBottomWidth: 1, borderColor: "#252525" },
    rowLabelBox: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, marginBottom: 8 },
    rowLabel: { color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: "900", letterSpacing: 1 },
    chipScroll: { paddingHorizontal: 12, gap: 8 },
    chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: "#111", borderWidth: 1, borderColor: "#1A1A1A" },
    chipActive: { backgroundColor: "#3B82F615", borderColor: "#3B82F6" },
    chipText: { color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: "700" },
    chipTextActive: { color: "#3B82F6" },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 100 },
    alertIconBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#0A0A0A", borderWidth: 1, borderColor: "#1A1A1A", justifyContent: "center", alignItems: "center", marginBottom: 20 },
    emptyCode: { color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: "900", letterSpacing: 2, marginBottom: 8 },
    emptySubtext: { color: "rgba(255,255,255,0.25)", fontSize: 13, textAlign: "center", paddingHorizontal: 40, marginBottom: 24 },
    healthStatus: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 32 },
    healthText: { color: "#10B981", fontSize: 8, fontWeight: "900", letterSpacing: 1 },
    purgeBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: "#3B82F640" },
    purgeBtnText: { color: "#3B82F6", fontSize: 11, fontWeight: "900" },
    modeSwitcherDropdown: { position: "absolute", top: 60, left: 0, backgroundColor: "#161616", borderRadius: 12, padding: 8, borderWidth: 1, borderColor: "#252525", width: 200 },
    miniModeItem: { flexDirection: "row", alignItems: "center", padding: 12, gap: 10 },
    miniModeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});

export default Discover;