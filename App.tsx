import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Alert,
  SafeAreaView,
  StatusBar,
  ListRenderItem,
  Modal,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';

// import * as ImagePicker from 'expo-image-picker';

// Types
interface BlockedNumber {
  id: string;
  number: string;
  date: string;
  caller?: string;
  type: 'spam' | 'telemarketer' | 'scam' | 'unknown';
}

interface BlockedNumberCardProps {
  count: number;
  todayCount: number;
}

interface NumberListItemProps {
  item: BlockedNumber;
}

interface ActionButtonProps {
  running: boolean;
  onPress: () => void;
}

// Mock Data
const BLOCKED_NUMBERS: BlockedNumber[] = [
  {
    id: '1',
    number: '+1 (234) 567-8901',
    date: '2024-12-20',
    caller: 'Suspected Telemarketer',
    type: 'telemarketer'
  },
  {
    id: '2',
    number: '+1 (345) 678-9012',
    date: '2024-12-20',
    caller: 'Spam Caller',
    type: 'spam'
  },
  {
    id: '3',
    number: '+1 (456) 789-0123',
    date: '2024-12-19',
    caller: 'Potential Scammer',
    type: 'scam'
  },
  {
    id: '4',
    number: '+1 (567) 890-1234',
    date: '2024-12-19',
    type: 'unknown'
  },
  {
    id: '5',
    number: '+1 (678) 901-2345',
    date: '2024-12-18',
    caller: 'Telemarketing Company',
    type: 'telemarketer'
  },
  {
    id: '6',
    number: '+1 (789) 012-3456',
    date: '2024-12-18',
    type: 'spam'
  },
  {
    id: '7',
    number: '+1 (890) 123-4567',
    date: '2024-12-17',
    caller: 'Known Scammer',
    type: 'scam'
  },
  {
    id: '8',
    number: '+1 (901) 234-5678',
    date: '2024-12-17',
    type: 'unknown',
  },
];

const BlockedNumberCard: React.FC<BlockedNumberCardProps> = ({ count, todayCount }) =>{
  const [modalVisible, setModalVisible] = useState(false);
  return  (
  <View style={styles.card}>
    <View style={styles.cardContent}>

      <View style={styles.cardHeader}>
        <View>
        <Text style={styles.cardTitle}>Call Blocker</Text>
        </View>
        <TouchableOpacity style={styles.helpButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.helpButtonText}>Get Verified</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity> */}
      </View>
      <Text style={styles.cardSubtitle}>Protecting you from unwanted calls</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{count}</Text>
          <Text style={styles.statLabel}>Total Blocked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{todayCount}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
      </View>
    </View>
    <UnblockRequestForm 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
  </View>
)};


const getTypeColor = (type: BlockedNumber['type']): string => {
  switch (type) {
    case 'spam': return '#FFE4E1';
    case 'telemarketer': return '#E6F3FF';
    case 'scam': return '#FFE4E4';
    default: return '#F0F0F0';
  }
};

const getTypeLabel = (type: BlockedNumber['type']): string => {
  switch (type) {
    case 'spam': return '🚫 Spam';
    case 'telemarketer': return '📞 Telemarketer';
    case 'scam': return '⚠️ Scam';
    default: return '❓ Unknown';
  }
};

