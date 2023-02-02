<template>
  <div id="building">
    <el-form :rules="rules"
             ref="loginForm"
             :model="loginForm"
             class="loginContainer"
             v-loading="loading"
             element-loading-text="正在登录......"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
      <h3 class="loginTitle">E-Trans协同办公系统登录</h3>
      <el-form-item>
        <span class="cen">请选择您的用户身份：</span>
        <el-radio v-model="loginForm.choice" label="1">管理员</el-radio>
        <el-radio v-model="loginForm.choice" label="2">员工</el-radio>
      </el-form-item>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="inputCaptcha">
        <el-input type="text" auto-complete="false" v-model="loginForm.inputCaptcha" placeholder="点击图片更换验证码" style="width: 250px; margin-right: 5px"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha">
      </el-form-item>
      <el-button type="primary" style="width: 100%" @click="submitLogin">登录系统</el-button>
      <el-divider></el-divider>
      <span style="font-size: 14px">⚠️注意：员工初始密码为123456，登录后请立即修改！</span>
    </el-form>
  </div>
</template>

<script>
import login from "@/views/LoginView/LoginIndex.vue";

export default {
  name: "Login",
  computed: {
    login() {
      return login
    }
  },
  data(){
    return{
      captchaUrl:'/getCaptcha?time='+new Date(),
      loginForm:{
        choice:'1',
        username:'',
        password:'',
        inputCaptcha:''
      },
      checked:true,
      loading:false,
      rules:{
        username:[{required:true,message:'用户名不能为空',trigger:'blur'}],
        password:[{required:true,message:'密码不能为空',trigger:'blur'}],
        inputCaptcha:[{required:true,message:'验证码不能为空',trigger:'blur'}]
      }
    }
  },
  methods:{
    updateCaptcha(){
      this.captchaUrl = '/getCaptcha?time='+new Date();
    },
    submitLogin(){
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.choice==1) {
            let adminAccount = this.loginForm.username;
            let adminPassword = this.loginForm.password;
            let inputCaptcha = this.loginForm.inputCaptcha;
            this.postRequest('/administrator/login',{"adminAccount":adminAccount,"adminPassword":adminPassword,"inputCaptcha":inputCaptcha}).then(resp=>{
              console.log(JSON.stringify(resp));
              if (resp.code !== '200') {
                this.loading = false;
                this.$message.error(resp.msg);
              }else {
                this.loading = false;
                this.$message.success('登录成功！');
                window.sessionStorage.setItem('token',resp.data.token);
                this.$router.replace('/adminHomePage');
              }
            })
          }else if(this.loginForm.choice==2) {
            let staffAccount = this.loginForm.username;
            let staffPassword = this.loginForm.password;
            let inputCaptcha = this.loginForm.inputCaptcha;
            this.postRequest('/staff/login',{"staffAccount":staffAccount,"staffPassword":staffPassword,"inputCaptcha":inputCaptcha}).then(resp=>{
              console.log(JSON.stringify(resp));
              if (resp.code !== '200') {
                this.loading = false;
                this.$message.error(resp.msg);
              }else {
                this.loading = false;
                this.$message.success('登录成功！');
                window.sessionStorage.setItem('token',resp.data.token);
                this.$router.replace('/personalCenter');
              }
            })
          }
        } else {
          this.$message.error('输入错误，请检查后重新提交！');
          return false;
        }
      });
    }
  }
}
</script>

<style>
.loginContainer{
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background-color: rgba(255,255,255,95%);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.loginTitle{
  margin: 0px auto 40px auto;
  text-align: center;
}
.el-form-item__content{
  align-items: center;
  display: flex;
}
.cen{
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 3px;
  font-weight: bold;
}
#building{
  background: url("@/assets/back.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
</style>
