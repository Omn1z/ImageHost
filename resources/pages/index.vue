<template>
  <el-row>
    <el-col :span="24">
      <el-col :span="6"><div class="empty"></div></el-col>
      <el-col :span="12">

        <el-carousel class="animation_in" v-if="this.cItems.length" :interval="4000" type="card" height="300px" style="margin: 5vh 0 0;">
          <el-carousel-item v-for="item in cItems" :key="item.url">
            <el-image
              style="width: 100%; height: 100%;"
              :fit="'cover'"
              :src="item.url">
            </el-image>
          </el-carousel-item>
        </el-carousel>

        <el-row>
          <el-col :span="4"><div class="empty"></div></el-col>
          <el-col :span="16">
            <div v-if="!this.cItems.length" style="margin: 20vh 0 0;"></div>
            <div class="welcome animation_in">
              <div class="welcome__container">
                <p class="welcome__title">Хостинг изображений</p>
                <el-upload
                  v-loading="loading > 0"
                  class="welcome__upload"
                  drag
                  action=""
                  :on-preview="handlePreview"
                  :before-remove="handleRemove"
                  :before-upload="handleUpload"
                  list-type="picture"
                  multiple
                  >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                </el-upload>
              </div>
            </div>
          </el-col>
          <el-col :span="4"><div class="empty"></div></el-col>
        </el-row>
      </el-col>
      <el-col :span="6"><div class="empty"></div></el-col>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import Vue from 'vue'
import copy from 'copy-to-clipboard'

export default Vue.extend({
  data() {
    return {
      cItems: [],
      loading: 0,
      n : 0,
      urls : new Map()
    }
  },
  beforeCreate() {
    this.$axios.get('api/last_images').then(response => {
        response.data.forEach(item => {
          item.url = `${this.$axios.defaults.baseURL}storage/s/${item.url}`
        })
        this.cItems = response.data
    })
  },
  methods : {
    async handleUpload(file: any): Promise<boolean> {
      this.loading++

      let bodyFormData = new FormData()

      bodyFormData.append('image', file)

      const response = await this.$axios({
        method: 'post',
        url: 'api/upload',
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      this.$notify({
        title: response.data.status === 400 ? 'Ошибка' : 'Успешно',
        message: response.data.msg,
        type: response.data.status === 400 ? 'error' : 'success'
      });

      this.loading--

      if(response.data.status !== 400) {
        file.url = response.data.url
      }

      return response.data.status !== 400
    },
    handlePreview(file: any) {
      console.log(file)

      let routeData = this.$router.resolve({path: `s/${file.raw.url}` });

      copy(this.$axios.defaults.baseURL + `s/${file.raw.url}`)

      this.$message({
        dangerouslyUseHTMLString: true,
        message: `<a style="text-decoration: none; color: inherit" target="_blank" href="${routeData.href}">Ссылка на ${file.raw.name} скопирована успешно.</a>`,
        type: 'success'
      });
    },
    async handleRemove(file: any, fileList: any): Promise<boolean> {
      this.loading++

      const response = await this.$axios({
        method: 'post',
        url: 'api/remove_using_url',
        data: {
          url: file.raw.url
        }
      });

      this.loading--

      this.$notify({
        title: response.data.status === 400 ? 'Ошибка' : 'Успешно',
        message: response.data.status === 400 ? 'response.data.msg' : `Файл ${file.name} удален`,
        type: response.data.status === 400 ? 'error' : 'success'
      });

      return response.data.status !== 400
    },
  },
})
</script>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
