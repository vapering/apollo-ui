<style lang="scss" scoped>
.header-tag{
  margin:0px 10px;
}
.card-item{
  margin: 10px 5px;
  padding: 5px 5px;
  border-style: solid;
  border-width: 0px 0px 1px 0px;
  border-color: #dddddd;
}
.box-card{
  margin: 5px 0px;
}
</style>

<template>
  <div>
    <el-row :gutter="32" style="padding: 0px;margin: 10px 0px 5px 0px;">
      <el-col :xs="24" :sm="6" :lg="4" style="">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Namespace Info</span>
          </div>
          <div class="card-item">
            AppId: {{ appId }}
          </div>
          <div class="card-item">
            Env: {{ env }}
          </div>
          <div class="card-item">
            ClusterName: {{ cluster }}
          </div>
          <div class="card-item">
            Namespace: {{ namespaceName }}
          </div>
          <div class="card-item">
            <span v-if="namespace.isPublic"><div>Public</div></span>
            <span v-if="!namespace.isPublic"><div>Private</div></span>
          </div>
        </el-card>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Operation</span>
          </div>
          <div class="card-item">
            <el-button type="primary" icon="el-icon-plus" @click="handleItemCreate">Add</el-button>
          </div>
          <div class="card-item">
            <el-button type="primary" @click="handleReleaseDialog">Release</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="18" :lg="20" style="">
        <el-tabs type="border-card">
          <el-tab-pane label="Table">
            <el-table
              :data="getFilterResult(namespace.items)"
              stripe
              :border="true"
              style="width: 100%"
            >
              <el-table-column
                label="release status"
                :sort-method="handleReleaseStatusSort"
                sortable
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.isDeleted" type="danger">not release</el-tag>
                  <el-tag v-else-if="scope.row.isModified&&scope.row.oldValue===''" type="danger">not release</el-tag>
                  <el-tag v-else-if="scope.row.isModified" type="danger">not release</el-tag>
                  <el-tag v-else>release</el-tag>
                </template>
              </el-table-column>

              <el-table-column
                label="status"
                sortable
                :sort-method="handleItemStatusSort"
              >
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.isDeleted" type="danger">delete</el-tag>
                  <el-tag v-else-if="scope.row.isModified&&scope.row.oldValue===''" type="success">new</el-tag>
                  <el-tag v-else-if="scope.row.isModified" type="warning">modify</el-tag>
                  <el-tag v-else>noChange</el-tag>
                </template>
              </el-table-column>

              <el-table-column prop="item.key" sortable>
                <template #header>
                  <el-input
                    v-model="itemKeyWord"
                    clearable
                    placeholder="key"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="item.value" label="value" />
              <el-table-column prop="item.comment" label="comment" />
              <el-table-column sortable prop="item.dataChangeLastModifiedBy" label="dataChangeLastModifiedBy" />
              <el-table-column sortable prop="item.dataChangeLastModifiedTime" label="dataChangeLastModifiedTime" />
              <el-table-column
                label="operator"
              >
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="handleEditItem(scope.row)"
                  />
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="handleItemRemove(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="Text">
            <ItemsInText :namespace="namespace" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-drawer
      title="Update"
      direction="rtl"
      size="35%"
      :append-to-body="true"
      :before-close="handleItemEditClose"
      :visible.sync="editItemDrawerShow"
    >
      <div style="padding: 10px 15px">
        <el-form ref="form" :model="editItemForm">
          <el-form-item label="key">
            <el-input v-model="editItemForm.item.key" />
          </el-form-item>
          <el-form-item label="value">
            <el-input
              v-model="editItemForm.item.value"
              autosize
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="comment">
            <el-input
              v-model="editItemForm.item.comment"
              autosize
              type="textarea"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleItemSave">save</el-button>
            <el-button @click="handleItemEditClose">calcel</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-drawer>

    <el-dialog title="Release" :visible.sync="releaseFormVisible">
      Changes:
      <el-table
        :data="changedItems"
        stripe
        :border="true"
        style="width: 100%"
      >
        <el-table-column
          label="release status"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isDeleted" type="danger">not release</el-tag>
            <el-tag v-else-if="scope.row.isModified&&scope.row.oldValue===''" type="danger">not release</el-tag>
            <el-tag v-else-if="scope.row.isModified" type="danger">not release</el-tag>
            <el-tag v-else>release</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="status"
          sortable
          :sort-method="handleItemStatusSort"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isDeleted" type="danger">delete</el-tag>
            <el-tag v-else-if="scope.row.isModified&&scope.row.oldValue===''" type="success">new</el-tag>
            <el-tag v-else-if="scope.row.isModified" type="warning">modify</el-tag>
            <el-tag v-else>noChange</el-tag>
          </template>
        </el-table-column>

        <el-table-column sortable prop="item.key" label="key" />
        <el-table-column prop="item.value" label="value" />
        <el-table-column sortable prop="item.dataChangeLastModifiedBy" label="dataChangeLastModifiedBy" />
        <el-table-column sortable prop="item.dataChangeLastModifiedTime" label="dataChangeLastModifiedTime" />
      </el-table>

      <el-form :model="releaseForm">
        <el-form-item label="Title">
          <el-input v-model="releaseForm.releaseTitle" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Comment">
          <el-input v-model="releaseForm.releaseComment" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="releaseFormVisible = false">cancel</el-button>
        <el-button type="danger" @click="handleRelease">release</el-button>
      </div>
    </el-dialog>
    <ItemCreate
      :create-item-drawer-show="createItemDrawerShow"
      :namespace-name="namespaceName"
      :app-id="appId"
      @createSuccess="refreshData"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { update, remove, release } from '@/api/item'
