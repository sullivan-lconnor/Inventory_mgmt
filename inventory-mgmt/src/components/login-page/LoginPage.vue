<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="pa-4">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="loginDetails.user_id"
                label="User ID"
                required
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field
                v-model="loginDetails.password"
                label="Password"
                type="password"
                required
                :rules="[rules.required]"
              ></v-text-field>
              <v-btn color="primary" @click="submitLogin" :disabled="!valid">Login</v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useAuthStore } from '@/stores/authStore'; // Adjust the path as necessary

  export default {
    data() {
      return {
        valid: false,
        loginDetails: {
          user_id: '',
          password: '',
        },
        rules: {
          required: value => !!value || 'Required.',
        },
      };
    },
    methods: {
      async submitLogin() {
        if (this.$refs.form.validate()) {
          // Here you'd typically make an HTTP request to your authentication endpoint
          // For now, let's just log the credentials
          console.log('Submitting', this.loginDetails);
          const authStore = useAuthStore();

          // Example of making a request to your server (adjust URL as needed)
          try {
            const response = await fetch('/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(this.loginDetails),
            });
  
            if (!response.ok) throw new Error('Login failed');
  
            const data = await response.json();
            console.log('Login successful', data);
  
            // Update the authStore with the token and userID
            authStore.loginUser(data.userId, { token: data.token });

            // Optionally, emit an event if you want to notify the parent component
            this.$emit('login-success');
          } catch (error) {
            console.error('Login error', error);
            // Handle login error (e.g., show an error message)
          }
        }
      },
    },
  };
  </script>
  