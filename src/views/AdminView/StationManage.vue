<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between;">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询的车站名" v-model="stationName" clearable @keydown.enter.native="searchStationByName"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchStationByName">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initStationInfo" @click.native="getStationNum">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="65%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingStationSearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该车站的信息'></el-empty>
              </template>
              <el-table-column fixed prop="stationName" header-align="center" align="center" label="车站名"></el-table-column>
              <el-table-column prop="stationInfo" header-align="center" align="center" label="车站详情"></el-table-column>
              <el-table-column prop="stationStatus" header-align="center" align="center" label="车站状态">
                <template slot-scope="scope">
                  <el-tag type="success">{{scope.row.stationStatus}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" header-align="center" align="center" fixed="right" width="100px" style="padding: 5px">
                <template slot-scope="scope">
                  <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
                  <br /><br />
                  <el-button @click="deleteStationSearch(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
      <div>
        <el-button type="success" icon="el-icon-plus" @click="showAddMenu">新增车站</el-button>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="stationInfo"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            stripe
            style="width: 100%">
          <el-table-column
              fixed
              prop="stationName"
              header-align="center"
              align="center"
              width="300"
              label="车站名">
          </el-table-column>
          <el-table-column
              prop="stationInfo"
              header-align="center"
              align="center"
              label="车站详情">
          </el-table-column>
          <el-table-column
              prop="stationStatus"
              header-align="center"
              align="center"
              width="200"
              label="车站状态">
            <template slot-scope="scope">
              <el-tag type="success">{{scope.row.stationStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="200"
              label="操作">
            <template slot-scope="scope">
              <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
              <el-button @click="deleteStation(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
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
    <el-dialog title="新增车站信息" :visible.sync="addDialogVisible" width="62%">
      <div>
        <el-form ref="addStationForm" :model="stationDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="车站名：" prop="stationName">
                <el-input v-model="stationDetails.stationName" prefix-icon="el-icon-edit" placeholder="请输入车站名" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车站详情：" prop="stationInfo">
                <el-input v-model="stationDetails.stationInfo" prefix-icon="el-icon-edit" placeholder="请输入车站详情" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车站状态：" prop="stationStatus">
                <el-select v-model="stationDetails.stationStatus" placeholder="请选择车站状态" size="medium">
                  <el-option
                      v-for="item in stationStatusOptions"
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
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">新 增</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改车站信息" :visible.sync="editDialogVisible" width="62%">
      <div>
        <el-form ref="editStationForm" :model="editStationDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="车站名（不可修改）：" prop="stationName">
                <el-input v-model="editStationDetails.stationName" prefix-icon="el-icon-edit" placeholder="请输入车站名" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车站详情：" prop="stationInfo">
                <el-input v-model="editStationDetails.stationInfo" prefix-icon="el-icon-edit" placeholder="请输入车站详情" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车站状态：" prop="stationStatus">
                <el-select v-model="editStationDetails.stationStatus" placeholder="请选择车站状态" size="medium">
                  <el-option
                      v-for="item in stationStatusOptions"
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
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest, postRequest, deleteRequest, putRequest} from "@/utils/api";

export default {
  name: "StationManage",
  data(){
    return{
      stationInfo:[],
      loading:false,
      searchResult:[],
      total:0,
      pageSize:10,
      currentPage:1,
      addDialogVisible:false,
      editDialogVisible:false,
      loadingStationSearchResult:false,
      dialogTableVisible:false,
      stationName:'',
      stationDetails:{
        stationName: '',
        stationInfo: '',
        stationStatus: ''
      },
      editStationDetails:{
        stationName: '',
        stationInfo: '',
        stationStatus: ''
      },
      rules:{
        stationName:[{required:true,message:'车站名不能为空',trigger:'blur'}],
        stationInfo:[{required:true,message:'车站详情不能为空',trigger:'blur'}],
        stationStatus:[{required:true,message:'车站状态不能为空',trigger:'blur'}],
      },
      stationStatusOptions: [{
        value: '正常',
        label: '正常'
      }, {
        value: '停用',
        label: '停用'
      }, {
        value: '维修中',
        label: '维修中'
      }, {
        value: '建设中',
        label: '建设中'
      }, {
        value: '日常维护中',
        label: '日常维护中'
      }]
    }
  },
  mounted() {
    this.initStationInfo();
    this.getStationNum();
  },
  methods:{
    showEditMenu(data) {
      this.editStationDetails.stationName = data.stationName;
      this.editStationDetails.stationInfo = data.stationInfo;
      this.editStationDetails.stationStatus = data.stationStatus;
      this.editDialogVisible = true;
    },
    showAddMenu(){
      this.addDialogVisible = true;
      this.$refs['addStationForm'].resetFields();
    },
    deleteStation(data){
      this.$confirm('此操作将永久删除车站'+ data.stationName +'，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/station?id='+ data.stationName).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该车站信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.initStationInfo();
            this.getStationNum();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    deleteStationSearch(data){
      this.$confirm('此操作将永久删除车站'+ data.stationName +'，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/station?id='+ data.stationName).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该车站信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.dialogTableVisible = false;
            this.initStationInfo();
            this.getStationNum();
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
      this.$refs['addStationForm'].validate(valid=>{
        if (valid){
          postRequest('/station',this.stationDetails).then(resp=>{
            if (resp) {
              this.addDialogVisible = false;
              this.$notify({
                title: '新增成功',
                message: '该车站信息已添加至系统！',
                type: 'success',
                duration: 3000
              });
              this.getStationNum();
              this.initStationInfo();
              this.$refs['addStationForm'].resetFields();
            }
          })
        }
      })
    },
    submitEdit(){
      this.$refs['editStationForm'].validate(valid=>{
        if (valid) {
          putRequest('/station?stationName='+this.editStationDetails.stationName
              +'&stationInfo='+this.editStationDetails.stationInfo
              +'&stationStatus='+this.editStationDetails.stationStatus).then(resp=>{
                if (resp) {
                  this.editDialogVisible = false;
                  this.$notify({
                    title: '修改成功',
                    message: '该车站信息已修改成功！',
                    type: 'success',
                    duration: 3000
                  });
                  this.dialogTableVisible = false;
                  this.getStationNum();
                  this.initStationInfo();
                }
          })
        }
      })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initStationInfo();
    },
    sizeChange(pageSize){
      this.pageSize = pageSize;
      this.initStationInfo();
    },
    initStationInfo(){
      this.loading = true;
      getRequest('/station/list?pageNum='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
        this.loading = false;
        if (resp) {
          this.stationInfo = resp.list;
        }
      })
    },
    getStationNum(){
      getRequest('/station/count').then(resp=>{
        this.total = resp;
      })
    },
    searchStationByName(){
      this.loadingStationSearchResult = true;
      this.searchResult = [];
      getRequest('/station/search?stationName='+this.stationName).then(resp=>{
        this.loadingStationSearchResult = false;
        this.dialogTableVisible = true;
        if (resp) {
          this.searchResult = resp;
        }
      })
    }
  }
}
</script>
