<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询薪酬信息的员工账号" v-model="searchSalaryAccount" clearable @keydown.enter.native="searchSalaryByStaffAccount"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchSalaryByStaffAccount">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initSalaryInfo">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="78%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingSalarySearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该员工的薪酬信息'></el-empty>
              </template>
              <el-table-column fixed prop="staffAccount" header-align="center" label="员工账号" align="center"></el-table-column>
              <el-table-column prop="baseSalary" header-align="center" label="基本工资" align="center"></el-table-column>
              <el-table-column prop="workOvertimeSalary" header-align="center" label="加班工资" align="center"></el-table-column>
              <el-table-column prop="workingYearsSalary" header-align="center" label="工龄工资" align="center"></el-table-column>
              <el-table-column prop="assessmentAward" header-align="center" label="考核奖" align="center"></el-table-column>
              <el-table-column prop="oilSavingAward" header-align="center" label="节油奖" align="center"></el-table-column>
              <el-table-column prop="festivalFee" header-align="center" label="过节费" align="center"></el-table-column>
              <el-table-column prop="endowmentInsurance" header-align="center" label="养老保险" align="center"></el-table-column>
              <el-table-column prop="medicalInsurance" header-align="center" label="医疗保险" align="center"></el-table-column>
              <el-table-column prop="unemploymentInsurance" header-align="center" label="失业保险" align="center"></el-table-column>
              <el-table-column prop="employmentInjuryInsurance" header-align="center" label="工伤保险" align="center"></el-table-column>
              <el-table-column prop="maternityInsurance" header-align="center" label="生育保险" align="center"></el-table-column>
              <el-table-column prop="accumulationFund" header-align="center" label="公积金" align="center"></el-table-column>
              <el-table-column prop="yearEndBonus" header-align="center" label="年终奖" align="center"></el-table-column>
              <el-table-column prop="totalSalary" header-align="center" label="工资总额" align="center"></el-table-column>
              <el-table-column fixed="right" header-align="center" width="200px" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
                  <el-button @click="deleteSalarySearch(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
      <div>
        <el-button @click="showAddMenu" type="success" icon="el-icon-plus">新增薪酬信息</el-button>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="salaryInfo"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            stripe
            style="width: 100%">
          <el-table-column
              fixed
              prop="staffAccount"
              header-align="center"
              label="员工账号"
              align="center">
          </el-table-column>
          <el-table-column
              prop="baseSalary"
              header-align="center"
              label="基本工资"
              align="center">
          </el-table-column>
          <el-table-column
              prop="workOvertimeSalary"
              header-align="center"
              label="加班工资"
              align="center">
          </el-table-column>
          <el-table-column
              prop="workingYearsSalary"
              header-align="center"
              label="工龄工资"
              align="center">
          </el-table-column>
          <el-table-column
              prop="assessmentAward"
              header-align="center"
              label="考核奖"
              align="center">
          </el-table-column>
          <el-table-column
              prop="oilSavingAward"
              header-align="center"
              label="节油奖"
              align="center">
          </el-table-column>
          <el-table-column
              prop="festivalFee"
              header-align="center"
              label="过节费"
              align="center">
          </el-table-column>
          <el-table-column
              prop="endowmentInsurance"
              header-align="center"
              label="养老保险"
              align="center">
            <template slot-scope="scope">
              {{scope.row.endowmentInsurance}}%
            </template>
          </el-table-column>
          <el-table-column
              prop="medicalInsurance"
              header-align="center"
              label="医疗保险"
              align="center">
            <template slot-scope="scope">
              {{scope.row.medicalInsurance}}%
            </template>
          </el-table-column>
          <el-table-column
              prop="unemploymentInsurance"
              header-align="center"
              label="失业保险"
              align="center">
            <template slot-scope="scope">
              {{scope.row.unemploymentInsurance}}%
            </template>
          </el-table-column>
          <el-table-column
              prop="employmentInjuryInsurance"
              header-align="center"
              label="工伤保险"
              align="center">
            <template slot-scope="scope">
              {{scope.row.employmentInjuryInsurance}}%
            </template>
          </el-table-column>
          <el-table-column
              prop="maternityInsurance"
              header-align="center"
              label="生育保险"
              align="center">
            <template slot-scope="scope">
              {{scope.row.maternityInsurance}}%
            </template>
          </el-table-column>
          <el-table-column
              prop="accumulationFund"
              header-align="center"
              label="公积金"
              align="center">
            <template slot-scope="scope">
              {{scope.row.accumulationFund}}%
            </template>
          </el-table-column>
          <el-table-column
              prop="yearEndBonus"
              header-align="center"
              label="年终奖"
              align="center">
          </el-table-column>
          <el-table-column
              prop="totalSalary"
              header-align="center"
              label="月工资总额"
              align="center">
            <template slot-scope="scope">
              {{ fun(scope.row.totalSalary) }}
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              header-align="center"
              width="200px"
              label="操作"
              align="center">
            <template slot-scope="scope">
              <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
              <el-button @click="deleteSalary(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
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
    <el-dialog title="新增员工薪酬信息" :visible.sync="addDialogVisible" width="60%">
      <div>
        <el-form ref="addSalaryForm" :model="salaryDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="员工账号：" prop="staffAccount">
                <el-select v-model="salaryDetails.staffAccount" filterable placeholder="请选择员工账号" size="medium">
                  <el-option
                      v-for="item in staffOptions"
                      :key="item.staffAccount"
                      :label="item.staffAccount"
                      :value="item.staffAccount">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="基本工资：" prop="baseSalary">
                <el-input-number v-model="salaryDetails.baseSalary" :step="100" :min="500"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="加班工资：" prop="workOvertimeSalary">
                <el-input-number v-model="salaryDetails.workOvertimeSalary" :step="100" :min="500"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工龄工资：" prop="workingYearsSalary">
                <el-input-number v-model="salaryDetails.workingYearsSalary" :step="100" :min="500"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="考核奖：" prop="assessmentAward">
                <el-input-number v-model="salaryDetails.assessmentAward" :step="100" :min="500"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="节油奖：" prop="oilSavingAward">
                <el-input-number v-model="salaryDetails.oilSavingAward" :step="100" :min="500"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="过节费：" prop="festivalFee">
                <el-input-number v-model="salaryDetails.festivalFee" :step="100" :min="500"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="养老保险（%）：" prop="endowmentInsurance">
                <el-input-number v-model="salaryDetails.endowmentInsurance" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="医疗保险（%）：" prop="medicalInsurance">
                <el-input-number v-model="salaryDetails.medicalInsurance" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="失业保险（%）：" prop="unemploymentInsurance">
                <el-input-number v-model="salaryDetails.unemploymentInsurance" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工伤保险（%）：" prop="employmentInjuryInsurance">
                <el-input-number v-model="salaryDetails.employmentInjuryInsurance" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生育保险（%）：" prop="maternityInsurance">
                <el-input-number v-model="salaryDetails.maternityInsurance" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="公积金（%）：" prop="accumulationFund">
                <el-input-number v-model="salaryDetails.accumulationFund" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年终奖：" prop="yearEndBonus">
                <el-input-number v-model="salaryDetails.yearEndBonus" :step="100" :min="500"></el-input-number>
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
    <el-dialog title="修改员工薪酬信息" :visible.sync="editDialogVisible" width="60%">
      <div>
        <el-form ref="editSalaryForm" :model="editSalaryDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="员工账号：" prop="staffAccount">
                <el-select v-model="editSalaryDetails.staffAccount" filterable placeholder="请选择员工账号" size="medium" disabled>
                  <el-option
                      v-for="item in staffOptions"
                      :key="item.staffAccount"
                      :label="item.staffAccount"
                      :value="item.staffAccount">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="基本工资：" prop="baseSalary">
                <el-input-number v-model="editSalaryDetails.baseSalary" :step="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="加班工资：" prop="workOvertimeSalary">
                <el-input-number v-model="editSalaryDetails.workOvertimeSalary" :step="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工龄工资：" prop="workingYearsSalary">
                <el-input-number v-model="editSalaryDetails.workingYearsSalary" :step="100"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="考核奖：" prop="assessmentAward">
                <el-input-number v-model="editSalaryDetails.assessmentAward" :step="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="节油奖：" prop="oilSavingAward">
                <el-input-number v-model="editSalaryDetails.oilSavingAward" :step="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="过节费：" prop="festivalFee">
                <el-input-number v-model="editSalaryDetails.festivalFee" :step="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="养老保险（%）：" prop="endowmentInsurance">
                <el-input-number v-model="editSalaryDetails.endowmentInsurance" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="医疗保险（%）：" prop="medicalInsurance">
                <el-input-number v-model="editSalaryDetails.medicalInsurance" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="失业保险（%）：" prop="unemploymentInsurance">
                <el-input-number v-model="editSalaryDetails.unemploymentInsurance" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工伤保险（%）：" prop="employmentInjuryInsurance">
                <el-input-number v-model="editSalaryDetails.employmentInjuryInsurance" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生育保险（%）：" prop="maternityInsurance">
                <el-input-number v-model="editSalaryDetails.maternityInsurance" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="公积金（%）：" prop="accumulationFund">
                <el-input-number v-model="editSalaryDetails.accumulationFund" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年终奖：" prop="yearEndBonus">
                <el-input-number v-model="editSalaryDetails.yearEndBonus" :step="100"></el-input-number>
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
  name: "SalaryManage",
  data(){
    return{
      salaryInfo:[],
      searchResult:[],
      loading:false,
      loadingSalarySearchResult:false,
      dialogTableVisible:false,
      addDialogVisible:false,
      editDialogVisible:false,
      searchSalaryAccount:'',
      total:0,
      currentPage:1,
      pageSize:10,
      salaryDetails:{
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
      },
      editSalaryDetails:{
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
      },
      rules:{
        baseSalary:[{required:true,message:'基本工资不能为空',trigger:'blur'}],
        workOvertimeSalary:[{required:true,message:'加班工资不能为空',trigger:'blur'}],
        workingYearsSalary:[{required:true,message:'工龄工资不能为空',trigger:'blur'}],
        assessmentAward:[{required:true,message:'考核奖不能为空',trigger:'blur'}],
        oilSavingAward:[{required:true,message:'节油奖不能为空',trigger:'blur'}],
        festivalFee:[{required:true,message:'过节费不能为空',trigger:'blur'}],
        yearEndBonus:[{required:true,message:'年终奖不能为空',trigger:'blur'}],
        endowmentInsurance:[{required:true,message:'养老保险不能为空',trigger:'blur'}],
        medicalInsurance:[{required:true,message:'医疗保险不能为空',trigger:'blur'}],
        unemploymentInsurance:[{required:true,message:'失业保险不能为空',trigger:'blur'}],
        employmentInjuryInsurance:[{required:true,message:'工伤保险不能为空',trigger:'blur'}],
        maternityInsurance:[{required:true,message:'生育保险不能为空',trigger:'blur'}],
        accumulationFund:[{required:true,message:'公积金不能为空',trigger:'blur'}],
        staffAccount:[{required:true,message:'员工账号不能为空',trigger:'blur'}]
      },
      staffOptions:{
        staffAccount:''
      },
    }
  },
  mounted() {
    this.initSalaryInfo();
    this.gainStaffChoice();
  },
  methods:{
    showEditMenu(data){
      this.editSalaryDetails.staffAccount = data.staffAccount;
      this.editSalaryDetails.baseSalary = data.baseSalary;
      this.editSalaryDetails.workOvertimeSalary = data.workOvertimeSalary;
      this.editSalaryDetails.workingYearsSalary = data.workingYearsSalary;
      this.editSalaryDetails.assessmentAward = data.assessmentAward;
      this.editSalaryDetails.oilSavingAward = data.oilSavingAward;
      this.editSalaryDetails.festivalFee = data.festivalFee;

      this.editSalaryDetails.endowmentInsurance = data.endowmentInsurance;
      this.editSalaryDetails.medicalInsurance = data.medicalInsurance;
      this.editSalaryDetails.unemploymentInsurance = data.unemploymentInsurance;
      this.editSalaryDetails.employmentInjuryInsurance = data.employmentInjuryInsurance;
      this.editSalaryDetails.maternityInsurance = data.maternityInsurance;
      this.editSalaryDetails.accumulationFund = data.accumulationFund;

      this.editSalaryDetails.yearEndBonus = data.yearEndBonus;

      this.editDialogVisible = true;
    },
    showAddMenu(){
      this.addDialogVisible = true;
      this.$refs['addSalaryForm'].resetFields();
    },
    deleteSalary(data){
      this.$confirm('此操作将永久删除员工'+ data.staffAccount +'的薪酬信息，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/salary?id='+ data.staffAccount).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该薪酬信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.initSalaryInfo();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    deleteSalarySearch(data){
      this.$confirm('此操作将永久删除员工'+ data.staffAccount +'的薪酬信息，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/salary?id='+ data.staffAccount).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该薪酬信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.dialogTableVisible = false;
            this.initSalaryInfo();
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
      this.$refs['addSalaryForm'].validate(valid=>{
        if (valid) {
          this.salaryDetails.totalSalary = (this.salaryDetails.baseSalary + this.salaryDetails.workOvertimeSalary + this.salaryDetails.workingYearsSalary
              + this.salaryDetails.assessmentAward + this.salaryDetails.oilSavingAward + this.salaryDetails.festivalFee)
              - ((this.salaryDetails.baseSalary + this.salaryDetails.workOvertimeSalary + this.salaryDetails.workingYearsSalary
                  + this.salaryDetails.assessmentAward + this.salaryDetails.oilSavingAward + this.salaryDetails.festivalFee) * this.salaryDetails.endowmentInsurance / 100)
              - ((this.salaryDetails.baseSalary + this.salaryDetails.workOvertimeSalary + this.salaryDetails.workingYearsSalary
                  + this.salaryDetails.assessmentAward + this.salaryDetails.oilSavingAward + this.salaryDetails.festivalFee) * this.salaryDetails.medicalInsurance / 100)
              - ((this.salaryDetails.baseSalary + this.salaryDetails.workOvertimeSalary + this.salaryDetails.workingYearsSalary
                  + this.salaryDetails.assessmentAward + this.salaryDetails.oilSavingAward + this.salaryDetails.festivalFee) * this.salaryDetails.unemploymentInsurance / 100)
              - ((this.salaryDetails.baseSalary + this.salaryDetails.workOvertimeSalary + this.salaryDetails.workingYearsSalary
                  + this.salaryDetails.assessmentAward + this.salaryDetails.oilSavingAward + this.salaryDetails.festivalFee) * this.salaryDetails.employmentInjuryInsurance / 100)
              - ((this.salaryDetails.baseSalary + this.salaryDetails.workOvertimeSalary + this.salaryDetails.workingYearsSalary
                  + this.salaryDetails.assessmentAward + this.salaryDetails.oilSavingAward + this.salaryDetails.festivalFee) * this.salaryDetails.maternityInsurance / 100)
              - ((this.salaryDetails.baseSalary + this.salaryDetails.workOvertimeSalary + this.salaryDetails.workingYearsSalary
                  + this.salaryDetails.assessmentAward + this.salaryDetails.oilSavingAward + this.salaryDetails.festivalFee) * this.salaryDetails.accumulationFund / 100);
          //console.log(this.salaryDetails.totalSalary);
          postRequest('/salary',this.salaryDetails).then(resp=>{
            if (resp) {
              this.addDialogVisible = false;
              this.$notify({
                title: '新增成功',
                message: '该员工的薪酬信息已添加至系统！',
                type: 'success',
                duration: 3000
              });
              this.initSalaryInfo();
              this.$refs['addSalaryForm'].resetFields();
            }
          })
        }
      })
    },
    submitEdit(){
      this.$refs['editSalaryForm'].validate(valid=>{
        if (valid) {
          this.editSalaryDetails.totalSalary = (this.editSalaryDetails.baseSalary + this.editSalaryDetails.workOvertimeSalary + this.editSalaryDetails.workingYearsSalary
                  + this.editSalaryDetails.assessmentAward + this.editSalaryDetails.oilSavingAward + this.editSalaryDetails.festivalFee)
              - ((this.editSalaryDetails.baseSalary + this.editSalaryDetails.workOvertimeSalary + this.editSalaryDetails.workingYearsSalary
                  + this.editSalaryDetails.assessmentAward + this.editSalaryDetails.oilSavingAward + this.editSalaryDetails.festivalFee) * this.editSalaryDetails.endowmentInsurance / 100)
              - ((this.editSalaryDetails.baseSalary + this.editSalaryDetails.workOvertimeSalary + this.editSalaryDetails.workingYearsSalary
                  + this.editSalaryDetails.assessmentAward + this.editSalaryDetails.oilSavingAward + this.editSalaryDetails.festivalFee) * this.editSalaryDetails.medicalInsurance / 100)
              - ((this.editSalaryDetails.baseSalary + this.editSalaryDetails.workOvertimeSalary + this.editSalaryDetails.workingYearsSalary
                  + this.editSalaryDetails.assessmentAward + this.editSalaryDetails.oilSavingAward + this.editSalaryDetails.festivalFee) * this.editSalaryDetails.unemploymentInsurance / 100)
              - ((this.editSalaryDetails.baseSalary + this.editSalaryDetails.workOvertimeSalary + this.editSalaryDetails.workingYearsSalary
                  + this.editSalaryDetails.assessmentAward + this.editSalaryDetails.oilSavingAward + this.editSalaryDetails.festivalFee) * this.editSalaryDetails.employmentInjuryInsurance / 100)
              - ((this.editSalaryDetails.baseSalary + this.editSalaryDetails.workOvertimeSalary + this.editSalaryDetails.workingYearsSalary
                  + this.editSalaryDetails.assessmentAward + this.editSalaryDetails.oilSavingAward + this.editSalaryDetails.festivalFee) * this.editSalaryDetails.maternityInsurance / 100)
              - ((this.editSalaryDetails.baseSalary + this.editSalaryDetails.workOvertimeSalary + this.editSalaryDetails.workingYearsSalary
                  + this.editSalaryDetails.assessmentAward + this.editSalaryDetails.oilSavingAward + this.editSalaryDetails.festivalFee) * this.editSalaryDetails.accumulationFund / 100);
          //console.log(this.editSalaryDetails.totalSalary);
          putRequest('/salary?staffAccount='+this.editSalaryDetails.staffAccount
              +"&baseSalary="+this.editSalaryDetails.baseSalary
              +"&workOvertimeSalary="+this.editSalaryDetails.workOvertimeSalary
              +"&workingYearsSalary="+this.editSalaryDetails.workingYearsSalary
              +"&assessmentAward="+this.editSalaryDetails.assessmentAward
              +"&oilSavingAward="+this.editSalaryDetails.oilSavingAward
              +"&festivalFee="+this.editSalaryDetails.festivalFee
              +"&endowmentInsurance="+this.editSalaryDetails.endowmentInsurance
              +"&medicalInsurance="+this.editSalaryDetails.medicalInsurance
              +"&unemploymentInsurance="+this.editSalaryDetails.unemploymentInsurance
              +"&employmentInjuryInsurance="+this.editSalaryDetails.employmentInjuryInsurance
              +"&maternityInsurance="+this.editSalaryDetails.maternityInsurance
              +"&accumulationFund="+this.editSalaryDetails.accumulationFund
              +"&yearEndBonus="+this.editSalaryDetails.yearEndBonus
              +"&totalSalary="+this.editSalaryDetails.totalSalary).then(resp=>{
                if (resp) {
                  this.editDialogVisible = false;
                  this.$notify({
                    title: '修改成功',
                    message: '该员工的薪酬信息已修改成功！',
                    type: 'success',
                    duration: 3000
                  });
                  this.dialogTableVisible = false;
                  this.initSalaryInfo();
                }
          })
        }
      })
    },
    currentChange(currentPage){
      this.currentPage = currentPage;
      this.initSalaryInfo();
    },
    sizeChange(pageSize){
      this.pageSize = pageSize;
      this.initSalaryInfo();
    },
    initSalaryInfo(){
      this.loading = true;
      getRequest('/salary/list?pageNum='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
        this.loading = false;
        if (resp) {
          this.salaryInfo = resp.list;
          this.total = resp.total;
        }
      })
    },
    searchSalaryByStaffAccount(){
      this.loadingSalarySearchResult = true;
      this.searchResult = [];
      getRequest('/salary/search?staffAccount='+this.searchSalaryAccount).then(resp=>{
        this.loadingSalarySearchResult = false;
        this.dialogTableVisible = true;
        if (resp) {
          this.searchResult = resp;
        }
      })
    },
    gainStaffChoice() {
      getRequest('/staff/gainStaffInfo').then(resp=>{
        if (resp) {
          this.staffOptions = resp;
        }
      })
    },
    fun(val){
      let realVal = parseFloat(val).toFixed(2)
      return realVal;
    }
  }
}
</script>
