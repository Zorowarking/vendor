import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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
    vehicleType: 'Bike',
    vehicleNumber: '',
    vehicleDoc: null,
    workingZone: '',
  });
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
              <Text style={styles.label}>Vehicle Type *</Text>
              <View style={styles.selectorContainer}>
                {['Bike', 'Car', 'Bicycle', 'On Foot'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.selectorItem, formData.vehicleType === type && styles.selectorItemSelected]}
                    onPress={() => handleInputChange('vehicleType', type)}
                  >
                    <Text style={[styles.selectorText, formData.vehicleType === type && styles.selectorTextSelected]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
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
              <TextInput
                style={styles.input}
                placeholder="e.g. Mumbai Suburban"
                value={formData.workingZone}
                onChangeText={(text) => handleInputChange('workingZone', text)}
              />
            </View>

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
});
