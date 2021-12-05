<template>
  <div>
    <el-drawer
      title="Create"
      direction="rtl"
      size="50%"
      :before-close="handleItemCreateClose"
      :visible.sync="itemCreateShow"
    >
      <div style="padding: 10px 15px">
        <el-form ref="form" :model="createItemForm" label-position="top">
          <el-form-item label="key">
            <el-input v-model="createItemForm.key" />
          </el-form-item>
          <el-form-item label="value">
            <el-input
              v-model="createItemForm.value"
              autosize
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="comment">
            <el-input
              v-model="createItemForm.comment"
              autosize
              type="textarea"
            />
          </el-form-item>
          <el-form-item v-if="clusters" label="cluster : env - clusterName" prop="type">
            <el-checkbox-group v-model="createItemForm.clusters">
              <el-checkbox
                v-for="cluster in clusters"
                :key="cluster.env + '|' + cluster.name"
                style="display:block;"
                :label="cluster"
                name="type"
              >
                {{ cluster.env }} - {{ cluster.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleItemCreate">Add</el-button>
            <el-button>cancel</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { create } from '@/api/item'

export default {
  name: 'ItemCreate',
  components: { },
  props: {
    appId: {
      required: true,
      type: String,
      default: ''
    },
    namespaceName: {
      required: true,
      type: String,
      default: ''
    }

  },
  data() {
    return {
      content: '',
      createItemForm: {
        'key': '',
        'value': '',
        'comment': '',
        clusters: []
      }
    }
  },
  computed: {
    ...mapState({
      clusters: state => state.envs.clusters,
      namespaces: state => state.namespace.data,
      itemCreateShow: state => state.item.itemCreateShow
    })
  },
  watch: {
  },
  created() {
    this.refreshData()
  },
  methods: {
    refreshData() {
      if (this.clusters.length === 0) {
        this.$store.dispatch('envs/refreshEnvData', { appId: this.appId })
      }
    },
    handleItemCreateClose() {
      this.closeDrawer()
    },
    handleItemCreate() {
      var baseItemData = {
        addItemBtnDisabled: true,
        tableViewOperType: 'create',
        key: this.createItemForm.key,
        value: this.createItemForm.value,
        comment: this.createItemForm.comment
      }
      this.createItemForm.clusters.forEach((cluster) => {
        create({
          data: baseItemData,
          pathData: {
            appId: this.appId,
            env: cluster.env,
            cluster: cluster.name,
            namespaceName: this.namespaceName
          }
        }).then((res) => {
          this.closeDrawer()
          if (res.status === 200) {
            this.$message({
              message: 'create success',
              type: 'success'
            })
            this.$emit('createSuccess')
          }
        })
      })
    },
    closeDrawer() {
      this.$store.dispatch('item/commitItemCreateShow', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.header-tag{
  margin:0px 10px;
}
</style>
