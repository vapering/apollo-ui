<template>
  <div class="clearfix clear">
    <property-editor ref="PropertyEditor" v-model="content" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PropertyEditor from '@/components/PropertyEditor'

export default {
  name: 'ItemsInText',
  components: { PropertyEditor },
  props: {
    namespace: {
      required: true,
      validator: function(value) {
        return !(
          value === null || value === undefined
        )
      }
    }
  },
  data() {
    return {
      content: ''
    }
  },
  computed: {
    ...mapState({
      namespaces: state => state.namespace.data
    })
  },
  watch: {
    namespace: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        var body = ''
        if (newVal) {
          if (newVal.items) {
            newVal.items.forEach(item => {
              body = body + item.item.key + ' = ' + item.item.value + '\n'
            })
          }
        }
        this.content = body
      }
    }
  },
  created() {
    // this.refreshData()
  },
  methods: {
    test() {
      this.content
    }
  }
}
</script>

<style lang="scss" scoped>
.header-tag{
  margin:0px 10px;
}
</style>
