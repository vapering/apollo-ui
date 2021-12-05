<template>
  <el-row :gutter="32" style="padding:30px;">
    <el-col :xs="24" :sm="24" :lg="24" style="margin: 15px 0px;">
      <el-button @click="applicationCreateFormVisible = true">新建应用</el-button>
      <el-dialog title="新建应用" :visible.sync="applicationCreateFormVisible" width="30%">
        <el-form :model="applicationCreateForm" label-width="120px" label-position="right">
          <el-form-item label="部门">
            <el-autocomplete
              v-model="applicationCreateForm.orgName"
              class="inline-input"
              :fetch-suggestions="querySearchOrganizations"
              value-key="orgName"
              value="orgId"
              placeholder="部门"
              @select="handleOrganizationSelect"
            />
          </el-form-item>
          <el-form-item label="应用ID">
            <el-input v-model="applicationCreateForm.appId" autocomplete="off" />
          </el-form-item>
          <el-form-item label="应用名称">
            <el-input v-model="applicationCreateForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="应用负责人">
            <el-autocomplete
              v-model="applicationCreateForm.ownerName"
              class="inline-input"
              :fetch-suggestions="querySearchApUsers"
              value-key="name"
              value="name"
              placeholder="应用负责人"
              @select="handleSelect"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="applicationCreateFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleApplicationCreateSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="24">
      <el-table :data="applicationsData" stripe style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleApplicationOpen(scope.row)"><i class="el-icon-setting" /> 进入应用</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="name" />
        <el-table-column prop="appId" label="appId" />
        <el-table-column prop="orgName" label="orgName" />
        <el-table-column prop="ownerName" label="ownerName" />
        <el-table-column prop="dataChangeLastModifiedBy" label="dataChangeLastModifiedBy" />
        <el-table-column prop="dataChangeLastModifiedTime" label="dataChangeLastModifiedTime" />
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ApplicationDashboard',
  components: {},
  data() {
    return {
      applicationCreateFormVisible: false,
      applicationCreateForm: {
        'appId': '',
        'name': '',
        'orgId': '',
        'orgName': '',
        'ownerName': '',
        'admins': []
      }
    }
  },
  computed: {
    ...mapState({
      applicationsData: state => state.application.data,
      organizations: state => state.organizations.data,
      apUsers: state => state.apUsers.data
    })
  },
  created() {
    this.refreshApplications()
    this.refreshOrganizations()
    this.refreshApUsers()
  },
  methods: {
    refreshApplications() {
      this.listLoading = true
      this.$store.dispatch('application/refreshData', {})
    },
    handleSelect() {},
    querySearchOrganizations(keyword, callback) {
      this.$store.dispatch('organizations/refreshOrganizationsWithCallback', { keyword, callback })
    },
    refreshOrganizations() {
      this.$store.dispatch('organizations/refreshOrganizations', { withoutAnimation: false })
    },
    handleOrganizationSelect(selectData) {
      this.applicationCreateForm.orgId = selectData.orgId
      this.applicationCreateForm.orgName = selectData.orgName
    },
    querySearchApUsers(keyword, callback) {
      this.$store.dispatch('apUsers/refreshDataWithCallback', { keyword, callback })
    },
    refreshApUsers() {
      this.$store.dispatch('apUsers/refreshData', '')
    },
    handleApUserSelect(selectData) {
      this.applicationCreateForm.ownerName = selectData.name
    },
    handleApplicationCreateSubmit(data) {
      this.applicationCreateFormVisible = false
      this.applicationCreateForm
      this.$store.dispatch('application/createApplication', this.applicationCreateForm).then(() => {
        this.refreshApplications()
      })
    },
    handleApplicationOpen(application) {
      this.$store.dispatch('application/selectApplication', application).then(() => {
        this.$router.push('/cluster/index/' + application.appId)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
