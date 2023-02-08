<template>
  <div>
    <el-container>
      <el-header class="adminHomeHeader">
        <div class="title">E-Trans协同办公系统</div>
        <div class="loginAdminInfo">
          {{ nowTime | updateTime }}
          <span>系统管理员：{{ loginAdmin }}</span>
          <el-dropdown trigger="hover" class="hoverMenu" @command="handleCommand">
            <span>
              <i class="el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-edit" command="editInfo">修改信息</el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button" command="exitLogin">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="220px">
          <el-menu router default-active="/adminHomePage">
            <el-menu-item index="/adminHomePage">
              <i class="el-icon-s-home"></i>
              <span slot="title">系统首页</span>
            </el-menu-item>
            <el-menu-item index="/staffManage">
              <i class="el-icon-s-custom"></i>
              <span slot="title">员工管理</span>
            </el-menu-item>
            <el-menu-item index="/salaryManage">
              <i class="el-icon-s-data"></i>
              <span slot="title">薪酬管理</span>
            </el-menu-item>
            <el-menu-item index="/routeManage">
              <i class="el-icon-s-promotion"></i>
              <span slot="title">线路管理</span>
            </el-menu-item>
            <el-menu-item index="/scheduleManage">
              <i class="el-icon-s-order"></i>
              <span slot="title">班次管理</span>
            </el-menu-item>
            <el-submenu index="5">
              <template slot="title"><i class="el-icon-s-finance"></i>资产管理</template>
              <el-menu-item index="/vehicleManage">
                <i class="el-icon-truck"></i>
                <span slot="title">车辆管理</span>
              </el-menu-item>
              <el-menu-item index="/stationManage">
                <i class="el-icon-map-location"></i>
                <span slot="title">车站管理</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item index="/announcementManage">
              <i class="el-icon-message-solid"></i>
              <span slot="title">公告管理</span>
            </el-menu-item>
            <el-menu-item index="/onlineApproval">
              <i class="el-icon-s-check"></i>
              <span slot="title">在线审批</span>
            </el-menu-item>
            <el-menu-item index="/adminHelps">
              <i class="el-icon-question"></i>
              <span slot="title">帮助与关于</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb v-if="this.$router.currentRoute.path!='/adminHomePage'" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/adminHomePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <div>
      <el-dialog title="修改管理员信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="editAdminInfoForm" :model="form" :rules="rules">
          <el-form-item label="管理员账号：" prop="adminAccount">
            <el-input type="text" auto-complete="false" v-model="form.adminAccount" width="100px" placeholder="管理员账号" disabled></el-input>
          </el-form-item>
          <el-form-item label="新管理员密码：" prop="adminPassword">
            <el-input type="password" auto-complete="false" v-model="form.adminPassword" width="100px" placeholder="新管理员密码"></el-input>
          </el-form-item>
          <el-form-item label="再次输入密码：" prop="adminPasswordTwice">
            <el-input type="password" auto-complete="false" v-model="form.adminPasswordTwice" width="100px" placeholder="再次输入密码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAdminInfo">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getRequest, postRequest, putRequest} from "@/utils/api";
  import moment from "moment";
  import 'moment/locale/zh-cn';
  export default {
    name: "AdminHome",
    computed: {
      moment() {
        return moment
      }
    },
    data(){
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新管理员密码'))
        } else if (value !== this.form.adminPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      };
      return{
        dialogFormVisible:false,
        form:{
          adminAccount:'',
          adminPassword:'',
          adminPasswordTwice:''
        },
        rules:{
          adminAccount:[{required:true,message:'管理员账号不能为空',trigger:'blur'}],
          adminPassword:[{required:true,message:'管理员密码不能为空',trigger:'blur'}],
          adminPasswordTwice:[{required:true,validator:validatePass2,trigger:'blur'}]
        },
        loginAdmin:'',
        nowTime: new Date()
      }
    },
    filters:{
      updateTime: function (value) {
        return moment(value).format('YYYY年M月D日 HH:mm:ss');
      }
    },
    methods:{
      logout(){
        postRequest('/administrator/logout');
        this.$router.replace('/');
      },
      handleCommand(command) {
        if (command == "exitLogin"){
          //this.logout();
          this.$confirm('将退出登录该账户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.logout();
            this.$message({
              type: 'success',
              message: '已退出登录'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退出登录'
            });
          });
        }else if (command == "editInfo"){
          this.dialogFormVisible = true;
          this.form.adminAccount = this.loginAdmin;
          this.form.adminPassword = '';
          this.form.adminPasswordTwice = '';
        }
      },
      editAdminInfo(){
        this.$refs['editAdminInfoForm'].validate(valid=>{
          if (valid) {
            let pwdMD5 = this.$md5(this.form.adminPassword);
            this.form.adminPassword = pwdMD5;
            putRequest('/administrator?adminAccount='+this.form.adminAccount +'&adminPassword='+this.form.adminPassword).then(resp=>{
              if (resp) {
                this.dialogFormVisible = false;
                this.$notify({
                  title: '修改成功',
                  message: '该管理员信息已修改成功，请重新登录！',
                  type: 'success',
                  duration: 3000
                });
                this.$router.replace('/');
              }
            })
          }
        })
      },
      onCreate:async function() {
        let loginAdminToken = sessionStorage.getItem("token");
        console.log(loginAdminToken);
        getRequest('/administrator/getLoginId',{"token":loginAdminToken}).then(resp=>{
          console.log(JSON.stringify(resp));
          this.loginAdmin = resp.data;
          console.log(this.loginAdmin);
          window.sessionStorage.setItem('loginAdmin',this.loginAdmin);
        });
      }
    },
    mounted:function () {
      this.onCreate();
      let _this = this;
      this.timer = setInterval(() => {
        _this.nowTime = new Date();
      },1000);
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }
  }
</script>

<style>
  .adminHomeHeader{
    background: cadetblue;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .adminHomeHeader .title{
    font-size: 25px;
    font-family: 小米兰亭;
    color: white;
    font-weight: bold;
  }
  .adminHomeHeader .loginAdminInfo{
    font-size: 18px;
    font-family: 小米兰亭;
    color: white;
  }
  .adminHomeHeader .loginAdminInfo .hoverMenu{
    font-size: 18px;
    margin-left: 10px;
    color: white;
  }
  .el-container{
    height: 100vh;
  }
  .el-menu{
    height: 100%;
  }
</style>
