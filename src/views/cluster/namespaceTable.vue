<template>
  <div>
    <el-drawer
      title=""
      :with-header="false"
      :visible.sync="contentShow"
      direction="rtl"
      size="60%"
      :before-close="handleClose"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-tag class="header-tag"><div>{{ namespace.baseInfo.namespaceName }}</div></el-tag>
          <el-tag v-if="namespace.isPublic" class="header-tag" type="info"><div>Public</div></el-tag>
          <el-tag v-if="!namespace.isPublic" class="header-tag" type="info"><div>Private</div></el-tag>
        </div>
        <div class="text item">
          <el-table
            :data="namespace.items"
            stripe
            :border="true"
            style="width: 100%"
          >
            <el-table-column
              label="release status"
              sortable
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.isDeleted" type="warning">not release</el-tag>
                <el-tag v-else-if="scope.row.isModified&&scope.row.oldValue===''" type="warning">not release</el-tag>
                <el-tag v-else-if="scope.row.isModified" type="warning">not release</el-tag>
                <el-tag v-else>release</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              label="status"
              sortable
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
                  @click="a=2"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-drawer
        title=""
        :with-header="false"
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
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { update } from '@/api/item'
import { string } from 'jszip/lib/support'

export default {
  name: 'NamespaceTable',
  components: { },
  props: {
    show: { type: Boolean, required: true },
    namespace: {
      required: true,
      validator: function(value) {
        return !(
          value === null || value === undefined
        )
      }
    },
    env: string,
    handleCloseEvent: {
      required: true,
      type: Function
    }
  },
  data() {
    this.namespace
    return {
      data: {},
      contentShow: this.show || false,
      editItemDrawerShow: false,
      editItemForm: {
        'item': {
          'key': '',
          'value': '',
          'comment': ''
        }
      }
    }
  },
  computed: {
    ...mapState({

      namespaces: state => state.namespace.data
    })
  },
  created() {

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
        this.$store.dispatch('envs/refreshEnvData', { appId: this.namespace.baseInfo.appId })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header-tag{
  margin:0px 10px;
}
</style>
