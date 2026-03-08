import React, { useRef, useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Pressable,
    StyleSheet,
} from "react-native"

type MenuItem = {
    label: string
    onPress: () => void
    danger?: boolean
}

type AnchorMenuProps = {
    anchor: React.ReactNode
    items: MenuItem[]
}

export function AnchorMenu({ anchor, items }: AnchorMenuProps) {
    const anchorRef = useRef<View>(null)
    const [visible, setVisible] = useState(false)
    const [pos, setPos] = useState({ x: 0, y: 0 })

    const openMenu = () => {
        anchorRef.current?.measureInWindow((x, y, w, h) => {
            setPos({ x: x + w, y: y + h })
            setVisible(true)
        })
    }

    return (
        <>
            <TouchableOpacity onPress={openMenu}>
                <View ref={anchorRef}>
                    {anchor}
                </View>
            </TouchableOpacity>

            <Modal transparent visible={visible} animationType="fade">
                <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)}>
                    <View style={[styles.menu, { top: pos.y, left: pos.x - 180 }]}>
                        {items.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.item}
                                onPress={() => {
                                    setVisible(false)
                                    item.onPress()
                                }}
                            >
                                <Text
                                    style={[
                                        styles.text,
                                        item.danger && { color: "#ff4d4f" },
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    menu: {
        position: "absolute",
        width: 180,
        backgroundColor: "#1e1e1e",
        borderRadius: 12,
        paddingVertical: 8,
    },
    item: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    text: {
        color: "white",
        fontSize: 16,
    },
})
