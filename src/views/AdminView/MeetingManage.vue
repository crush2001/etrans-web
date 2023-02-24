<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询的会议主题" v-model="searchTheme" clearable @keydown.enter.native="searchMeetingByTheme"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchMeetingByTheme">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initMeetingInfo">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="70%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingSearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该会议的信息'></el-empty>
              </template>
              <el-table-column width="80" fixed prop="meetingId" header-align="center" align="center" label="会议ID"></el-table-column>
              <el-table-column prop="meetingTheme" header-align="center" align="center" label="会议主题"></el-table-column>
              <el-table-column prop="meetingDetails" header-align="center" align="center" label="会议详情"></el-table-column>
              <el-table-column width="120" prop="meetingType" header-align="center" align="center" label="会议类型">
                <template slot-scope="scope">
                  <el-tag type="info" effect="plain">{{scope.row.meetingType}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column width="123" prop="meetingTime" header-align="center" align="center" label="会议时间">
                <template slot-scope="scope">{{scope.row.meetingTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
              </el-table-column>
              <el-table-column width="150" prop="meetingArranger" header-align="center" align="center" label="会议安排者账号"></el-table-column>
              <el-table-column prop="meetingParticipant" header-align="center" align="center" label="会议参加者账号"></el-table-column>
              <el-table-column fixed="right" header-align="center" align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
                  <el-button @click="deleteMeetingSearch(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
      <div>
        <el-button type="success" icon="el-icon-plus" @click="showAddMenu">新增会议安排</el-button>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="meetingInfo"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            stripe
            style="width: 100%">
          <el-table-column
              fixed
              prop="meetingId"
              header-align="center"
              align="center"
              width="80"
              label="会议ID">
          </el-table-column>
          <el-table-column
              prop="meetingTheme"
              header-align="center"
              align="center"
              label="会议主题">
          </el-table-column>
          <el-table-column
              prop="meetingDetails"
              header-align="center"
              align="center"
              label="会议详情">
          </el-table-column>
          <el-table-column
              prop="meetingType"
              header-align="center"
              align="center"
              width="120"
              label="会议类型">
            <template slot-scope="scope">
              <el-tag type="info" effect="plain">{{scope.row.meetingType}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="meetingTime"
              header-align="center"
              align="center"
              width="123"
              label="会议时间">
            <template slot-scope="scope">{{scope.row.meetingTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
          </el-table-column>
          <el-table-column
              prop="meetingArranger"
              header-align="center"
              align="center"
              width="150"
              label="会议安排者账号">
          </el-table-column>
          <el-table-column
              prop="meetingParticipant"
              header-align="center"
              align="center"
              label="会议参加者账号">
          </el-table-column>
          <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              label="操作"
              width="200">
            <template slot-scope="scope">
              <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
              <el-button @click="deleteMeeting(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 15px;display: flex;justify-content: flex-end">
        <el-pagination
            background
            :page-sizes="[2,8,10,20]"
            :page-size="pageSize"
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增会议安排" :visible.sync="addDialogVisible" width="60%">
      <div>
        <el-form ref="addMeetingForm" :model="meetingDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="会议主题：" prop="meetingTheme">
                <el-input autosize type="textarea" v-model="meetingDetails.meetingTheme" prefix-icon="el-icon-edit" placeholder="请输入会议主题" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="会议详情：" prop="meetingDetails">
                <el-input autosize type="textarea" v-model="meetingDetails.meetingDetails" prefix-icon="el-icon-edit" placeholder="请输入会议详情" size="medium"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="会议类型：" prop="meetingType">
                <el-select v-model="meetingDetails.meetingType" placeholder="请选择会议类型" size="medium" style="width: 100%;">
                  <el-option
                      v-for="item in meetingTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="会议时间：" prop="meetingTime">
                <el-date-picker type="datetime"
                                v-model="meetingDetails.meetingTime"
                                placeholder="请选择会议时间"
                                size="medium"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss"
                                style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="会议安排者：" prop="meetingArranger">
                <el-input v-model="meetingDetails.meetingArranger" prefix-icon="el-icon-edit" placeholder="请输入会议安排者" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="会议参加者：" prop="meetingParticipant">
                <el-select multiple filterable v-model="meetingDetails.meetingParticipant" placeholder="请选择会议参加者" size="medium" style="width: 100%">
                  <el-option
                      v-for="item in participantOptions"
                      :key="item.staffAccount"
                      :label="item.staffAccount"
                      :value="item.staffAccount">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">新 增</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改会议安排" :visible.sync="editDialogVisible" width="60%">
      <div>
        <el-form ref="editMeetingForm" :model="editMeetingDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="会议主题：" prop="meetingTheme">
                <el-input autosize type="textarea" v-model="editMeetingDetails.meetingTheme" prefix-icon="el-icon-edit" placeholder="请输入会议主题" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="会议详情：" prop="meetingDetails">
                <el-input autosize type="textarea" v-model="editMeetingDetails.meetingDetails" prefix-icon="el-icon-edit" placeholder="请输入会议详情" size="medium"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="会议类型：" prop="meetingType">
                <el-select v-model="editMeetingDetails.meetingType" placeholder="请选择会议类型" size="medium" style="width: 100%;">
                  <el-option
                      v-for="item in meetingTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="会议时间：" prop="meetingTime">
                <el-date-picker type="datetime"
                                v-model="editMeetingDetails.meetingTime"
                                placeholder="请选择会议时间"
                                size="medium"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss"
                                style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="会议安排者：" prop="meetingArranger">
                <el-input v-model="editMeetingDetails.meetingArranger" prefix-icon="el-icon-edit" placeholder="请输入会议安排者" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="会议参加者：" prop="meetingParticipant">
                <el-select multiple filterable v-model="editMeetingDetails.meetingParticipant" placeholder="请选择会议参加者" size="medium" style="width: 100%">
                  <el-option
                      v-for="item in participantOptions"
                      :key="item.staffAccount"
                      :label="item.staffAccount"
                      :value="item.staffAccount">
                  </el-option>
                </el-select>
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
  name: "MeetingManage",
  data(){
    return{
      meetingInfo:[],
      searchResult:[],
      searchTheme:'',
      loading:false,
      dialogTableVisible:false,
      loadingSearchResult:false,
      addDialogVisible:false,
      editDialogVisible:false,
      total:0,
      pageSize:8,
      currentPage:1,
      rules:{
        meetingArranger:[{required:true,message:'会议安排者不能为空',trigger:'blur'}],
        meetingTheme:[{required:true,message:'会议主题不能为空',trigger:'blur'}],
        meetingDetails:[{required:true,message:'会议详情不能为空',trigger:'blur'}],
        meetingType:[{required:true,message:'会议类型不能为空',trigger:'blur'}],
        meetingTime:[{required:true,message:'会议时间不能为空',trigger:'blur'}],
        meetingParticipant:[{required:true,message:'会议参加者不能为空',trigger:'blur'}]
      },
      editMeetingDetails:{
        meetingId:0,
        meetingArranger:'',
        meetingTheme:'',
        meetingDetails:'',
        meetingType:'',
        meetingTime:'',
        meetingParticipant:''
      },
      meetingDetails:{
        meetingArranger:'',
        meetingTheme:'',
        meetingDetails:'',
        meetingType:'',
        meetingTime:'',
        meetingParticipant:''
      },
      meetingTypeOptions:[{
        value: '小组会议',
        label: '小组会议'
      }, {
        value: '车队会议',
        label: '车队会议'
      }, {
        value: '员工大会',
        label: '员工大会'
      }, {
        value: '团委会议',
        label: '团委会议'
      }, {
        value: '党委会议',
        label: '党委会议'
      }, {
        value: '团员大会',
        label: '团员大会'
      }, {
        value: '党员大会',
        label: '党员大会'
      },{
        value: '管理层会议',
        label: '管理层会议'
      }],
      participantOptions:{
        staffAccount:''
      }
    }
  },
  mounted() {
    this.initMeetingInfo();
    this.gainStaffInfo();
  },
  methods:{
    showEditMenu(data){
      this.editMeetingDetails.meetingId = data.meetingId;
      this.editMeetingDetails.meetingTheme = data.meetingTheme;
      this.editMeetingDetails.meetingDetails = data.meetingDetails;
      this.editMeetingDetails.meetingType = data.meetingType;
      this.editMeetingDetails.meetingTime = data.meetingTime;
      this.editMeetingDetails.meetingArranger = data.meetingArranger;
      this.editMeetingDetails.meetingParticipant = '';
      this.editDialogVisible = true;
    },
    showAddMenu(){
      this.addDialogVisible = true;
      this.meetingDetails.meetingArranger = window.sessionStorage.getItem('loginAdmin');
      this.$refs['addMeetingForm'].resetFields();
    },
    deleteMeeting(data){
      this.$confirm('此操作将永久删除该会议信息，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/meeting?id='+ data.meetingId).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该会议信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.initMeetingInfo();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    deleteMeetingSearch(data){
      this.$confirm('此操作将永久删除该会议信息，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/meeting?id='+ data.meetingId).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该会议信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.dialogTableVisible = false;
            this.initMeetingInfo();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    submitAdd(){
      this.$refs['addMeetingForm'].validate(valid=>{
        if (valid) {
          postRequest('/meeting',this.meetingDetails).then(resp=>{
            if (resp) {
              this.addDialogVisible = false;
              this.$notify({
                title: '新增成功',
                message: '该会议信息已添加至系统！',
                type: 'success',
                duration: 3000
              });
              this.initMeetingInfo();
              this.$refs['addMeetingForm'].resetFields();
            }
          })
        }
      })
    },
    submitEdit(){
      this.$refs['editMeetingForm'].validate(valid=>{
        if (valid) {
          putRequest('/meeting?meetingId='+this.editMeetingDetails.meetingId
              +'&meetingTheme='+this.editMeetingDetails.meetingTheme
              +'&meetingDetails='+this.editMeetingDetails.meetingDetails
              +'&meetingType='+this.editMeetingDetails.meetingType
              +'&meetingTime='+this.editMeetingDetails.meetingTime
              +'&meetingParticipant='+this.editMeetingDetails.meetingParticipant).then(resp=>{
                if (resp) {
                  this.editDialogVisible = false;
                  this.$notify({
                    title: '修改成功',
                    message: '该会议信息已修改成功！',
                    type: 'success',
                    duration: 3000
                  });
                  this.dialogTableVisible = false;
                  this.initMeetingInfo();
                }
          })
        }
      })
    },
    currentChange(currentPage){
      this.currentPage = currentPage;
      this.initMeetingInfo();
    },
    sizeChange(pageSize){
      this.pageSize = pageSize;
      this.initMeetingInfo();
    },
    initMeetingInfo(){
      this.loading = true;
      getRequest('/meeting/list?pageNum='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
        this.loading = false;
        if (resp) {
          this.meetingInfo = resp.list;
          this.total = resp.total;
        }
      })
    },
    searchMeetingByTheme(){
      this.loadingSearchResult = true;
      this.searchResult = [];
      getRequest('/meeting/queryByTheme?meetingTheme='+this.searchTheme).then(resp=>{
        this.loadingSearchResult = false;
        this.dialogTableVisible = true;
        if (resp) {
          this.searchResult = resp;
        }
      })
    },
    gainStaffInfo(){
      getRequest('/staff/gainStaffInfo').then(resp=>{
        if (resp) {
          this.participantOptions = resp;
        }
      })
    }
  }
}
</script>
