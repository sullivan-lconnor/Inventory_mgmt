<template>
  <div class="request-item-widget">
    <v-card class="pa-5">
      <v-card-title class="text-h5">Request Item</v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-select
          label="Search By"
          v-model="searchColumn"
          :items="['uuid']"
          outlined
          dense
        ></v-select>
        <v-text-field
          label="Search Query"
          v-model="searchQuery"
          outlined
          dense
        ></v-text-field>
        <v-btn color="primary" class="mt-3" type="submit">Submit</v-btn>
      </v-form>

      <!-- Table to display search results -->
      <v-simple-table v-if="items.length">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">UUID</th>
              <th class="text-left">Name</th> <!-- Added Name column -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.uuid">
              <td>{{ item.uuid }}</td>
              <!-- Make Name a hyperlink -->
              <td><a :href="`/mainpage-item/${item.uuid}`">{{ item.name }}</a></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // Adjust the path as necessary

export default {
  name: 'SearchUtility',
  data() {
    return {
      searchColumn: 'uuid',
      searchQuery: '',
      items: [],
    };
  },
  methods: {
    onSubmit() {
      const authStore = useAuthStore(); // Use the auth store
      const config = {
        headers: {
          // Include the token in the request headers
          Authorization: `Bearer ${authStore.token}`
        }
      };

      axios.get(`/api/requests/search?column=${this.searchColumn}&query=${this.searchQuery}`, config)
        .then(response => {
          this.items = response.data;
        })
        .catch(error => {
          console.error('Error retrieving items:', error);
          this.items = [];
        });
    },
  },
};
</script>