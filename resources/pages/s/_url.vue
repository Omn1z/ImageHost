<template>
  <el-image
    class="image_out"
    :fit="'cover'"
    :src="imageInfo.url">
  </el-image>
</template>

<script lang="ts">
import Vue from 'vue'


export default Vue.extend({
  data() {
    return {
      imageInfo : {
        url : `${this.$axios.defaults.baseURL}storage/s/${this.$route.params.url}`
      }
    }
  },
  created() {
  },
  methods: {
    navigate(path: string) {
      this.$router.replace({ path: path })
    },
  },
})
</script>
<style>
.image_out {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: 1s appear;
}
@keyframes appear {
  0% {
    opacity: 0;
  }
}
</style>

