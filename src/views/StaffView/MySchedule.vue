<template>
  <div>
    <div style="margin-top: 15px">
      <h1><i class="el-icon-document-checked"></i> 已完成班次：</h1>
      <el-table
          height="300"
          :data="myRecentScheduleData"
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
      </el-table>
    </div>
    <div style="margin-top: 15px">
      <h1><i class="el-icon-document-add"></i> 今日及未来班次：</h1>
      <el-table
          height="300"
          :data="myFutureScheduleData"
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
      </el-table>
    </div>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  name: "MySchedule",
  data(){
    return{
      myRecentScheduleData:[],
      myFutureScheduleData:[],
      loginAccount:'',
      driverVehicle:[],
      myOwnSchedule:[],
      myOwnScheduleStr:''
    }
  },
  mounted() {
    this.initLoginStaffAccount();
  },
  methods:{
    initLoginStaffAccount() {
      let loginStaffToken = window.sessionStorage.getItem('token');
      getRequest('/staff/getLoginId',{"token":loginStaffToken}).then(resp=>{
        this.loginAccount = resp.data;
        //console.log(this.loginAccount);
        this.initStaffVehicleInfo();
      })
    },
    initStaffVehicleInfo() {
      getRequest('/vehicle/queryVehicleByDriver?vehicleDriver='+this.loginAccount).then(resp=>{
        if (resp) {
          this.driverVehicle = resp;
          resp.forEach(item => {
            this.myOwnSchedule.push(item.vehiclePlateNumber);
          })
          this.myOwnScheduleStr = this.myOwnSchedule.toString();
          this.initStaffFutureScheduleInfo();
          this.initStaffRecentScheduleInfo();
        }
      })
    },
    initStaffFutureScheduleInfo() {
      getRequest('/schedule/queryFutureSchedule?scheduledBus='+this.myOwnScheduleStr).then(resp=>{
        if (resp) {
          this.myFutureScheduleData = resp;
        }
      })
    },
    initStaffRecentScheduleInfo() {
      getRequest('/schedule/queryRecentSchedule?scheduledBus='+this.myOwnScheduleStr).then(resp=>{
        if (resp) {
          this.myRecentScheduleData = resp;
        }
      })
    }
  }
}
</script>
