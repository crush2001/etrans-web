<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询的线路号" v-model="searchRouteNumber" clearable @keydown.enter.native="searchRouteByNumber"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchRouteByNumber">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initRouteInfo" @click.native="getRouteNum">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="65%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingRouteSearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该线路的信息'></el-empty>
              </template>
              <el-table-column fixed prop="routeNumber" header-align="center" label="线路号" align="center">
                <template slot-scope="scope">
                  <el-tag type="info" effect="dark">{{scope.row.routeNumber}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="routeStartingStation" header-align="center" label="线路起点站" align="center"></el-table-column>
              <el-table-column prop="routeTerminalStation" header-align="center" label="线路终点站" align="center"></el-table-column>
              <el-table-column prop="routeStations" header-align="center" label="线路途径车站" align="center"></el-table-column>
              <el-table-column prop="routeStartingTime" header-align="center" label="线路常规首班时间" align="center"></el-table-column>
              <el-table-column prop="routeTerminalTime" header-align="center" label="线路常规末班时间" align="center"></el-table-column>
              <el-table-column prop="routeOpenupDate" header-align="center" label="线路开通日期" align="center">
                <template slot-scope="scope">{{scope.row.routeOpenupDate | dateFormat("YYYY年M月D日")}}</template>
              </el-table-column>
              <el-table-column fixed="right" header-align="center" width="200px" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
                  <el-button @click="deleteRouteSearch(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
      <div>
        <el-button @click="showAddMenu" type="success" icon="el-icon-plus">新增线路</el-button>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="routeInfo"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            stripe
            style="width: 100%">
          <el-table-column
              fixed
              prop="routeNumber"
              header-align="center"
              label="线路号"
              align="center">
            <template slot-scope="scope">
              <el-tag type="info" effect="dark">{{scope.row.routeNumber}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="routeStartingStation"
              header-align="center"
              label="线路起点站"
              align="center">
          </el-table-column>
          <el-table-column
              prop="routeTerminalStation"
              header-align="center"
              label="线路终点站"
              align="center">
          </el-table-column>
          <el-table-column
              prop="routeStations"
              header-align="center"
              label="线路途径车站"
              align="center">
          </el-table-column>
          <el-table-column
              prop="routeStartingTime"
              header-align="center"
              label="线路常规首班时间"
              align="center">
          </el-table-column>
          <el-table-column
              prop="routeTerminalTime"
              header-align="center"
              label="线路常规末班时间"
              align="center">
          </el-table-column>
          <el-table-column
              prop="routeOpenupDate"
              header-align="center"
              label="线路开通日期"
              align="center">
            <template slot-scope="scope">{{scope.row.routeOpenupDate | dateFormat("YYYY年M月D日")}}</template>
          </el-table-column>
          <el-table-column
              fixed="right"
              header-align="center"
              width="200px"
              label="操作"
              align="center">
            <template slot-scope="scope">
              <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
              <el-button @click="deleteRoute(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
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
    <el-dialog title="新增线路信息" :visible.sync="addDialogVisible" width="60%">
      <div>
        <el-form ref="addRouteForm" :model="routeDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="线路号：" prop="routeNumber">
                <el-input v-model="routeDetails.routeNumber" prefix-icon="el-icon-edit" placeholder="请输入线路号" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="线路起点站：" prop="routeStartingStation">
                <el-select v-model="routeDetails.routeStartingStation" filterable placeholder="请选择线路起点站" size="medium">
                  <el-option
                      v-for="item in stationOptions"
                      :key="item.stationName"
                      :label="item.stationName"
                      :value="item.stationName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="线路终点站：" prop="routeTerminalStation">
                <el-select v-model="routeDetails.routeTerminalStation" filterable placeholder="请选择线路起点站" size="medium">
                  <el-option
                      v-for="item in stationOptions"
                      :key="item.stationName"
                      :label="item.stationName"
                      :value="item.stationName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="线路途径车站：" prop="routeStations">
                <el-select multiple v-model="routeDetails.routeStations" filterable placeholder="请选择线路起点站" size="medium" style="width: 100%">
                  <el-option
                      v-for="item in stationOptions"
                      :key="item.stationName"
                      :label="item.stationName"
                      :value="item.stationName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="线路首班时间：" prop="routeStartingTime">
                <el-time-select
                    v-model="routeDetails.routeStartingTime"
                    value-format="HH:mm"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30'
                    }"
                    placeholder="请选择线路首班时间">
                </el-time-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="线路末班时间：" prop="routeTerminalTime">
                <el-time-select
                    v-model="routeDetails.routeTerminalTime"
                    value-format="HH:mm"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30'
                    }"
                    placeholder="请选择线路末班时间">
                </el-time-select>
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
    <el-dialog title="修改线路信息" :visible.sync="editDialogVisible" width="60%">
      <div>
        <el-form ref="editRouteForm" :model="editRouteDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="线路号：" prop="routeNumber">
                <el-input v-model="editRouteDetails.routeNumber" prefix-icon="el-icon-edit" placeholder="请输入线路号" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="线路起点站：" prop="routeStartingStation">
                <el-select v-model="editRouteDetails.routeStartingStation" filterable placeholder="请选择线路起点站" size="medium">
                  <el-option
                      v-for="item in stationOptions"
                      :key="item.stationName"
                      :label="item.stationName"
                      :value="item.stationName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="线路终点站：" prop="routeTerminalStation">
                <el-select v-model="editRouteDetails.routeTerminalStation" filterable placeholder="请选择线路起点站" size="medium">
                  <el-option
                      v-for="item in stationOptions"
                      :key="item.stationName"
                      :label="item.stationName"
                      :value="item.stationName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="线路途径车站：" prop="routeStations">
                <el-select multiple v-model="editRouteDetails.routeStations" filterable placeholder="请选择线路起点站" size="medium" style="width: 100%">
                  <el-option
                      v-for="item in stationOptions"
                      :key="item.stationName"
                      :label="item.stationName"
                      :value="item.stationName">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="线路首班时间：" prop="routeStartingTime">
                <el-time-select
                    v-model="editRouteDetails.routeStartingTime"
                    value-format="HH:mm"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30'
                    }"
                    placeholder="请选择线路首班时间">
                </el-time-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="线路末班时间：" prop="routeTerminalTime">
                <el-time-select
                    v-model="editRouteDetails.routeTerminalTime"
                    value-format="HH:mm"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30'
                    }"
                    placeholder="请选择线路末班时间">
                </el-time-select>
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
  name: "RouteManage",
  data(){
    return{
      routeInfo:[],
      searchResult:[],
      loading:false,
      dialogTableVisible:false,
      loadingRouteSearchResult:false,
      addDialogVisible:false,
      editDialogVisible:false,
      searchRouteNumber:'',
      total:0,
      pageSize:10,
      currentPage:1,
      routeDetails:{
        routeNumber:'',
        routeStartingStation:'',
        routeTerminalStation:'',
        routeStations:'',
        routeStartingTime:'',
        routeTerminalTime:''
      },
      editRouteDetails:{
        routeNumber:'',
        routeStartingStation:'',
        routeTerminalStation:'',
        routeStations:'',
        routeStartingTime:'',
        routeTerminalTime:''
      },
      rules:{
        routeNumber:[{required:true,message:'线路号不能为空',trigger:'blur'}],
        routeStartingStation:[{required:true,message:'线路起点站不能为空',trigger:'blur'}],
        routeTerminalStation:[{required:true,message:'线路终点站不能为空',trigger:'blur'}],
        routeStations:[{required:true,message:'线路途径车站不能为空',trigger:'blur'}],
        routeStartingTime:[{required:true,message:'线路首班时间不能为空',trigger:'blur'}],
        routeTerminalTime:[{required:true,message:'线路末班时间不能为空',trigger:'blur'}]
      },
      stationOptions:{
        stationName:'测试'
      }
    }
  },
  mounted() {
    this.initRouteInfo();
    this.getRouteNum();
    this.gainStationInfo();
  },
  methods:{
    showEditMenu(data){
      this.editRouteDetails.routeNumber = data.routeNumber;
      this.editRouteDetails.routeStartingStation = data.routeStartingStation;
      this.editRouteDetails.routeTerminalStation = data.routeTerminalStation;
      this.editRouteDetails.routeStations = '';
      this.editRouteDetails.routeStartingTime = data.routeStartingTime;
      this.editRouteDetails.routeTerminalTime = data.routeTerminalTime;
      this.editDialogVisible = true;
    },
    showAddMenu(){
      this.addDialogVisible = true;
      this.$refs['addRouteForm'].resetFields();
    },
    deleteRoute(data){
      this.$confirm('此操作将永久删除该线路，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/route?id='+ data.routeNumber).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该线路信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.initRouteInfo();
            this.getRouteNum();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    deleteRouteSearch(data){
      this.$confirm('此操作将永久删除该线路，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/route?id='+ data.routeNumber).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该线路信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.dialogTableVisible = false;
            this.initRouteInfo();
            this.getRouteNum();
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
      this.$refs['addRouteForm'].validate(valid=>{
        if (valid) {
          postRequest('/route',this.routeDetails).then(resp=>{
            if (resp) {
              this.addDialogVisible = false;
              this.$notify({
                title: '新增成功',
                message: '该线路信息已添加至系统！',
                type: 'success',
                duration: 3000
              });
              this.getRouteNum();
              this.initRouteInfo();
              this.$refs['addRouteForm'].resetFields();
            }
          })
        }
      })
    },
    submitEdit(){
      this.$refs['editRouteForm'].validate(valid=>{
        if (valid) {
          putRequest('/route?routeNumber='+this.editRouteDetails.routeNumber
              +'&routeStartingStation='+this.editRouteDetails.routeStartingStation
              +'&routeTerminalStation='+this.editRouteDetails.routeTerminalStation
              +'&routeStations='+this.editRouteDetails.routeStations
              +'&routeStartingTime='+this.editRouteDetails.routeStartingTime
              +'&routeTerminalTime='+this.editRouteDetails.routeTerminalTime).then(resp=>{
                if (resp) {
                  this.editDialogVisible = false;
                  this.$notify({
                    title: '修改成功',
                    message: '该线路信息已修改成功！',
                    type: 'success',
                    duration: 3000
                  });
                  this.dialogTableVisible = false;
                  this.getRouteNum();
                  this.initRouteInfo();
                }
          })
        }
      })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initRouteInfo();
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initRouteInfo();
    },
    initRouteInfo(){
      this.loading = true;
      getRequest('/route/list?pageNum='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
        this.loading = false;
        if (resp) {
          this.routeInfo = resp.list;
        }
      })
    },
    getRouteNum(){
      getRequest('/route/count').then(resp=>{
        this.total = resp;
      })
    },
    searchRouteByNumber(){
      this.loadingRouteSearchResult = true;
      this.searchResult = [];
      getRequest('/route/search?routeNumber='+this.searchRouteNumber).then(resp=>{
        this.loadingRouteSearchResult = false;
        this.dialogTableVisible = true;
        if (resp) {
          this.searchResult = resp;
        }
      })
    },
    gainStationInfo(){
      getRequest('/station/gainStationInfo').then(resp=>{
        if (resp) {
          this.stationOptions = resp;
        }
      })
    }
  }
}
</script>
