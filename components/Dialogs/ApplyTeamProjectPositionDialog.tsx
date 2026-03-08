import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Modal, StyleSheet, KeyboardAvoidingView, Platform,
    ActivityIndicator
} from 'react-native';
import { Send, X, Info } from 'lucide-react-native';

const ApplyTeamProjectPositionDialog = ({ visible, onClose, projectTitle, onSend }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        setLoading(true);
        await onSend(message); // Your Convex Mutation here
        setLoading(false);
        setMessage('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.dialogCard}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.title}>Send Request</Text>
                                <Text style={styles.subtitle}>Joining: {projectTitle}</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <X size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        {/* Input Section */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>Introduction Message</Text>
                                <Text style={styles.charCount}>{message.length}/250</Text>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Hi! I'd love to contribute because..."
                                placeholderTextColor="#94a3b8"
                                multiline
                                numberOfLines={4}
                                maxLength={250}
                                value={message}
                                onChangeText={setMessage}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Helpful Hint */}
                        <View style={styles.hintBox}>
                            <Info size={14} color="#aaa" />
                            <Text style={styles.hintText}>
                                Briefly mention your skills or why you're interested.
                            </Text>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={onClose}
                                disabled={loading}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.sendBtn,
                                    (!message.trim() || loading) && styles.disabledBtn
                                ]}
                                onPress={handleSend}
                                disabled={!message.trim() || loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <Text style={styles.sendText}>Send Request</Text>
                                        <Send size={16} color="black" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        alignItems: 'center',
    },
    dialogCard: {
        width: '100%',
        backgroundColor: '#121214',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: 'white',
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    inputWrapper: {
        marginBottom: 12,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#aaa',
    },
    charCount: {
        fontSize: 11,
        color: '#aaa',
    },
    input: {
        backgroundColor: '#1e1e22',
        borderWidth: 1,
        borderColor: '#2D2D2D',
        borderRadius: 12,
        padding: 12,
        height: 120,
        fontSize: 15,
        color: 'white',
    },
    hintBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e22',
        padding: 10,
        borderRadius: 8,
        gap: 8,
        marginBottom: 24,
    },
    hintText: {
        fontSize: 12,
        color: '#aaa',
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelText: {
        color: '#64748b',
        fontWeight: '600',
    },
    sendBtn: {
        flex: 2,
        backgroundColor: 'white',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
    },
    disabledBtn: {
        backgroundColor: '#cbd5e1',
    },
    sendText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default ApplyTeamProjectPositionDialog;