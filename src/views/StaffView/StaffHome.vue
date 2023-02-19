<template>
  <div>
    <el-container>
      <el-header class="staffHomeHeader">
        <div class="title">E-Trans协同办公系统</div>
        <div class="loginStaffInfo">
          {{ nowTime | updateTime }}
          <span>企业员工：{{ loginStaff }}</span>
          <el-dropdown trigger="hover" class="hoverMenu" @command="handleCommand">
            <span>
              <i class="el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-switch-button" command="exitLogin">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="220px">
          <el-menu router default-active="/personalCenter">
            <el-menu-item index="/personalCenter">
              <i class="el-icon-s-custom"></i>
              <span slot="title">个人中心</span>
            </el-menu-item>
            <el-menu-item index="/mySchedule">
              <i class="el-icon-s-cooperation"></i>
              <span slot="title">我的排班</span>
            </el-menu-item>
            <el-menu-item index="/mySalary">
              <i class="el-icon-s-finance"></i>
              <span slot="title">我的薪酬</span>
            </el-menu-item>
            <el-menu-item index="/companyAnnouncement">
              <i class="el-icon-message-solid"></i>
              <span slot="title">公司公告</span>
            </el-menu-item>
            <el-menu-item index="/myApplication">
              <i class="el-icon-s-order"></i>
              <span slot="title">我的申请</span>
            </el-menu-item>
            <el-menu-item index="/staffHelps">
              <i class="el-icon-question"></i>
              <span slot="title">帮助与关于</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb v-if="this.$router.currentRoute.path!='/staffHomePage'" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/staffHomePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import moment from "moment";
  import 'moment/locale/zh-cn'
  import {getRequest, postRequest} from "@/utils/api";
  export default {
    name: "StaffHome",
    computed: {
      moment() {
        return moment;
      }
    },
    data(){
      return{
        loginStaff:'',
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
        postRequest('/staff/logout');
        this.$router.replace('/');
      },
      handleCommand(command) {
        if (command == "exitLogin"){
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
        }
      },
      onCreate:async function() {
        let loginStaffToken = sessionStorage.getItem("token");
        console.log(loginStaffToken);
        getRequest('/staff/getLoginId',{"token":loginStaffToken}).then(resp=>{
          console.log(JSON.stringify(resp));
          this.loginStaff = resp.data;
          console.log(this.loginStaff);
          window.sessionStorage.setItem('loginStaff',this.loginStaff);
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
  .staffHomeHeader{
    background: cadetblue;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .staffHomeHeader .title{
    font-size: 25px;
    font-family: 小米兰亭;
    color: white;
    font-weight: bold;
  }
  .staffHomeHeader .loginStaffInfo{
    font-size: 18px;
    font-family: 小米兰亭;
    color: white;
  }
  .staffHomeHeader .loginStaffInfo .hoverMenu{
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
