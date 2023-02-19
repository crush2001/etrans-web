<template>
  <div>
    <div>
      <h2>员工账号{{ ownAccount }}，欢迎您登录E-Trans协同办公系统！</h2>
    </div>
    <div style="display: flex">
      <el-card class="box-card" style="width:800px;margin-top: 15px">
        <div slot="header" class="clearfix" style="text-align: center">
          <span>{{ loginStaffDetails.staffTrueName }}</span>
        </div>
        <div>
          <div style="margin-bottom: 8px">
            员工账号：<el-tag>{{ loginStaffDetails.staffAccount }}</el-tag>
          </div>
          <div style="margin-bottom: 8px">
            员工姓名：<el-tag>{{ loginStaffDetails.staffTrueName }}</el-tag>
          </div>
          <div style="margin-bottom: 8px">
            员工职位：
            <span v-if="loginStaffDetails.staffPosition === '司机'">
              <el-tag effect="plain" type="success">{{ loginStaffDetails.staffPosition }}</el-tag>
            </span>
            <span v-else-if="loginStaffDetails.staffPosition === '车队副队长'">
              <el-tag effect="plain" type="primary">{{ loginStaffDetails.staffPosition }}</el-tag>
            </span>
            <span v-else-if="loginStaffDetails.staffPosition === '车队队长'">
              <el-tag effect="plain" type="info">{{ loginStaffDetails.staffPosition }}</el-tag>
            </span>
            <span v-else-if="loginStaffDetails.staffPosition === '副主管'">
              <el-tag effect="plain" type="warning">{{ loginStaffDetails.staffPosition }}</el-tag>
            </span>
            <span v-else-if="loginStaffDetails.staffPosition === '主管'">
              <el-tag effect="plain" type="danger">{{ loginStaffDetails.staffPosition }}</el-tag>
            </span>
          </div>
          <div style="margin-bottom: 8px">
            员工手机号：<el-tag>{{ loginStaffDetails.staffPhoneNumber }}</el-tag>
          </div>
          <div style="margin-bottom: 8px">
            员工身份证号：<el-tag>{{ loginStaffDetails.staffIdNumber }}</el-tag>
          </div>
          <div style="margin-bottom: 8px">
            员工性别：
            <span v-if="loginStaffDetails.staffGender === true">
              <el-tag effect="dark" type="primary">男</el-tag>
            </span>
            <span v-else-if="loginStaffDetails.staffGender === false">
              <el-tag effect="dark" type="warning">女</el-tag>
            </span>
          </div>
          <div style="margin-bottom: 8px">
            员工出生日期：<el-tag>{{ loginStaffDetails.staffBirthday | dateFormat("YYYY年M月D日") }}</el-tag>
          </div>
          <div style="margin-bottom: 8px">
            员工家庭住址：<el-tag>{{ loginStaffDetails.staffAddress }}</el-tag>
          </div>
          <div style="margin-bottom: 8px">
            员工入职时间：<el-tag>{{ loginStaffDetails.staffJoinDate | dateFormat("YYYY年M月D日 HH:mm:ss") }}</el-tag>
          </div>
          <div style="margin-bottom: 8px">
            员工当前状态：
            <span v-if="loginStaffDetails.staffStatus === '在职'">
              <el-tag type="success" effect="dark">{{ loginStaffDetails.staffStatus }}</el-tag>
            </span>
            <span v-else-if="loginStaffDetails.staffStatus === '空闲'">
              <el-tag type="info" effect="dark">{{ loginStaffDetails.staffStatus }}</el-tag>
            </span>
            <span v-else-if="loginStaffDetails.staffStatus === '休假'">
              <el-tag type="danger" effect="dark">{{ loginStaffDetails.staffStatus }}</el-tag>
            </span>
          </div>
          <div style="display: flex; justify-content: space-around; margin-top: 15px;">
            <el-button @click="displayEditMenu" type="primary">修改信息</el-button>
            <el-button @click="displayEditPasswordMenu" type="danger">修改密码</el-button>
          </div>
        </div>
      </el-card>
      <div style="margin-left: 15px;width: 100%">
        <div>
          <h1>我的车辆：</h1>
          <div>
            <el-table
                :data="driverVehicleInfo"
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
                <template slot-scope="scope">
                  <span v-if="scope.row.vehicleStatus === '正常'">
                    <el-tag effect="plain" type="success">{{scope.row.vehicleStatus}}</el-tag>
                  </span>
                  <span v-else-if="scope.row.vehicleStatus === '故障'">
                    <el-tag effect="plain" type="danger">{{scope.row.vehicleStatus}}</el-tag>
                  </span>
                  <span v-else-if="scope.row.vehicleStatus === '检修'">
                    <el-tag effect="plain" type="info">{{scope.row.vehicleStatus}}</el-tag>
                  </span>
                </template>
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
            </el-table>
          </div>
        </div>
        <div style="margin-top: 15px">
          <h1>我的线路：</h1>
          <div>
            <el-table
                :data="driverRouteInfo"
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
            </el-table>
          </div>
        </div>
        <div style="margin-top: 15px">
          <h1>今日排班：</h1>
          <div>
            <el-table
                :data="driverScheduleInfo"
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
      </div>
    </div>
    <el-dialog
        title="修改个人信息"
        width="30%"
        :visible.sync="showEditInfoMenu">
      <div>
        <el-form ref="changeInfoForm" :model="staffDetailInfo" :rules="infoRules">
          <el-form-item label="员工账号：" prop="staffAccount">
            <el-input type="text" auto-complete="false" v-model="staffDetailInfo.staffAccount" width="100%" placeholder="请输入员工账号" disabled size="medium"></el-input>
          </el-form-item>
          <el-form-item label="员工姓名：" prop="staffTrueName">
            <el-input type="text" auto-complete="false" v-model="staffDetailInfo.staffTrueName" width="100%" placeholder="请输入员工姓名" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="员工手机：" prop="staffPhoneNumber">
            <el-input type="text" auto-complete="false" v-model="staffDetailInfo.staffPhoneNumber" width="100%" placeholder="请输入员工手机" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：" prop="staffIdNumber">
            <el-input type="text" auto-complete="false" v-model="staffDetailInfo.staffIdNumber" width="100%" placeholder="请输入身份证号" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="员工性别：" prop="staffGender" size="medium">
            <el-radio-group v-model="staffDetailInfo.staffGender" style="margin-top: 10px">
              <el-radio :label="true">男</el-radio>
              <el-radio :label="false">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="家庭住址：" prop="staffAddress">
            <el-input type="text" auto-complete="false" v-model="staffDetailInfo.staffAddress" width="100%" placeholder="请输入家庭住址" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="出生日期：" prop="staffBirthday" size="medium" style="width: 100%">
            <el-date-picker
                v-model="staffDetailInfo.staffBirthday"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="请选择员工出生日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditInfoMenu = false">取消</el-button>
        <el-button @click="submitEditDetail" type="primary">修改</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="修改个人密码"
        width="30%"
        :visible.sync="showChangePasswordMenu">
      <div>
        <el-form ref="changePasswordForm" :model="staffPasswdInfo" :rules="passwdRules">
          <el-form-item label="员工账号：" prop="staffAccount">
            <el-input type="text" auto-complete="false" v-model="staffPasswdInfo.staffAccount" width="100%" placeholder="员工账号" disabled></el-input>
          </el-form-item>
          <el-form-item label="新员工密码：" prop="staffPassword">
            <el-input type="password" auto-complete="false" v-model="staffPasswdInfo.staffPassword" width="100%" placeholder="新员工密码"></el-input>
          </el-form-item>
          <el-form-item label="再次输入新密码：" prop="staffPasswordTwice">
            <el-input type="password" auto-complete="false" v-model="staffPasswdInfo.staffPasswordTwice" width="100%" placeholder="再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showChangePasswordMenu = false">取消</el-button>
        <el-button @click="submitEditPassword" type="primary">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest, putRequest} from "@/utils/api";

