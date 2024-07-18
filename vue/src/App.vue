<script setup>
import { ref } from 'vue';
import Canvas from '@/components/Canvas.vue';
import About from '@/components/About.vue';

function clickAbout() {
  aboutDialog.value = true;
}
const aboutDialog = ref(false);
</script>

<template>
  <v-app>
    <v-app-bar density="compact" elevation=1>
      <v-app-bar-title>sanajuttu</v-app-bar-title>

      <template v-slot:append>
        <v-btn class="mr-2" @click="clickAbout()">Lisätietoa</v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <Canvas />

      <v-dialog v-model="aboutDialog" max-width="400">
        <v-card>
          <About />

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="aboutDialog = false">Sulje</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>
