<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between;">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询班次的车牌号" v-model="scheduledBusPlateNum" clearable @keydown.enter.native="searchScheduleByVehicle"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchScheduleByVehicle">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initScheduleInfo" @click.native="getScheduleNum">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="65%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingScheduleSearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该车辆的班次信息'></el-empty>
              </template>
              <el-table-column fixed prop="scheduledId" header-align="center" align="center" label="班次号"></el-table-column>
              <el-table-column prop="scheduledBus" header-align="center" align="center" label="车辆车牌号">
                <template slot-scope="scope">
                  <el-tag>{{scope.row.scheduledBus}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="scheduledTime" header-align="center" align="center" label="该班次的始发时间">
                <template slot-scope="scope">{{scope.row.scheduledTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
              </el-table-column>
              <el-table-column label="操作" header-align="center" align="center" fixed="right" width="100px" style="padding: 5px">
                <template slot-scope="scope">
                  <el-button @click="deleteScheduleSearch(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
      <div>
        <el-button type="success" icon="el-icon-plus" @click="showAddMenu">新增班次</el-button>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="scheduleInfo"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            stripe
            style="width: 100%">
          <el-table-column
              fixed
              prop="scheduledId"
              header-align="center"
              label="班次号"
              align="center">
          </el-table-column>
          <el-table-column
              prop="scheduledBus"
              header-align="center"
              label="车辆车牌号"
              align="center">
            <template slot-scope="scope">
              <el-tag>{{scope.row.scheduledBus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="scheduledTime"
              header-align="center"
              label="该班次的始发时间"
              align="center">
            <template slot-scope="scope">{{scope.row.scheduledTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
          </el-table-column>
          <el-table-column
              fixed="right"
              header-align="center"
              width="150px"
              label="操作"
              align="center">
            <template slot-scope="scope">
              <el-button @click="deleteSchedule(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
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
    <el-dialog title="新增班次信息" :visible.sync="addDialogVisible" width="50%">
      <div>
        <el-form ref="addScheduleForm" :model="scheduleDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="车辆车牌号：" prop="scheduledBus">
                <el-select v-model="scheduleDetails.scheduledBus" filterable placeholder="请选择车辆车牌号">
                  <el-option
                      v-for="item in options"
                      :key="item.vehiclePlateNumber"
                      :label="item.vehiclePlateNumber"
                      :value="item.vehiclePlateNumber">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="该班次的始发时间：" prop="scheduledTime">
                <el-date-picker v-model="scheduleDetails.scheduledTime"
                                type="datetime"
                                placeholder="请选择该班次的始发时间"
                                size="medium"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
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
  </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest} from "@/utils/api";

export default {
  name: "ScheduleManage",
  data(){
    return{
      scheduleInfo:[],
      scheduledBusPlateNum:'',
      searchResult:[],
      loading:false,
      dialogTableVisible:false,
      loadingScheduleSearchResult:false,
      addDialogVisible:false,
      total:0,
      pageSize:10,
      currentPage:1,
      options:{
        vehiclePlateNumber:''
      },
      scheduleDetails:{
        scheduledBus: '',
        scheduledTime: '',
        scheduledId:0
      },
      rules:{
        scheduledBus:[{required:true,message:'车辆车牌号不能为空',trigger:'blur'}],
        scheduledTime:[{required:true,message:'该班次的始发时间不能为空',trigger:'blur'}]
      }
    }
  },
  mounted() {
    this.initScheduleInfo();
    this.getScheduleNum();
    this.gainVehicleInfo();
  },
  methods:{
    showAddMenu(){
      this.addDialogVisible = true;
      this.$refs['addScheduleForm'].resetFields();
    },
    deleteSchedule(data){
      this.$confirm('此操作将永久删除该班次，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/schedule?id='+ data.scheduledId).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该班次信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.initScheduleInfo();
            this.getScheduleNum();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    deleteScheduleSearch(data){
      this.$confirm('此操作将永久删除该班次，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/schedule?id='+ data.scheduledId).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该班次信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.dialogTableVisible = false;
            this.initScheduleInfo();
            this.getScheduleNum();
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
      this.$refs['addScheduleForm'].validate(valid=>{
        if (valid) {
          postRequest('/schedule',this.scheduleDetails).then(resp=>{
            if (resp) {
              this.addDialogVisible = false;
              this.$notify({
                title: '新增成功',
                message: '该班次信息已添加至系统！',
                type: 'success',
                duration: 3000
              });
              this.getScheduleNum();
              this.initScheduleInfo();
              this.$refs['addScheduleForm'].resetFields();
            }
          })
        }
      })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initScheduleInfo();
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initScheduleInfo();
    },
    initScheduleInfo(){
      this.loading = true;
      getRequest('/schedule/list?pageNum='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
        this.loading = false;
        if (resp) {
          this.scheduleInfo = resp.list;
        }
      })
    },
    getScheduleNum(){
      getRequest('/schedule/count').then(resp=>{
        this.total = resp;
      })
    },
    searchScheduleByVehicle(){
      this.loadingScheduleSearchResult = true;
      this.searchResult = [];
      getRequest('/schedule/search?scheduledBus='+this.scheduledBusPlateNum).then(resp=>{
        this.loadingScheduleSearchResult = false;
        this.dialogTableVisible = true;
        if (resp) {
          this.searchResult = resp;
        }
      })
    },
    gainVehicleInfo(){
      getRequest('/vehicle/gainVehicleInfo').then(resp=>{
        if (resp) {
          this.options = resp;
        }
      })
    }
  }
}
</script>