const NumberListItem: React.FC<NumberListItemProps> = ({ item }) => (
  <View style={[styles.numberItem, { backgroundColor: getTypeColor(item.type) }]}>
    <View style={styles.numberContent}>
      <Text style={styles.numberText}>{item.number}</Text>
      <Text style={styles.callerName}>{item.caller || 'Unknown Caller'}</Text>
      <View style={styles.numberFooter}>
        <Text style={styles.typeLabel}>{getTypeLabel(item.type)}</Text>
        <Text style={styles.blockDate}>Blocked on {new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </View>
  </View>
);

const ActionButton: React.FC<ActionButtonProps> = ({ running, onPress }) => (
  <TouchableOpacity
    style={[styles.button, running ? styles.stopButton : styles.startButton]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.buttonContent}>
      <Text style={styles.buttonIcon}>{running ? '🛑' : '🛡️'}</Text>
      <Text style={styles.buttonText}>
        {running ? 'Stop Protection' : 'Start Protection'}
      </Text>
    </View>
  </TouchableOpacity>
);

const App: React.FC = () => {
  const [serviceRunning, setServiceRunning] = useState<boolean>(false);
  const todayCount = BLOCKED_NUMBERS.filter(
    num => num.date === new Date().toISOString().split('T')[0]
  ).length;

  const handleServiceToggle = () => {
    const newState = !serviceRunning;
    setServiceRunning(newState);

    Alert.alert(
      newState ? 'Protection Activated' : 'Protection Deactivated',
      newState
        ? 'Call blocking service is now protecting your device from spam calls.'
        : 'Call blocking service has been temporarily disabled.',
      [{ text: 'OK' }]
    );
  };

  const renderItem: ListRenderItem<BlockedNumber> = ({ item }) => (
    <NumberListItem item={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <BlockedNumberCard
        count={BLOCKED_NUMBERS.length}
        todayCount={todayCount}
      />

      <View style={styles.listContainer}>
        <Text style={styles.listHeader}>Blocked Call History</Text>
        <FlatList
          data={BLOCKED_NUMBERS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <View style={styles.buttonContainer}>
        <ActionButton
          running={serviceRunning}
          onPress={handleServiceToggle}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardContent: {
    gap: 20,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666666',
  },

  helpButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  helpButtonText: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  numberItem: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  numberContent: {
    padding: 16,
  },
  numberText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  callerName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  numberFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  blockDate: {
    fontSize: 12,
    color: '#888888',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  button: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonIcon: {
    fontSize: 20,
  },
  startButton: {
    backgroundColor: '#34C759',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666666',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


interface FormModalProps {
  visible: boolean;
  onClose: () => void;
}

interface UnblockRequest {
  phoneNumber: string;
  callerName: string;
  reason: string;
  photo?: string;
  document?: string;
}
const UnblockRequestForm: React.FC<FormModalProps> = ({ visible, onClose }) => {
  const [formData, setFormData] = useState<UnblockRequest>({
    phoneNumber: '',
    callerName: '',
    reason: '',
  });
  const [photo, setPhoto] = useState<string>('');
  const [document, setDocument] = useState<string>('');

  const handleImagePick = async (type: 'photo' | 'document') => {
    // const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    // if (permissionResult.granted === false) {
    //   Alert.alert('Permission Required', 'Please allow access to your photo library to upload images.');
    //   return;
    // }

    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 1,
    // });

    // if (!result.canceled) {
    //   if (type === 'photo') {
    //     setPhoto(result.assets[0].uri);
    //   } else {
    //     setDocument(result.assets[0].uri);
    //   }
    // }
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', { ...formData, photo, document });
    Alert.alert(
      'Request Submitted',
      'Your unblock request has been submitted successfully. We will review it shortly.',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}> Get Verification Badge</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={formData.callerName}
                onChangeText={(text) => setFormData({ ...formData, callerName: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Type message"
                value={formData.reason}
                onChangeText={(text) => setFormData({ ...formData, reason: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Photo</Text>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => handleImagePick('photo')}
              >
                <Text style={styles.uploadButtonText}>
                  {photo ? 'Change Photo' : 'Upload Photo'}
                </Text>
              </TouchableOpacity>
              {photo && (
                <Image source={{ uri: photo }} style={styles.previewImage} />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Identity Document</Text>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => handleImagePick('document')}
              >
                <Text style={styles.uploadButtonText}>
                  {document ? 'Change Document' : 'Upload Document'}
                </Text>
              </TouchableOpacity>
              {document && (
                <Image source={{ uri: document }} style={styles.previewImage} />
              )}
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
export default App;
