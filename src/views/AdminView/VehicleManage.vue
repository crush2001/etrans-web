<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between;">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询的车牌号" v-model="searchVehiclePlateNumber" clearable @keydown.enter.native="searchVehicleByPlateNum"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchVehicleByPlateNum">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initVehicleInfo" @click.native="getVehicleNum">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="65%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingVehicleSearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该车辆的信息'></el-empty>
              </template>
              <el-table-column fixed prop="vehiclePlateNumber" header-align="center" align="center" label="车辆车牌号">
                <template slot-scope="scope">
                  <el-tag>{{scope.row.vehiclePlateNumber}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="vehicleType" header-align="center" align="center" label="车辆车型"></el-table-column>
              <el-table-column prop="vehicleCapacity" header-align="center" align="center" label="车辆额定载客数">
                <template slot-scope="scope">
                  <el-tag type="success" effect="dark">{{scope.row.vehicleCapacity}}人</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="vehicleStatus" header-align="center" align="center" label="车辆状态"></el-table-column>
              <el-table-column prop="vehicleRoute" header-align="center" align="center" label="车辆所属线路">
                <template slot-scope="scope">
                  <el-tag type="info" effect="dark">{{scope.row.vehicleRoute}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="vehiclePurchaseTime" header-align="center" align="center" label="车辆购买时间">
                <template slot-scope="scope">{{scope.row.vehiclePurchaseTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
              </el-table-column>
              <el-table-column prop="vehicleDriver" header-align="center" align="center" label="车辆驾驶员账号"></el-table-column>
              <el-table-column fixed="right" width="200px" header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
                  <el-button @click="deleteVehicleSearch(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
      <div>
        <el-button type="success" icon="el-icon-plus" @click="showAddMenu">新增车辆</el-button>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="vehicleInfo"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            stripe
            style="width: 100%">
          <el-table-column
              fixed
              prop="vehiclePlateNumber"
              header-align="center"
              align="center"
              label="车辆车牌号">
            <template slot-scope="scope">
              <el-tag>{{scope.row.vehiclePlateNumber}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="vehicleType"
              header-align="center"
              align="center"
              label="车辆车型">
          </el-table-column>
          <el-table-column
              prop="vehicleCapacity"
              header-align="center"
              align="center"
              label="车辆额定载客数">
            <template slot-scope="scope">
              <el-tag type="success" effect="dark">{{scope.row.vehicleCapacity}}人</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="vehicleStatus"
              header-align="center"
              align="center"
              label="车辆状态">
          </el-table-column>
          <el-table-column
              prop="vehicleRoute"
              header-align="center"
              align="center"
              label="车辆所属线路">
            <template slot-scope="scope">
              <el-tag type="info" effect="dark">{{scope.row.vehicleRoute}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="vehiclePurchaseTime"
              header-align="center"
              align="center"
              label="车辆购买时间">
            <template slot-scope="scope">{{scope.row.vehiclePurchaseTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
          </el-table-column>
          <el-table-column
              prop="vehicleDriver"
              header-align="center"
              align="center"
              label="车辆驾驶员账号">
          </el-table-column>
          <el-table-column
              fixed="right"
              width="200px"
              header-align="center"
              align="center"
              label="操作">
            <template slot-scope="scope">
              <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
              <el-button @click="deleteVehicle(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
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
    <el-dialog title="新增班次信息" :visible.sync="addDialogVisible" width="60%">
      <div>
        <el-form ref="addVehicleForm" :model="vehicleDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="车辆车牌号：" prop="vehiclePlateNumber">
                <el-input v-model="vehicleDetails.vehiclePlateNumber" maxlength="10" show-word-limit prefix-icon="el-icon-edit" placeholder="请输入车辆车牌号" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆车型：" prop="vehicleType">
                <el-input v-model="vehicleDetails.vehicleType" prefix-icon="el-icon-edit" placeholder="请输入车辆车型" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆额定载客数：" prop="vehicleCapacity">
                <el-input-number v-model="vehicleDetails.vehicleCapacity" :min="10" :max="90"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="车辆状态：" prop="vehicleStatus">
                <el-select v-model="vehicleDetails.vehicleStatus" placeholder="请选择车辆状态" size="medium">
                  <el-option
                      v-for="item in vehicleStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆所属线路：" prop="vehicleRoute">
                <el-select v-model="vehicleDetails.vehicleRoute" filterable placeholder="请选择车辆所属线路" size="medium">
                  <el-option
                      v-for="item in routeOptions"
                      :key="item.routeNumber"
                      :label="item.routeNumber"
                      :value="item.routeNumber">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆驾驶员账号：" prop="vehicleDriver">
                <el-select v-model="vehicleDetails.vehicleDriver" filterable placeholder="请选择车辆驾驶员账号" size="medium">
                  <el-option
                      v-for="item in staffOptions"
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
    <el-dialog title="修改班次信息" :visible.sync="editDialogVisible" width="60%">
      <div>
        <el-form ref="editVehicleForm" :model="editVehicleDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="车辆车牌号（不可修改）：" prop="vehiclePlateNumber">
                <el-input v-model="editVehicleDetails.vehiclePlateNumber" maxlength="10" show-word-limit prefix-icon="el-icon-edit" placeholder="请输入车辆车牌号" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆车型：" prop="vehicleType">
                <el-input v-model="editVehicleDetails.vehicleType" prefix-icon="el-icon-edit" placeholder="请输入车辆车型" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆额定载客数：" prop="vehicleCapacity">
                <el-input-number v-model="editVehicleDetails.vehicleCapacity" :min="10" :max="90"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="车辆状态：" prop="vehicleStatus">
                <el-select v-model="editVehicleDetails.vehicleStatus" placeholder="请选择车辆状态" size="medium">
                  <el-option
                      v-for="item in vehicleStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆所属线路：" prop="vehicleRoute">
                <el-select v-model="editVehicleDetails.vehicleRoute" filterable placeholder="请选择车辆所属线路" size="medium">
                  <el-option
                      v-for="item in routeOptions"
                      :key="item.routeNumber"
                      :label="item.routeNumber"
                      :value="item.routeNumber">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆驾驶员账号：" prop="vehicleDriver">
                <el-select v-model="editVehicleDetails.vehicleDriver" filterable placeholder="请选择车辆驾驶员账号" size="medium">
                  <el-option
                      v-for="item in staffOptions"
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
  name: "VehicleManage",
  data(){
    return{
      vehicleInfo:[],
      searchResult:[],
      total:0,
      pageSize:10,
      currentPage:1,
      loading:false,
      dialogTableVisible:false,
      loadingVehicleSearchResult:false,
      addDialogVisible:false,
      editDialogVisible:false,
      searchVehiclePlateNumber:'',
      vehicleDetails:{
        vehiclePlateNumber:'',
        vehicleType:'',
        vehicleCapacity:0,
        vehicleStatus:'',
        vehicleRoute:'',
        vehicleDriver:''
      },
      editVehicleDetails:{
        vehiclePlateNumber:'',
        vehicleType:'',
        vehicleCapacity:0,
        vehicleStatus:'',
        vehicleRoute:'',
        vehicleDriver:''
      },
      rules:{
        vehiclePlateNumber:[{required:true,message:'车辆车牌号不能为空',trigger:'blur'}],
        vehicleType:[{required:true,message:'车辆车型不能为空',trigger:'blur'}],
        vehicleCapacity:[{required:true,message:'车辆额定载客数不能为空',trigger:'blur'}],
        vehicleStatus:[{required:true,message:'车辆状态不能为空',trigger:'blur'}],
        vehicleRoute:[{required:true,message:'车辆所属线路不能为空',trigger:'blur'}],
        vehicleDriver:[{required:true,message:'车辆驾驶员账号不能为空',trigger:'blur'}],
      },
      routeOptions:{
        routeNumber:''
      },
      staffOptions:{
        staffAccount:''
      },
      vehicleStatusOptions:[{
        value: '正常',
        label: '正常'
      }, {
        value: '检修',
        label: '检修'
      }, {
        value: '故障',
        label: '故障'
      }]
    }
  },
  mounted() {
    this.initVehicleInfo();
    this.getVehicleNum();
    this.gainRouteInfo();
    this.gainStaffInfo();
  },
  methods:{
    showEditMenu(data) {
      this.editVehicleDetails.vehiclePlateNumber = data.vehiclePlateNumber;
      this.editVehicleDetails.vehicleType = data.vehicleType;
      this.editVehicleDetails.vehicleCapacity = data.vehicleCapacity;
      this.editVehicleDetails.vehicleStatus = data.vehicleStatus;
      this.editVehicleDetails.vehicleRoute = data.vehicleRoute;
      this.editVehicleDetails.vehicleDriver = data.vehicleDriver;
      this.editDialogVisible = true;
    },
    showAddMenu(){
      this.addDialogVisible = true;
      this.$refs['addVehicleForm'].resetFields();
    },
    deleteVehicle(data){
      this.$confirm('此操作将永久删除该车辆，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/vehicle?id='+ data.vehiclePlateNumber).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该车辆信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.initVehicleInfo();
            this.getVehicleNum();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    deleteVehicleSearch(data){
      this.$confirm('此操作将永久删除该车辆，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/vehicle?id='+ data.vehiclePlateNumber).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该车辆信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.dialogTableVisible = false;
            this.initVehicleInfo();
            this.getVehicleNum();
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
      this.$refs['addVehicleForm'].validate(valid=>{
        if (valid) {
          postRequest('/vehicle',this.vehicleDetails).then(resp=>{
            if (resp) {
              this.addDialogVisible = false;
              this.$notify({
                title: '新增成功',
                message: '该车辆信息已添加至系统！',
                type: 'success',
                duration: 3000
              });
              this.getVehicleNum();
              this.initVehicleInfo();
              this.$refs['addVehicleForm'].resetFields();
            }
          })
        }
      })
    },
    submitEdit(){
      this.$refs['editVehicleForm'].validate(valid=>{
        if (valid) {
          putRequest('/vehicle?vehiclePlateNumber='+this.editVehicleDetails.vehiclePlateNumber
              +'&vehicleType='+this.editVehicleDetails.vehicleType
              +'&vehicleCapacity='+this.editVehicleDetails.vehicleCapacity
              +'&vehicleStatus='+this.editVehicleDetails.vehicleStatus
              +'&vehicleRoute='+this.editVehicleDetails.vehicleRoute
              +'&vehicleDriver='+this.editVehicleDetails.vehicleDriver).then(resp=>{
            if (resp) {
              this.editDialogVisible = false;
              this.$notify({
                title: '修改成功',
                message: '该车辆信息已修改成功！',
                type: 'success',
                duration: 3000
              });
              this.dialogTableVisible = false;
              this.getVehicleNum();
              this.initVehicleInfo();
            }
          })
        }
      })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initVehicleInfo();
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initVehicleInfo();
    },
    initVehicleInfo(){
      this.loading = true;
      getRequest('/vehicle/list?pageNum='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
        this.loading = false;
        if (resp) {
          this.vehicleInfo = resp.list;
        }
      })
    },
    searchVehicleByPlateNum(){
      this.loadingVehicleSearchResult = true;
      this.searchResult = [];
      getRequest('/vehicle/search?vehiclePlateNumber='+this.searchVehiclePlateNumber).then(resp=>{
        this.loadingVehicleSearchResult = false;
        this.dialogTableVisible = true;
        if (resp) {
          this.searchResult = resp;
        }
      })
    },
    getVehicleNum(){
      getRequest('/vehicle/count').then(resp=>{
        this.total = resp;
      })
    },
    gainRouteInfo(){
      getRequest('/route/gainRouteInfo').then(resp=>{
        if (resp) {
          this.routeOptions = resp;
        }
      })
    },
    gainStaffInfo(){
      getRequest('/staff/gainStaffInfo').then(resp=>{
        if (resp) {
          this.staffOptions = resp;
        }
      })
    }
  }
}
</script>
