<template>
  <el-row :gutter="32" style="padding: 10px;">
    <el-col :xs="24" :sm="8" :lg="6" style="">
      <el-form :model="form" label-position="top">
        <el-form-item style="padding: 0px 10px">
          AppId: {{ this.$route.params.appid }}
        </el-form-item>
        <el-form-item label="env">
          <el-select v-model="form.env" style="display: block;" placeholder="env" @change="handleEnvSelect">
            <el-option v-for="name in envs" :key="name" :label="name" :value="name" />
          </el-select>
        </el-form-item>
        <el-form-item label="cluster">
          <el-select v-model="form.cluster" style="display: block;" placeholder="cluster" @change="handleClusterSelect">
            <el-option v-for="cluster in clusters" :key="cluster.name" :label="cluster.name" :value="cluster.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="namespace">
          <el-select
            v-model="form.namespace"
            style="display: block;"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="namespace"
            :remote-method="handleNamespaceQuery"
            :loading="namespaceLoading"
            @change="handleNamespaceChange"
          >
            <el-option
              v-for="item in namespacesQueryResult"
              :key="item.baseInfo.namespaceName"
              :label="item.baseInfo.namespaceName"
              :value="item.baseInfo.namespaceName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLoadNamespace">load namespace</el-button>
        </el-form-item>

      </el-form>
    </el-col>
    <el-col v-if="namespaceDetailDisplay" :xs="24" :sm="16" :lg="18" style="">
      <el-table :data="namespacesSelect" stripe style="width: 100%">
        <el-table-column
          label="manage"
        >
          <template slot-scope="scope">
            <el-button type="text" size="big" @click="handleNamespaceOpen(scope.row)">
              <i class="el-icon-setting" /> manage</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="baseInfo.id" label="namespace id" />
        <el-table-column prop="baseInfo.namespaceName" label="namespace name" />
        <el-table-column prop="format" label="format" />
        <el-table-column prop="isPublic" label="isPublic">>
          <template slot-scope="scope">
            <span v-if="scope.row.isPublic">public</span>
            <span v-else>private</span>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="comment" />
        <el-table-column prop="items.length" label="items" />
      </el-table>

      <NamespaceTable
        v-if="namespaceItemEditShow"
        :namespace="namespaceItemEdit"
        :env="form.env"
        :show="namespaceItemEditShow"
        :handle-close-event="(value)=>{namespaceItemEditShow=value;namespaceItemEdit={}}"
      />
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'
import NamespaceTable from '@/views/cluster/namespaceTable'

export default {
  name: 'Cluster',
  components: { NamespaceTable },
  data() {
    return {
      namespaceLoading: false,
      namespacesQueryResult: [],
      namespacesSelect: [],
      namespaceDetailDisplay: false,
      namespaceItemEditShow: false,
      namespaceItemEdit: {},
      clusters: [],
      form: {
        env: '',
        cluster: '',
        namespace: []
      }
    }
  },
  computed: {
    ...mapState({
      currentApplication: state => state.application.currentApplication,
      organizations: state => state.organizations.data,
      apUsers: state => state.apUsers.data,
      envs: state => state.envs.data,
      envData: state => state.envs.envData,
      namespaces: state => state.namespace.data
    })
  },
  created() {
    this.refreshEnvs()
    this.refreshEnvData()
  },
  methods: {
    refreshEnvs() {
      this.$store.dispatch('envs/get', {})
    },
    refreshEnvData() {
      this.$store.dispatch('envs/refreshEnvData', { appId: this.$route.params.appid })
    },
    handleEnvSelect(value) {
      this.form.cluster = ''
      this.form.namespace = []
      this.namespaceDetailDisplay = false
      this.clusters = this.envData[value]
    },
    handleClusterSelect(value) {
      this.form.namespace = []
      this.namespaceDetailDisplay = false
      this.$store.dispatch('namespace/getWithCallback', {
        query: {
          appId: this.$route.params.appid,
          env: this.form.env,
          cluster: this.form.cluster
        },
        callback: (data) => {
          var result = []
          result.push({
            'baseInfo': {
              'id': -1,
              'appId': '',
              'clusterName': '',
              'namespaceName': 'all'
            }
          }
          )
          this.namespacesQueryResult = result.concat(data)
        }
      })
    },
    handleNamespaceQuery(keyword) {
      this.namespaceLoading = true
      var result = []
      result.push({
        'baseInfo': {
          'id': -1,
          'appId': '',
          'clusterName': '',
          'namespaceName': 'all'
        }
      }
      )
      result = result.concat(this.namespaces.filter(item => {
        return item.baseInfo.namespaceName.toLowerCase()
          .indexOf(keyword.toLowerCase()) > -1
      }))
      this.namespacesQueryResult = result
      this.namespaceLoading = false
    },
    handleLoadNamespace() {
      this.namespaceDetailDisplay = true
    },
    handleNamespaceChange(selectNames) {
      if (selectNames.includes('all')) {
        this.namespacesSelect = this.namespacesQueryResult.filter(item => {
          return item.baseInfo.namespaceName !== 'all'
        })
      } else {
        this.namespacesSelect = this.namespacesQueryResult.filter(item => {
          return selectNames.includes(item.baseInfo.namespaceName) && item.baseInfo.namespaceName !== 'all'
        })
      }
    },
    handleNamespaceOpen(item) {
      this.$router.push('/namespace/index/' + item.baseInfo.appId + '/' + this.form.env + '/' + item.baseInfo.clusterName + '/' + item.baseInfo.namespaceName)
    }

  }
}
</script>

<style lang="scss" scoped>
.box-card{
  margin: 10px 0px;
}
</style>
