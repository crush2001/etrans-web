<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询的工单标题" v-model="searchTitle" clearable @keydown.enter.native="searchWorkorderByStaffAndTitle"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchWorkorderByStaffAndTitle">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initMyApplication">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="65%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingApplicationSearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该工单申请的信息'></el-empty>
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
              <el-table-column fixed="right" header-align="center" width="250px" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改申请</el-button>
                  <el-button @click="deleteOwnWorkorderSearch(scope.row)" type="danger" size="mini" icon="el-icon-delete">撤销申请</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
      <div>
        <el-button type="success" icon="el-icon-plus" @click="showSubmitMenu">提交新申请</el-button>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="myApplicationInfo"
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
              width="250px"
              label="操作"
              align="center">
            <template slot-scope="scope">
              <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改申请</el-button>
              <el-button @click="deleteOwnWorkorder(scope.row)" type="danger" size="mini" icon="el-icon-delete">撤销申请</el-button>
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
    </div>
    <el-dialog title="提交新申请" :visible.sync="addDialogVisible" width="50%">
      <div>
        <el-form ref="submitNewApplicationForm" :model="applicationDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工单发布者：" prop="workorderPublisher">
                <el-input v-model="applicationDetails.workorderPublisher" prefix-icon="el-icon-edit" placeholder="请输入工单发布者" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单标题：" prop="workorderTitle">
                <el-input v-model="applicationDetails.workorderTitle" prefix-icon="el-icon-edit" placeholder="请输入工单标题" size="medium"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工单类型：" prop="workorderType">
                <el-select v-model="applicationDetails.workorderType" placeholder="请选择工单类型" size="medium" style="width: 100%">
                  <el-option
                      v-for="item in workorderTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单内容：" prop="workorderContent">
                <el-input type="textarea" v-model="applicationDetails.workorderContent" prefix-icon="el-icon-edit" placeholder="请输入工单内容" size="medium"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改申请" :visible.sync="editDialogVisible" width="50%">
      <div>
        <el-form ref="editApplicationForm" :model="editApplicationDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="工单ID：" prop="workorderId">
                <el-input v-model="editApplicationDetails.workorderId" prefix-icon="el-icon-edit" placeholder="请输入工单ID" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单发布者：" prop="workorderPublisher">
                <el-input v-model="editApplicationDetails.workorderPublisher" prefix-icon="el-icon-edit" placeholder="请输入工单发布者" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单类型：" prop="workorderType">
                <el-select v-model="editApplicationDetails.workorderType" placeholder="请选择工单类型" size="medium" style="width: 100%">
                  <el-option
                      v-for="item in workorderTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工单标题：" prop="workorderTitle">
                <el-input v-model="editApplicationDetails.workorderTitle" prefix-icon="el-icon-edit" placeholder="请输入工单标题" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单内容：" prop="workorderContent">
                <el-input type="textarea" v-model="editApplicationDetails.workorderContent" prefix-icon="el-icon-edit" placeholder="请输入工单内容" size="medium"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";

