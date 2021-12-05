# Apollo-ui-vue-element

> Another web ui for Apollo  
> Base on [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) & [Apollo](https://github.com/apolloconfig/apollo)

# Develop
## config
`vi vue.config.js`  
example:
```
    proxy: {
      '/api/': {
        'target': 'http://localhost:8070',
        'pathRewrite': {
          '^/api': ''
        },
        'changeOrigin': true
      }
    }
```
`http://localhost:8070` is Apollo portal base url
## run 
`npp run dev`

# build
`npm run build:prod`  

Back up `apollo-portal\src\main\resources\static` to `apollo-portal\src\main\resources\static.backup`  
copy files in `dist` directory to apollo portal static `apollo-portal\src\main\resources\static\`  

start apllo-portal as normal.
# feature
- create app
- search namespace
- manage config item in namepspace

