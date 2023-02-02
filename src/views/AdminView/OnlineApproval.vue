<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询的员工账号" v-model="searchStaff" clearable @keydown.enter.native="searchWorkorderByStaff"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchWorkorderByStaff">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initWorkorder" @click.native="getWorkorderNum">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="65%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingWorkorderSearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该员工提交的工单信息'></el-empty>
              </template>
              <el-table-column fixed prop="workorderId" header-align="center" label="工单ID" align="center"></el-table-column>
              <el-table-column prop="workorderPublisher" header-align="center" label="工单发布者" align="center"></el-table-column>
              <el-table-column prop="workorderTitle" header-align="center" label="工单标题" align="center"></el-table-column>
              <el-table-column prop="workorderContent" header-align="center" label="工单内容" align="center"></el-table-column>
              <el-table-column prop="workorderType" header-align="center" label="工单类型" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.workorderType === '请假'">
                    <el-tag type="success" effect="plain">{{scope.row.workorderType}}</el-tag>
                  </span>
                        <span v-else-if="scope.row.workorderType === '换班'">
                    <el-tag type="danger" effect="plain">{{scope.row.workorderType}}</el-tag>
                  </span>
                        <span v-else-if="scope.row.workorderType === '换车'">
                    <el-tag type="primary" effect="plain">{{scope.row.workorderType}}</el-tag>
                  </span>
                        <span v-else-if="scope.row.workorderType === '换线'">
                    <el-tag type="info" effect="plain">{{scope.row.workorderType}}</el-tag>
                  </span>
                        <span v-else-if="scope.row.workorderType === '建议'">
                    <el-tag type="warning" effect="plain">{{scope.row.workorderType}}</el-tag>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="workorderPublishTime" header-align="center" label="工单提交时间" align="center">
                <template slot-scope="scope">{{scope.row.workorderPublishTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
              </el-table-column>
              <el-table-column prop="workorderStatus" header-align="center" label="工单状态" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.workorderStatus === '批准'">
                    <el-tag type="success" effect="dark">{{scope.row.workorderStatus}}</el-tag>
                  </span>
                        <span v-else-if="scope.row.workorderStatus === '驳回'">
                    <el-tag type="danger" effect="dark">{{scope.row.workorderStatus}}</el-tag>
                  </span>
                        <span v-else-if="scope.row.workorderStatus === '待审核'">
                    <el-tag type="primary" effect="dark">{{scope.row.workorderStatus}}</el-tag>
                  </span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" header-align="center" width="150px" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="showApprovalMenu(scope.row)" type="success" size="mini" icon="el-icon-s-claim">审批</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
    </div>
    <div style="margin-top: 15px">
      <el-table
          :data="workorderInfo"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          border
          stripe
          style="width: 100%">
        <el-table-column
            fixed
            prop="workorderId"
            header-align="center"
            label="工单ID"
            align="center">
        </el-table-column>
        <el-table-column
            prop="workorderPublisher"
            header-align="center"
            label="工单发布者"
            align="center">
        </el-table-column>
        <el-table-column
            prop="workorderTitle"
            header-align="center"
            label="工单标题"
            align="center">
        </el-table-column>
        <el-table-column
            prop="workorderContent"
            header-align="center"
            label="工单内容"
            align="center">
        </el-table-column>
        <el-table-column
            prop="workorderType"
            header-align="center"
            label="工单类型"
            align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.workorderType === '请假'">
              <el-tag type="success" effect="plain">{{scope.row.workorderType}}</el-tag>
            </span>
            <span v-else-if="scope.row.workorderType === '换班'">
              <el-tag type="danger" effect="plain">{{scope.row.workorderType}}</el-tag>
            </span>
            <span v-else-if="scope.row.workorderType === '换车'">
              <el-tag type="primary" effect="plain">{{scope.row.workorderType}}</el-tag>
            </span>
            <span v-else-if="scope.row.workorderType === '换线'">
              <el-tag type="info" effect="plain">{{scope.row.workorderType}}</el-tag>
            </span>
            <span v-else-if="scope.row.workorderType === '建议'">
              <el-tag type="warning" effect="plain">{{scope.row.workorderType}}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
            prop="workorderPublishTime"
            header-align="center"
            label="工单提交时间"
            align="center">
          <template slot-scope="scope">{{scope.row.workorderPublishTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
        </el-table-column>
        <el-table-column
            prop="workorderStatus"
            header-align="center"
            label="工单状态"
            align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.workorderStatus === '批准'">
              <el-tag type="success" effect="dark">{{scope.row.workorderStatus}}</el-tag>
            </span>
            <span v-else-if="scope.row.workorderStatus === '驳回'">
              <el-tag type="danger" effect="dark">{{scope.row.workorderStatus}}</el-tag>
            </span>
            <span v-else-if="scope.row.workorderStatus === '待审核'">
              <el-tag type="primary" effect="dark">{{scope.row.workorderStatus}}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            header-align="center"
            width="150px"
            label="操作"
            align="center">
          <template slot-scope="scope">
            <el-button @click="showApprovalMenu(scope.row)" type="success" size="mini" icon="el-icon-s-claim">审批</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 15px;display: flex;justify-content: flex-end">
      <el-pagination
          background
          :page-sizes="[5,10,15,20]"
          :page-size="pageSize"
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <el-dialog title="审批" :visible.sync="approvalDialogVisible" width="60%">
      <div>
        <el-form ref="approvalForm" :model="approvalDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="工单ID：" prop="workorderId">
                <el-input v-model="approvalDetails.workorderId" prefix-icon="el-icon-edit" placeholder="请输入工单ID" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单发布者：" prop="workorderPublisher">
                <el-input v-model="approvalDetails.workorderPublisher" prefix-icon="el-icon-edit" placeholder="请输入工单发布者" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单标题：" prop="workorderTitle">
                <el-input v-model="approvalDetails.workorderTitle" prefix-icon="el-icon-edit" placeholder="请输入工单标题" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工单内容：" prop="workorderContent">
                <el-input type="textarea" v-model="approvalDetails.workorderContent" prefix-icon="el-icon-edit" placeholder="请输入工单内容" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单类型：" prop="workorderType">
                <el-input v-model="approvalDetails.workorderType" prefix-icon="el-icon-edit" placeholder="请输入工单类型" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工单提交时间：" prop="workorderPublishTime">
                <el-input v-model="approvalDetails.workorderPublishTime" prefix-icon="el-icon-edit" placeholder="请输入工单提交时间" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单审批状态：" prop="workorderStatus">
                <el-select v-model="approvalDetails.workorderStatus" placeholder="请进行审批" size="medium">
                  <el-option
                      v-for="item in workorderStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approvalDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitApproval">提 交 审 批 结 果</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest, putRequest} from "@/utils/api";

export default {
  name: "OnlineApproval",
  data(){
    return{
      workorderInfo:[],
      searchResult:[],
      searchStaff:'',
      dialogTableVisible:false,
      loadingWorkorderSearchResult:false,
      loading:false,
      approvalDialogVisible:false,
      currentPage:1,
      pageSize:10,
      total:0,
      rules:{
        workorderId:[{required:true,message:'工单ID不能为空',trigger:'blur'}],
        workorderPublisher:[{required:true,message:'工单发布者不能为空',trigger:'blur'}],
        workorderTitle:[{required:true,message:'工单标题不能为空',trigger:'blur'}],
        workorderContent:[{required:true,message:'工单内容不能为空',trigger:'blur'}],
        workorderType:[{required:true,message:'工单类型不能为空',trigger:'blur'}],
        workorderPublishTime:[{required:true,message:'工单提交时间不能为空',trigger:'blur'}],
        workorderStatus:[{required:true,message:'工单状态不能为空',trigger:'blur'}],
      },
      approvalDetails:{
        workorderId:0,
        workorderPublisher:'',
        workorderTitle:'',
        workorderContent:'',
        workorderType:'',
        workorderPublishTime:'',
        workorderStatus:''
      },
      workorderStatusOptions: [{
        value: '批准',
        label: '批准'
      }, {
        value: '驳回',
        label: '驳回'
      }]
    }
  },
  mounted() {
    this.initWorkorder();
    this.getWorkorderNum();
  },
  methods:{
    showApprovalMenu(data){
      this.approvalDetails.workorderId = data.workorderId;
      this.approvalDetails.workorderPublisher = data.workorderPublisher;
      this.approvalDetails.workorderTitle = data.workorderTitle;
      this.approvalDetails.workorderContent = data.workorderContent;
      this.approvalDetails.workorderPublishTime = data.workorderPublishTime;
      this.approvalDetails.workorderType = data.workorderType;
      this.approvalDetails.workorderStatus = data.workorderStatus;
      this.approvalDialogVisible = true;
    },
    submitApproval(){
      this.$refs['approvalForm'].validate(valid=>{
        if (valid) {
          putRequest('/workorder?workorderId='+this.approvalDetails.workorderId
              +'&workorderStatus='+this.approvalDetails.workorderStatus).then(resp=>{
            if (resp) {
              this.approvalDialogVisible = false;
              this.$notify({
                title: '审批结果提交成功',
                message: '该工单的审批结果已提交到系统！',
                type: 'success',
                duration: 3000
              });
              this.dialogTableVisible = false;
              this.getWorkorderNum();
              this.initWorkorder();
            }
          })
        }
      })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initWorkorder();
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initWorkorder();
    },
    initWorkorder(){
      this.loading = true;
      getRequest('/workorder/list?pageNum='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
        this.loading = false;
        if (resp) {
          this.workorderInfo = resp.list;
        }
      })
    },
    getWorkorderNum(){
      getRequest('/workorder/count').then(resp=>{
        this.total = resp;
      })
    },
    searchWorkorderByStaff(){
      this.loadingWorkorderSearchResult = true;
      this.searchResult = [];
      getRequest('/workorder/search?workorderPublisher='+this.searchStaff).then(resp=>{
        this.loadingWorkorderSearchResult = false;
        this.dialogTableVisible = true;
        if (resp) {
          this.searchResult = resp;
        }
      })
    }
  }
}
</script>
