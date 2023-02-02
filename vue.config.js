const { defineConfig } = require('@vue/cli-service')
let proxyObj={}
proxyObj['/']={
  ws:false,
  target:'http://localhost:8080',
  changeOrigin:true,
  PathReWrite:{
    '^/':'/'
  }
}
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    host:'localhost',
    port:9000,
    proxy:proxyObj
  }
})
