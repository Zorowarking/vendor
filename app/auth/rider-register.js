import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useAuthStore } from '../../store/authStore';

export default function RiderRegisterScreen() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: user?.phoneNumber || '',
    email: user?.email || '',
    profilePhoto: null,
    vehicleNumber: '',
    vehicleDoc: null,
    workingZone: '',
  });
  const [isZoneModalVisible, setIsZoneModalVisible] = useState(false);
  const [zoneSearchQuery, setZoneSearchQuery] = useState('');
  
  const router = useRouter();

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, profilePhoto: result.assets[0].uri });
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      if (!result.canceled) {
        setFormData({ ...formData, vehicleDoc: result.assets[0] });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleNext = () => {
    if (!formData.fullName || !formData.vehicleNumber || !formData.workingZone || !formData.profilePhoto) {
      Alert.alert('Required Fields', 'Full Name, Vehicle Number, Working Zone, and Profile Photo are mandatory.');
      return;
    }
    router.push({ pathname: '/auth/rider-bank', params: { ...formData } });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Partner Details</Text>
            <Text style={styles.subtitle}>Let's get you on the road</Text>
          </View>

          <View style={styles.form}>
            <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
              {formData.profilePhoto ? (
                <Image source={{ uri: formData.profilePhoto }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>Upload Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Name as per driving license"
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Phone (Locked)</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={formData.phone}
                  editable={false}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Email (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                />
              </View>
            </View>


            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. MH 12 AB 1234"
                autoCapitalize="characters"
                value={formData.vehicleNumber}
                onChangeText={(text) => handleInputChange('vehicleNumber', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Registration Document *</Text>
              <TouchableOpacity 
                style={[styles.docButton, formData.vehicleDoc && styles.docSelected]} 
                onPress={pickDocument}
              >
                <Text style={[styles.docButtonText, formData.vehicleDoc && styles.docSelectedText]}>
                  {formData.vehicleDoc ? `File: ${formData.vehicleDoc.name}` : 'Upload RC / Insurance'}
                </Text>
              </TouchableOpacity>
            </View>


            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Working Zone *</Text>
              
              {/* Dropdown Trigger */}
              <TouchableOpacity 
                style={[styles.dropdownTrigger, formData.workingZone && styles.dropdownTriggerSelected]} 
                onPress={() => setIsZoneModalVisible(true)}
              >
                <View style={styles.dropdownLeft}>
                  <Text style={[styles.dropdownText, !formData.workingZone && styles.dropdownPlaceholder]}>
                    {formData.workingZone || 'Select your working city'}
                  </Text>
                </View>
                <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/271/271210.png' }} 
                  style={styles.dropdownChevron} 
                />
              </TouchableOpacity>
            </View>

            {/* Selection Modal */}
            <Modal
              visible={isZoneModalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setIsZoneModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Choose your city</Text>
                    <TouchableOpacity onPress={() => setIsZoneModalVisible(false)}>
                      <Text style={styles.closeButtonText}>Done</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.searchContainer}>
                    <Image 
                      source={{ uri: 'https://cdn-icons-png.flaticon.com/512/482/482631.png' }} 
                      style={styles.searchIcon} 
                    />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Find your city..."
                      value={zoneSearchQuery}
                      onChangeText={setZoneSearchQuery}
                    />
                  </View>

                  <Text style={styles.localeHint}>
                    Tap into your present locale: <Text style={styles.localeStrong}>Hyderabad</Text>
                  </Text>

                  <FlatList
                    data={['Hyderabad'].filter(city => city.toLowerCase().includes(zoneSearchQuery.toLowerCase()))}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={styles.cityItem}
                        onPress={() => {
                          handleInputChange('workingZone', item);
                          setIsZoneModalVisible(false);
                        }}
                      >
                        <View style={styles.cityItemLeft}>
                          <Text style={styles.cityItemName}>{item}</Text>
                        </View>
                        {formData.workingZone === item && (
                          <Image 
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' }} 
                            style={styles.checkIcon} 
                          />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>

            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                useAuthStore.getState().setRole(null);
                router.replace('/auth/role-select');
              }}
            >
              <Text style={styles.backButtonText}>← Change Role</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subText,
  },
  form: {
    marginBottom: 20,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: Colors.subText,
    textAlign: 'center',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: Colors.black,
  },
  disabledInput: {
    backgroundColor: Colors.grey,
    color: Colors.darkGrey,
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  selectorItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF0E0',
  },
  selectorText: {
    fontSize: 13,
    color: Colors.black,
  },
  selectorTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  docButton: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.grey,
  },
  docButtonText: {
    color: Colors.subText,
    fontSize: 14,
  },
  docSelected: {
    borderColor: Colors.success,
    backgroundColor: '#E8F5E9',
  },
  docSelectedText: {
    color: Colors.success,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  // Custom Dropdown Styles
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: Colors.white,
  },
  dropdownTriggerSelected: {
    borderColor: Colors.primary,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownCityIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  dropdownPlaceholder: {
    color: Colors.subText,
  },
  dropdownChevron: {
    width: 14,
    height: 14,
    tintColor: Colors.darkGrey,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeButtonText: {
    color: Colors.info,
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: Colors.darkGrey,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.black,
  },
  localeHint: {
    fontSize: 13,
    color: Colors.subText,
    marginBottom: 20,
  },
  localeStrong: {
    color: Colors.info,
    fontWeight: 'bold',
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  cityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityIcon: {
    width: 28,
    height: 28,
    marginRight: 16,
  },
  cityItemName: {
    fontSize: 16,
    color: Colors.black,
  },
  checkIcon: {
    width: 18,
    height: 18,
    tintColor: Colors.info,
  },
});
