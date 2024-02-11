<template>
    <v-card flat class="pa-2">
      <v-row align="center" no-gutters>
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedSearchOption"
            :items="searchOptions"
            item-text="text" 
            item-value="value"
            label="Search by"
            dense
            solo
            hide-details
          ></v-select>
        </v-col>
  
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            label="Search"
            dense
            solo
            hide-details
            append-icon="mdi-magnify"
            @click:append="submitSearch"
            @keyup.enter="submitSearch"
          ></v-text-field>
        </v-col>
  
        <v-col cols="12" md="2">
          <v-btn color="primary" @click="submitSearch">Search</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'SearchBar',
    data() {
      return {
        searchQuery: '',
        selectedSearchOption: 'uuid', // Set the default selection to 'uuid'
        searchOptions: [
          { text: 'UUID', value: 'uuid' },
          // Add more options here as needed
        ],
      };
    },
    methods: {
      submitSearch() {
        if (this.selectedSearchOption === 'uuid' && this.searchQuery) {
          this.$router.push({ path: `/mainpage-item/${this.searchQuery}` }).catch(err => {
            if (err.name !== 'NavigationDuplicated') {
              // Handle error if it's not a NavigationDuplicated error
              throw err;
            }
          });
        } else {
          // Handle other search options or show an error/alert message
          console.log("Search option is not UUID or search query is empty");
        }
      },
    },
  };
  </script>
  