import ItemsInText from '@/views/namespace/itemsInText'
import ItemCreate from '@/views/namespace/itemCreate'
import date from 'date-and-time'

export default {
  name: 'NamespaceTable',
  components: { ItemsInText, ItemCreate },
  props: {
  },
  data() {
    return {
      appId: this.$route.params.appid,
      env: this.$route.params.env,
      namespaceName: this.$route.params.namespaceName,
      cluster: this.$route.params.cluster,
      namespace: {},
      itemKeyWord: '',
      contentShow: this.show || false,
      editItemDrawerShow: false,
      editItemForm: {
        'item': {
          'key': '',
          'value': '',
          'comment': ''
        }
      },
      createItemDrawerShow: false,
      changedItems: [],
      releaseFormVisible: false,
      releaseForm: {
        releaseTitle: '',
        releaseComment: ''
      }
    }
  },
  computed: {
    ...mapState({
      namespaces: state => state.namespace.data
    })
  },
  created() {
    this.refreshData()
  },
  methods: {
    handleClose() {
      this.contentShow = false
      this.handleCloseEvent(false)
    },
    handleItemEditClose() {
      this.editItemDrawerShow = false
      this.editItemForm = {
        'item': {
          'key': '',
          'value': '',
          'comment': ''
        }
      }
    },
    handleEditItem(item) {
      this.editItemDrawerShow = true
      this.editItemForm = item
    },
    handleItemSave() {
      var pathData = {
        appId: this.namespace.baseInfo.appId,
        env: this.env,
        cluster: this.namespace.baseInfo.clusterName,
        namespaceName: this.namespace.baseInfo.namespaceName
      }
      var item = this.editItemForm.item
      var data = {
        ...item,
        tableViewOperType: 'update'
      }
      update({
        pathData,
        data
      }).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: 'update success',
            type: 'success'
          })
        }
        this.editItemDrawerShow = false
        this.refreshData()
      })
    },
    refreshData() {
      this.$store.dispatch('namespace/getWithCallback', {
        query: {
          appId: this.$route.params.appid,
          env: this.$route.params.env,
          cluster: this.$route.params.cluster
        },
        callback: (namespaces) => {
          namespaces.forEach(item => {
            if (item.baseInfo.namespaceName === this.namespaceName && item.baseInfo.appId === this.appId) {
              this.namespace = item
            }
          })
        }
      })
    },
    handleItemRemove(item) {
      var data = {
        appId: this.namespace.baseInfo.appId,
        env: this.env,
        cluster: this.namespace.baseInfo.clusterName,
        namespaceName: this.namespace.baseInfo.namespaceName,
        id: item.item.id
      }
      remove(data).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: 'delete success',
            type: 'success'
          })
        }
        this.refreshData()
      })
    },
    refreshChangedItems() {
      this.changedItems = this.namespace.items.filter((item) => {
        if (item.isDeleted || item.isModified) {
          return true
        } else {
          return false
        }
      })
    },
    handleReleaseDialog() {
      this.refreshChangedItems()
      this.releaseForm.releaseTitle = date.format(new Date(), 'YYYYMMDDHHmmss') + '-release'
      this.releaseFormVisible = true
    },
    handleRelease() {
      if (this.changedItems.length === 0) {
        this.$message({
          message: 'no change to release',
          type: 'success'
        })
        return
      }
      var pathData = {
        appId: this.namespace.baseInfo.appId,
        env: this.env,
        cluster: this.namespace.baseInfo.clusterName,
        namespaceName: this.namespace.baseInfo.namespaceName
      }
      release({
        pathData,
        data: {
          'releaseTitle': '20211204120448-release',
          'releaseComment': '',
          'isEmergencyPublish': false
        }
      }).then((res) => {
        this.releaseFormVisible = false
        if (res.status === 200) {
          this.$message({
            message: 'release success',
            type: 'success'
          })
        }
        this.refreshData()
      })
    },
    handleItemCreate() {
      this.$store.dispatch('item/commitItemCreateShow', true)
    },
    handleReleaseStatusSort(a, b) {
      var aReleaseVal = this.getReleaseStatus(a)
      var bReleaseVal = this.getReleaseStatus(b)
      return aReleaseVal - bReleaseVal
    },
    getReleaseStatus(obj) {
      if (obj.isDeleted || obj.isModified) {
        return 1
      } else {
        return 0
      }
    },
    handleItemStatusSort(a, b) {
      var aReleaseVal = this.getItemStatus(a)
      var bReleaseVal = this.getItemStatus(b)
      return aReleaseVal - bReleaseVal
    },
    getItemStatus(obj) {
      if (obj.isDeleted) {
        return 1
      } else if (obj.isModified) {
        if (obj.item.oldValue === '') {
          return 2
        } else {
          return 3
        }
      } else {
        return 0
      }
    },
    getFilterResult() {
      var keyword = this.itemKeyWord
      if (!this.namespace.items) {
        return []
      } else if (keyword === '') {
        return this.namespace.items
      } else {
        return this.namespace.items.filter((item) => {
          return item.item.key.indexOf(keyword) > -1
        })
      }
    }
  }
}
</script>

