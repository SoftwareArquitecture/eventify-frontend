<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import profileService from '../services/profile.service.js';
import { profile as ProfileEntity } from '../model/profile.entity.js';

const props = defineProps({
  profileId: {
    type: [Number, String],
    required: true
  }
});
const profile = ref(null);
const loading = ref(false);
const error = ref('');

/**
 * Adapter: Converts backend response to frontend model
 */
function adaptProfile(response) {
  // Split fullName if available
  let name = '';
  let lastName = '';
  if (response.fullName) {
    const parts = response.fullName.split(' ');
    name = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }
  return {
    id: response.id,
    name,
    lastName,
    title: response.role || '',
    email: response.email || '',
    phone: response.phoneNumber || '',
    location: response.streetAddress || ''
  };
}

/**
 * Fetches profile from backend and adapts it to the frontend model
 */
async function fetchProfile() {
  loading.value = true;
  error.value = '';
  try {
    const response = await profileService.getProfileById(props.profileId);
    profile.value = ProfileEntity.fromJSON(adaptProfile(response));
  } catch (err) {
    error.value = 'Error loading profile';
  } finally {
    loading.value = false;
  }
}

// Computed properties for template bindings
const name = computed(() => profile.value ? profile.value.fullName : '');
const title = computed(() => profile.value ? profile.value.title : '');
const email = computed(() => profile.value ? profile.value.email : '');
const phone = computed(() => profile.value ? profile.value.phone : '');
const location = computed(() => profile.value ? profile.value.location : '');

onMounted(fetchProfile);
// Load profile when component is mounted or when the id changes
watch(
    () => props.profileId,
    () => {
      if (props.profileId !== undefined && props.profileId !== null) {
        fetchProfile();
      }
    },
    { immediate: true }
);
</script>
<template>
  <div class="profile-info-container">
    <div class="profile-header">
      <h2 class="profile-name">{{ name }}</h2>
      <p class="profile-title">{{ title }}</p>
    </div>

    <div class="centered-content">
      <div class="contact-section">
        <h3 class="section-title">{{ $t('profile.contactInformation') }}</h3>

        <div class="contact-grid">
          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.emailAddress') }}</div>
            <div class="contact-value">{{ email }}</div>
          </div>

          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.phoneNumber') }}</div>
            <div class="contact-value">{{ phone }}</div>
          </div>

          <div class="contact-row">
            <div class="contact-label">{{ $t('profile.location') }}</div>
            <div class="contact-value">{{ location }}</div>
          </div>
        </div>
      </div>

      <div v-if="error" style="color:red; margin-top:1rem; text-align:center;">{{ error }}</div>
      <div v-if="loading" style="margin-top:1rem; text-align:center;">{{ $t('common.loading') }}</div>
    </div>
  </div>
</template>
<style scoped>
.profile-info-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.05);
  padding: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header section with name */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 15px 0 5px 0;
  text-align: center;
}

.profile-title {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
  text-align: center;
}

/* Central container with limited width */
.centered-content {
  max-width: 600px;
  width: 100%;
}

/* Contact information section */
.section-title {
  text-align: left;
  font-size: 18px;
  color: #333;
  margin: 0 0 20px 0;
  font-weight: 600;
  border-bottom: none;
}

.contact-grid {
  text-align: left;
  margin-bottom: 30px;
}

.contact-row {
  display: flex;
  margin-bottom: 15px;
}

.contact-label {
  min-width: 130px;
  font-weight: 500;
  color: #666;
}

.contact-value {
  color: #333;
}


/* Responsive */
@media (max-width: 768px) {
  .centered-content {
    max-width: 100%;
  }

  .contact-row {
    flex-direction: column;
  }

  .contact-label {
    margin-bottom: 5px;
  }
}
</style>
