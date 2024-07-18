<script setup>
import { onMounted, ref } from 'vue';
import { getWords } from '@/api/publicApi';

const windowWidth = ref(window.innerWidth - 40);
const windowHeight = ref(window.innerHeight - 100);

const loading = ref(false);

const maxFontSize = 100;
const minFontSize = 10
const lastUsedFontSize = ref(0);
const fontSizeStep = 1.8;

const useFontColors = ref(true);

const words = ref([]);

const canvas = ref(document.getElementById('theCanvas'));
let ctx = null;

/**
 * Get words from the backend and set them to the words array.
 */
async function getWordsFromBackend() {
  try {
    loading.value = true;
    const response = await getWords();
    words.value = response.data.data;
  } catch (error) {
    words.value = [];
  } finally {
    loading.value = false;
  }
}

// Function to get random integer between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Draw words from the words array on the canvas.
 */
async function drawWords() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  words.value.forEach((word, i) => {
    let fontSize = 0;
    if (i === 0) {
      fontSize = maxFontSize;
    } else {
      fontSize = lastUsedFontSize.value - fontSizeStep;
    }
    // Decrease font size for next word
    lastUsedFontSize.value = fontSize;

    // Fail safe if attributes have changed
    if (fontSize < minFontSize) {
      fontSize = minFontSize;
    }

    ctx.font = `${fontSize}px Arial`;
    const x = getRandomInt(0, windowWidth.value - fontSize);
    const y = getRandomInt(0, windowHeight.value - fontSize);
    ctx.fillStyle = getWordColor();

    // Finally draw to canvas
    ctx.fillText(word.word, x, y);
  });
}

function getWordColor() {
  if (useFontColors.value) {
    const r = getRandomInt(0, 255);
    const g = getRandomInt(0, 255);
    const b = getRandomInt(0, 255);
    return `rgb(${r}, ${g}, ${b})`;
  }

  return 'black';
}

onMounted(async () => {
  ctx = canvas.value.getContext('2d');
  await getWordsFromBackend();
  drawWords();
});

</script>

<template>
  <v-container fluid class="canvas-container">
    <v-row>
      <v-col>
        <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
        <div class="canvas-scroll">
          <canvas ref="canvas" id="theCanvas" :width="windowWidth" :height="windowHeight" class="overflow-y"></canvas>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>



<style>
.canvas-scroll {
  width: 100%;
  height: 100vh;
  overflow: auto;
}

canvas {
  border: 1px solid black;
  display: block;
}
</style>