export default {
  name: "MyInfo",
  data(){
    let validatePasswd2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新员工密码'))
      }else if (value !== this.staffPasswdInfo.staffPassword) {
        callback(new Error('两次输入的密码不一致'))
      }else {
        callback()
      }
    }
    return{
      ownAccount:'',
      ownRoute:[],
      ownRouteStr:'',
      ownSchedule:[],
      ownScheduleStr:'',
      loginStaffDetails:[],
      driverVehicleInfo:[],
      driverRouteInfo:[],
      driverScheduleInfo:[],
      showEditInfoMenu:false,
      showChangePasswordMenu:false,
      staffPasswdInfo:{
        staffAccount: '',
        staffPassword: '',
        staffPasswordTwice:''
      },
      staffDetailInfo:{
        staffAccount: '',
        staffTrueName: '',
        staffPhoneNumber: '',
        staffIdNumber: '',
        staffGender: true,
        staffBirthday: '',
        staffAddress: '',
      },
      passwdRules:{
        staffAccount:[{required:true,message:'员工账号不能为空',trigger:'blur'}],
        staffPassword:[{required:true,message:'员工密码不能为空',trigger:'blur'}],
        staffPasswordTwice:[{required:true,validator:validatePasswd2,trigger:'blur'}]
      },
      infoRules:{
        staffAccount:[{required:true,message:'员工账号不能为空',trigger:'blur'}],
        staffTrueName:[{required:true,message:'员工姓名不能为空',trigger:'blur'}],
        staffPhoneNumber:[
          {required:true,message:'员工手机不能为空',trigger:'blur'},
          {pattern:/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,message:'员工手机号码格式不正确',trigger:'blur'}
        ],
        staffIdNumber:[
          {required:true,message:'身份证号不能为空',trigger:'blur'},
          {pattern:/^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[\d|X|x]$/,message:'身份证号格式不正确',trigger:'blur'}
        ],
        staffGender:[{required:true,message:'员工性别不能为空',trigger:'blur'}],
        staffBirthday:[{required:true,message:'出生日期不能为空',trigger:'blur'}],
        staffAddress:[{required:true,message:'家庭住址不能为空',trigger:'blur'}],
      }
    }
  },
  mounted() {
    this.initLoginStaff();
  },
  methods:{
    initLoginStaff(){
      let loginStaffToken = window.sessionStorage.getItem("token");
      getRequest('/staff/getLoginId',{"token":loginStaffToken}).then(resp=>{
        this.ownAccount = resp.data;
        this.staffPasswdInfo.staffAccount = resp.data;
        this.staffDetailInfo.staffAccount = resp.data;
        this.initLoginStaffInfo();
        this.initDriverVehicleInfo();
      });
    },
    initLoginStaffInfo(){
      getRequest('/staff/'+this.ownAccount).then(resp=>{
        if (resp) {
          this.loginStaffDetails = resp;
        }
      })
    },
    displayEditMenu(){
      this.showEditInfoMenu = true;
      this.staffDetailInfo.staffTrueName = this.loginStaffDetails.staffTrueName;
      this.staffDetailInfo.staffPosition = this.loginStaffDetails.staffPosition;
      this.staffDetailInfo.staffPhoneNumber = this.loginStaffDetails.staffPhoneNumber;
      this.staffDetailInfo.staffIdNumber = this.loginStaffDetails.staffIdNumber;
      this.staffDetailInfo.staffGender = this.loginStaffDetails.staffGender;
      this.staffDetailInfo.staffBirthday = this.loginStaffDetails.staffBirthday;
      this.staffDetailInfo.staffAddress = this.loginStaffDetails.staffAddress;
    },
    displayEditPasswordMenu(){
      this.showChangePasswordMenu = true;
      this.staffPasswdInfo.staffPassword = '';
      this.staffPasswdInfo.staffPasswordTwice = '';
    },
    submitEditDetail(){
      this.$refs['changeInfoForm'].validate(valid=>{
        if (valid) {
          putRequest('/staff?staffAccount='+this.staffDetailInfo.staffAccount
              +'&staffTrueName='+this.staffDetailInfo.staffTrueName
              +'&staffGender='+this.staffDetailInfo.staffGender
              +'&staffAddress='+this.staffDetailInfo.staffAddress
              +'&staffPosition='+this.staffDetailInfo.staffPosition
              +'&staffPhoneNumber='+this.staffDetailInfo.staffPhoneNumber
              +'&staffIdNumber='+this.staffDetailInfo.staffIdNumber
              +'&staffBirthday='+this.staffDetailInfo.staffBirthday).then(resp=>{
                if (resp) {
                  this.showEditInfoMenu = false;
                  this.$notify({
                    title: '修改成功',
                    message: '修改个人资料成功！',
                    type: 'success',
                    duration: 3000
                  });
                  this.initLoginStaff();
                  this.initLoginStaffInfo();
                }
          })
        }
      })
    },
    submitEditPassword(){
      this.$refs['changePasswordForm'].validate(valid=>{
        if (valid) {
          let pwdMD5 = this.$md5(this.staffPasswdInfo.staffPassword);
          this.staffPasswdInfo.staffPassword = pwdMD5;
          putRequest('/staff?staffAccount='+this.staffPasswdInfo.staffAccount+'&staffPassword='+this.staffPasswdInfo.staffPassword).then(resp=>{
            if (resp) {
              this.showChangePasswordMenu = false;
              this.$notify({
                title: '修改成功',
                message: '该员工密码已修改成功，请重新登录！',
                type: 'success',
                duration: 3000
              });
              this.$router.replace('/');
            }
          })
        }
      })
    },
    initDriverVehicleInfo(){
      getRequest('/vehicle/queryVehicleByDriver?vehicleDriver='+this.ownAccount).then(resp=>{
        if (resp) {
          this.driverVehicleInfo = resp;
          resp.forEach(item => {
            this.ownRoute.push(item.vehicleRoute);
          })
          this.ownRouteStr = this.ownRoute.toString();
          this.initDriverRouteInfo();

          resp.forEach(item => {
            this.ownSchedule.push(item.vehiclePlateNumber);
          })
          this.ownScheduleStr = this.ownSchedule.toString();
          this.initDriverScheduleInfo();
        }
      })
    },
    initDriverRouteInfo(){
      getRequest('/route/queryDriverRoute?routeNumber='+this.ownRouteStr).then(resp=>{
        if (resp) {
          this.driverRouteInfo = resp;
        }
      })
    },
    initDriverScheduleInfo(){
      getRequest('/schedule/queryDriverSchedule?scheduledBus='+this.ownScheduleStr).then(resp=>{
        if (resp) {
          this.driverScheduleInfo = resp;
        }
      })
    }
  }
}
</script>
