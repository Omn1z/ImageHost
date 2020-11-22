import path from 'path'
import { NuxtConfig } from '@nuxt/types'
import webpack from 'webpack'

const nuxtConfig : NuxtConfig = {
  ssr: true,
  telemetry: true,
  srcDir: path.resolve(__dirname, '..', 'resources'),
  dev: process.env.NODE_ENV === 'development',
  head: {
    title: 'Хостинг изображений',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['element-ui/lib/theme-chalk/index.css', '@/assets/scss/app.scss'],
  plugins: ['@/plugins/element-ui'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,
  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: ['@nuxt/typescript-build'],
  modules: ['@nuxtjs/axios'],
  axios: {
    credentials: true,
    common: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  },
  build: {
    transpile: [/^element-ui/],
    extend: (config: webpack.Configuration): void => {
      if (config.module) {
        config.module.rules.push({
          test: /.scss$/,
          use: 'webpack-import-glob-loader'
        })
      }
    }
  },
  typescript: {
    typeCheck: null
  }
}

export default nuxtConfig
