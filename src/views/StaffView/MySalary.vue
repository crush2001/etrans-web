<template>
  <div>
    <div style="margin-top: 15px">
      <el-descriptions class="margin-top" title="我的薪酬待遇信息" :column="5" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            员工账号
          </template>
          {{ myLoginStaff }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-money"></i>
            基本工资
          </template>
          {{ baseSalary }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-money"></i>
            加班工资
          </template>
          {{ workOvertimeSalary }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-money"></i>
            工龄工资
          </template>
          {{ workingYearsSalary }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-present"></i>
            考核奖
          </template>
          {{ assessmentAward }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-present"></i>
            节油奖
          </template>
          {{ oilSavingAward }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-present"></i>
            过节费
          </template>
          {{ festivalFee }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document-copy"></i>
            养老保险（%）
          </template>
          {{ endowmentInsurance }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document-copy"></i>
            医疗保险（%）
          </template>
          {{ medicalInsurance }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document-copy"></i>
            失业保险（%）
          </template>
          {{ unemploymentInsurance }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document-copy"></i>
            工伤保险（%）
          </template>
          {{ employmentInjuryInsurance }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document-copy"></i>
            生育保险（%）
          </template>
          {{ maternityInsurance }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document-copy"></i>
            公积金（%）
          </template>
          {{ accumulationFund }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-present"></i>
            年终奖
          </template>
          {{ yearEndBonus }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-bank-card"></i>
            工资总额（月）
          </template>
          {{ totalSalary }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  name: "MySalary",
  data(){
    return{
      myLoginStaff:'',
      mySalaryInfo:[],

      baseSalary:0,
      workOvertimeSalary:0,
      workingYearsSalary:0,
      assessmentAward:0,
      oilSavingAward:0,
      festivalFee:0,
      yearEndBonus:0,
      endowmentInsurance:0,
      medicalInsurance:0,
      unemploymentInsurance:0,
      employmentInjuryInsurance:0,
      maternityInsurance:0,
      accumulationFund:0,
      totalSalary:0,
      staffAccount:''
    }
  },
  mounted() {
    this.initMyLoginStaff();
  },
  methods:{
    initMyLoginStaff(){
      let loginStaffToken = window.sessionStorage.getItem("token");
      getRequest('/staff/getLoginId',{"token":loginStaffToken}).then(resp=>{
        this.myLoginStaff = resp.data;
        this.initMySalaryInfo();
      })
    },
    initMySalaryInfo(){
      getRequest('/salary/'+this.myLoginStaff).then(resp=>{
        if (resp) {
          this.mySalaryInfo = resp;
          //console.log(resp);
          this.staffAccount = resp.staffAccount;
          this.baseSalary = resp.baseSalary;
          this.workOvertimeSalary = resp.workOvertimeSalary;
          this.workingYearsSalary = resp.workingYearsSalary;
          this.assessmentAward = resp.assessmentAward;
          this.oilSavingAward = resp.oilSavingAward;
          this.festivalFee = resp.festivalFee;
          this.endowmentInsurance = resp.endowmentInsurance;
          this.medicalInsurance = resp.medicalInsurance;
          this.unemploymentInsurance = resp.unemploymentInsurance;
          this.employmentInjuryInsurance = resp.employmentInjuryInsurance;
          this.maternityInsurance = resp.maternityInsurance;
          this.accumulationFund = resp.accumulationFund;
          this.yearEndBonus = resp.yearEndBonus;
          this.totalSalary = resp.totalSalary;
        }
      })
    }
  }
}
</script>