export default {
  name: "MyApplication",
  data(){
    return{
      myApplicationInfo:[],
      searchResult:[],
      loading:false,
      addDialogVisible:false,
      editDialogVisible:false,
      dialogTableVisible:false,
      loadingApplicationSearchResult:false,
      total:0,
      pageSize:10,
      currentPage:1,
      ownAccount:'',
      searchTitle:'',
      applicationDetails:{
        workorderId:0,
        workorderPublisher:window.sessionStorage.getItem('loginStaff'),
        workorderTitle:'',
        workorderContent:'',
        workorderType:'',
        workorderStatus:'待审核'
      },
      editApplicationDetails:{
        workorderId:0,
        workorderPublisher:'',
        workorderTitle:'',
        workorderContent:'',
        workorderType:'',
        workorderStatus:'待审核'
      },
      rules:{
        workorderId:[{required:true,message:'工单ID不能为空',trigger:'blur'}],
        workorderPublisher:[{required:true,message:'工单发布者不能为空',trigger:'blur'}],
        workorderTitle:[{required:true,message:'工单标题不能为空',trigger:'blur'}],
        workorderContent:[{required:true,message:'工单内容不能为空',trigger:'blur'}],
        workorderType:[{required:true,message:'工单类型不能为空',trigger:'blur'}],
        workorderPublishTime:[{required:true,message:'工单提交时间不能为空',trigger:'blur'}],
        workorderStatus:[{required:true,message:'工单状态不能为空',trigger:'blur'}],
      },
      workorderTypeOptions: [{
        value: '请假',
        label: '请假'
      },{
        value: '换班',
        label: '换班'
      },{
        value: '换车',
        label: '换车'
      },{
        value: '换线',
        label: '换线'
      },{
        value: '建议',
        label: '建议'
      }]
    }
  },
  mounted() {
    this.initMyApplication();
  },
  methods:{
    submitEdit(){
      this.$refs['editApplicationForm'].validate(valid=>{
        if (valid) {
          putRequest('/workorder?workorderId='+this.editApplicationDetails.workorderId
              +'&workorderTitle='+this.editApplicationDetails.workorderTitle
              +'&workorderContent='+this.editApplicationDetails.workorderContent
              +'&workorderType='+this.editApplicationDetails.workorderType
              +'&workorderStatus='+this.editApplicationDetails.workorderStatus).then(resp=>{
            if (resp) {
              this.editDialogVisible = false;
              this.$notify({
                title: '修改成功',
                message: '该申请已修改成功！',
                type: 'success',
                duration: 3000
              });
              this.dialogTableVisible = false;
              this.initMyApplication();
            }
          })
        }
      })
    },
    submitAdd(){
      this.$refs['submitNewApplicationForm'].validate(valid=>{
        if (valid) {
          postRequest('/workorder',this.applicationDetails).then(resp=>{
            if (resp) {
              this.addDialogVisible = false;
              this.$notify({
                title: '新增成功',
                message: '该申请已提交成功！',
                type: 'success',
                duration: 3000
              });
              this.initMyApplication();
              this.$refs['submitNewApplicationForm'].resetFields();
            }
          })
        }
      })
    },
    showEditMenu(data){
      this.editApplicationDetails.workorderId = data.workorderId;
      this.editApplicationDetails.workorderPublisher = data.workorderPublisher;
      this.editApplicationDetails.workorderTitle = data.workorderTitle;
      this.editApplicationDetails.workorderContent = data.workorderContent;
      this.editApplicationDetails.workorderType = data.workorderType;
      this.editApplicationDetails.workorderStatus = '待审核';
      this.editDialogVisible = true;
    },
    showSubmitMenu(){
      this.addDialogVisible = true;
      this.applicationDetails.workorderPublisher = window.sessionStorage.getItem('loginStaff');
      this.applicationDetails.workorderStatus = '待审核';
      this.$refs['submitNewApplicationForm'].resetFields();
    },
    deleteOwnWorkorder(data){
      this.$confirm('此操作将永久删除该工单申请，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/workorder?id='+ data.workorderId).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该工单申请信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.initMyApplication();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    deleteOwnWorkorderSearch(data){
      this.$confirm('此操作将永久删除该工单申请，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/workorder?id='+ data.workorderId).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该工单申请信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.dialogTableVisible = false;
            this.initMyApplication();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    currentChange(currentPage){
      this.currentPage = currentPage;
      this.initMyApplication();
    },
    sizeChange(pageSize){
      this.pageSize = pageSize;
      this.initMyApplication();
    },
    initMyApplication(){
      this.loading = true;
      this.ownAccount = window.sessionStorage.getItem('loginStaff');
      getRequest('/workorder/listOwnWorkorder?pageNum='+this.currentPage +'&pageSize='+this.pageSize+'&workorderPublisher='+this.ownAccount).then(resp=>{
        this.loading = false;
        if (resp) {
          this.myApplicationInfo = resp.list;
          this.total = resp.total;
        }
      })
    },
    searchWorkorderByStaffAndTitle(){
      this.loadingApplicationSearchResult = true;
      this.searchResult = [];
      getRequest('/workorder/searchTitle?workorderPublisher='+window.sessionStorage.getItem('loginStaff')
          +'&workorderTitle='+this.searchTitle).then(resp=>{
            this.loadingApplicationSearchResult = false;
            this.dialogTableVisible = true;
            if (resp) {
              this.searchResult = resp;
            }
      })
    }
  }
}
</script>

