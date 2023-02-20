<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between;">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询的员工姓名" v-model="staffName" clearable @keydown.enter.native="searchStaffByName"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchStaffByName">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initStaffInfo" @click.native="getStaffNum">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="65%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingSearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该员工的信息'></el-empty>
              </template>
              <el-table-column prop="staffAccount" label="账号" fixed header-align="center" align="center"></el-table-column>
              <el-table-column prop="staffTrueName" label="姓名" header-align="center" align="center"></el-table-column>
              <el-table-column prop="staffPosition" label="职位" header-align="center" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.staffPosition === '司机'">
                    <el-tag type="success">{{scope.row.staffPosition}}</el-tag>
                  </span>
                  <span v-else-if="scope.row.staffPosition === '车队副队长'">
                    <el-tag type="primary">{{scope.row.staffPosition}}</el-tag>
                  </span>
                  <span v-else-if="scope.row.staffPosition === '车队队长'">
                    <el-tag type="info">{{scope.row.staffPosition}}</el-tag>
                  </span>
                  <span v-else-if="scope.row.staffPosition === '副主管'">
                    <el-tag type="warning">{{scope.row.staffPosition}}</el-tag>
                  </span>
                  <span v-else-if="scope.row.staffPosition === '主管'">
                    <el-tag type="danger">{{scope.row.staffPosition}}</el-tag>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="staffPhoneNumber" label="手机号" header-align="center" align="center"></el-table-column>
              <el-table-column prop="staffIdNumber" label="身份证号" header-align="center" align="center"></el-table-column>
              <el-table-column prop="staffGender" label="性别" header-align="center" align="center" :formatter="genderFormatter">
                <template slot-scope="scope">
                  <span v-if="scope.row.staffGender === true">
                    <el-tag effect="dark" type="primary">男</el-tag>
                  </span>
                  <span v-else-if="scope.row.staffGender === false">
                    <el-tag effect="dark" type="warning">女</el-tag>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="staffBirthday" label="出生日期" header-align="center" align="center">
                <template slot-scope="scope">{{scope.row.staffBirthday | dateFormat("YYYY年M月D日")}}</template>
              </el-table-column>
              <el-table-column prop="staffAddress" label="家庭住址" header-align="center" align="center"></el-table-column>
              <el-table-column prop="staffJoinDate" label="入职时间" header-align="center" align="center">
                <template slot-scope="scope">{{scope.row.staffJoinDate | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
              </el-table-column>
              <el-table-column prop="staffStatus" label="当前状态" header-align="center" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.staffStatus === '在职'">
                    <el-tag effect="dark" type="success">{{scope.row.staffStatus}}</el-tag>
                  </span>
                  <span v-else-if="scope.row.staffStatus === '空闲'">
                    <el-tag effect="dark" type="info">{{scope.row.staffStatus}}</el-tag>
                  </span>
                  <span v-else-if="scope.row.staffStatus === '休假'">
                    <el-tag effect="dark" type="danger">{{scope.row.staffStatus}}</el-tag>
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" header-align="center" align="center" fixed="right" width="100px" style="padding: 5px">
                <template slot-scope="scope">
                  <el-button type="info" size="mini" icon="el-icon-edit" @click="showEditMenu(scope.row)">修改</el-button>
                  <br /><br />
                  <el-button @click="deleteStaffSearch(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
      <div>
        <el-button type="success" icon="el-icon-plus" @click="showAddMenu">新增员工</el-button>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="staffInfo"
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
              align="center"
              label="账号"
              width="100">
          </el-table-column>
          <el-table-column
              prop="staffTrueName"
              header-align="center"
              align="center"
              label="姓名"
              width="100">
          </el-table-column>
          <el-table-column
              prop="staffPosition"
              header-align="center"
              align="center"
              label="职位"
              width="110">
            <template slot-scope="scope">
              <span v-if="scope.row.staffPosition === '司机'">
                <el-tag type="success">{{scope.row.staffPosition}}</el-tag>
              </span>
              <span v-else-if="scope.row.staffPosition === '车队副队长'">
                <el-tag type="primary">{{scope.row.staffPosition}}</el-tag>
              </span>
              <span v-else-if="scope.row.staffPosition === '车队队长'">
                <el-tag type="info">{{scope.row.staffPosition}}</el-tag>
              </span>
              <span v-else-if="scope.row.staffPosition === '副主管'">
                <el-tag type="warning">{{scope.row.staffPosition}}</el-tag>
              </span>
              <span v-else-if="scope.row.staffPosition === '主管'">
                <el-tag type="danger">{{scope.row.staffPosition}}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column
              prop="staffPhoneNumber"
              header-align="center"
              align="center"
              label="手机号"
              width="120">
          </el-table-column>
          <el-table-column
              prop="staffIdNumber"
              header-align="center"
              align="center"
              label="身份证号"
              width="200">
          </el-table-column>
          <el-table-column
              prop="staffGender"
              header-align="center"
              align="center"
              label="性别"
              :formatter="genderFormatter"
              width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.staffGender === true">
                <el-tag effect="dark" type="primary">男</el-tag>
              </span>
              <span v-else-if="scope.row.staffGender === false">
                <el-tag effect="dark" type="warning">女</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column
              prop="staffBirthday"
              header-align="center"
              align="center"
              label="出生日期"
              width="130">
            <template slot-scope="scope">{{scope.row.staffBirthday | dateFormat("YYYY年M月D日")}}</template>
          </el-table-column>
          <el-table-column
              prop="staffAddress"
              header-align="center"
              align="center"
              label="家庭住址"
              width="370">
          </el-table-column>
          <el-table-column
              prop="staffJoinDate"
              header-align="center"
              align="center"
              label="入职时间"
              width="123">
            <template slot-scope="scope">{{scope.row.staffJoinDate | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
          </el-table-column>
          <el-table-column
              prop="staffStatus"
              header-align="center"
              align="center"
              label="当前状态"
              width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.staffStatus === '在职'">
                <el-tag effect="dark" type="success">{{scope.row.staffStatus}}</el-tag>
              </span>
              <span v-else-if="scope.row.staffStatus === '空闲'">
                <el-tag effect="dark" type="info">{{scope.row.staffStatus}}</el-tag>
              </span>
              <span v-else-if="scope.row.staffStatus === '休假'">
                <el-tag effect="dark" type="danger">{{scope.row.staffStatus}}</el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              label="操作"
              width="200">
            <template slot-scope="scope">
              <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">修改</el-button>
              <el-button @click="deleteStaff(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 15px;display: flex;justify-content: flex-end">
        <el-pagination
            background
            :page-sizes="[2,8,10,20]"
            :page-size="pageSize"
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增员工信息" :visible.sync="addDialogVisible" width="62%">
        <div>
          <el-form ref="addStaffForm" :model="staffDetails" :rules="rules">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="员工账号：" prop="staffAccount">
                  <el-input v-model="staffDetails.staffAccount" prefix-icon="el-icon-edit" placeholder="请输入员工账号" size="medium"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="员工密码：" prop="staffPassword">
                  <el-input v-model="staffDetails.staffPassword" prefix-icon="el-icon-edit" placeholder="请输入员工密码" size="medium" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="员工姓名：" prop="staffTrueName">
                  <el-input v-model="staffDetails.staffTrueName" prefix-icon="el-icon-edit" placeholder="请输入员工姓名" size="medium"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="员工职位：" prop="staffPosition">
                  <el-select v-model="staffDetails.staffPosition" placeholder="请选择员工职位" size="medium">
                    <el-option
                        v-for="item in positionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="员工手机：" prop="staffPhoneNumber">
                  <el-input v-model="staffDetails.staffPhoneNumber" prefix-icon="el-icon-phone-outline" placeholder="请输入员工手机号" size="medium"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="身份证号：" prop="staffIdNumber">
                  <el-input v-model="staffDetails.staffIdNumber" prefix-icon="el-icon-postcard" placeholder="请输入员工身份证号" size="medium"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="员工性别：" prop="staffGender" size="medium">
                  <el-radio-group v-model="staffDetails.staffGender" style="margin-top: 10px">
                    <el-radio :label="true">男</el-radio>
                    <el-radio :label="false">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出生日期：" prop="staffBirthday" size="medium">
                  <el-date-picker
                      v-model="staffDetails.staffBirthday"
                      type="date"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      placeholder="请选择员工出生日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="行政区划：" prop="staffRegion" size="medium">
                  <el-cascader size="medium" :options="options" v-model="selectedOptions" @change="handleChange"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="详细地址：" prop="staffDetailAddress" size="medium">
                  <el-input v-model="staffDetails.staffDetailAddress" prefix-icon="el-icon-map-location" placeholder="请输入员工详细地址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="当前状态：" prop="staffStatus" size="medium">
                  <el-select v-model="staffDetails.staffStatus" placeholder="请选择员工当前状态">
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
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
    <el-dialog title="修改员工信息" :visible.sync="editDialogVisible" width="62%">
      <div>
        <el-form ref="editStaffForm" :model="editStaffDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="账号（不可修改）：" prop="staffAccount">
                <el-input v-model="editStaffDetails.staffAccount" prefix-icon="el-icon-edit" placeholder="请输入员工账号" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="员工新密码：" prop="staffPassword">
                <el-input v-model="editStaffDetails.staffPassword" prefix-icon="el-icon-edit" placeholder="请输入员工新密码" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="员工姓名：" prop="staffTrueName">
                <el-input v-model="editStaffDetails.staffTrueName" prefix-icon="el-icon-edit" placeholder="请输入员工姓名" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="员工职位：" prop="staffPosition">
                <el-select v-model="editStaffDetails.staffPosition" placeholder="请选择员工职位" size="medium">
                  <el-option
                      v-for="item in positionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="员工手机：" prop="staffPhoneNumber">
                <el-input v-model="editStaffDetails.staffPhoneNumber" prefix-icon="el-icon-phone-outline" placeholder="请输入员工手机号" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="身份证号：" prop="staffIdNumber">
                <el-input v-model="editStaffDetails.staffIdNumber" prefix-icon="el-icon-postcard" placeholder="请输入员工身份证号" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="员工性别：" prop="staffGender" size="medium">
                <el-radio-group v-model="editStaffDetails.staffGender" style="margin-top: 10px">
                  <el-radio :label="true">男</el-radio>
                  <el-radio :label="false">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期：" prop="staffBirthday" size="medium">
                <el-date-picker
                    v-model="editStaffDetails.staffBirthday"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="请选择员工出生日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="家庭住址：" prop="staffAddress" size="medium">
                <el-input v-model="editStaffDetails.staffAddress" prefix-icon="el-icon-map-location" placeholder="请输入员工家庭住址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="当前状态：" prop="staffStatus" size="medium">
                <el-select v-model="editStaffDetails.staffStatus" placeholder="请选择员工当前状态">
                  <el-option
                      v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
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
import {getRequest} from "@/utils/api";
import {postRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import md5 from 'js-md5';
import { regionData, CodeToText } from "element-china-area-data";

export default {
  name: "StaffManage",
  data(){
    return{
      staffInfo:[],
      loading:false,
      loadingSearchResult:false,
      total:0,
      pageSize:8,
      currentPage:1,
      staffName:'',
      searchResult:[],
      dialogTableVisible:false,
      addDialogVisible:false,
      editDialogVisible:false,
      staffDetails:{
        staffAccount: '',
        staffPassword: '123456',
        staffTrueName: '',
        staffPosition: '',
        staffPhoneNumber: '',
        staffIdNumber: '',
        staffGender: true,
        staffBirthday: '',
        staffAddress: '',
        staffStatus: '',
        staffRegion:'',
        staffDetailAddress:''
      },
      editStaffDetails:{
        staffAccount: '',
        staffPassword: '',
        staffTrueName: '',
        staffPosition: '',
        staffPhoneNumber: '',
        staffIdNumber: '',
        staffGender: true,
        staffBirthday: '',
        staffAddress: '',
        staffStatus: '',
      },
      rules:{
        staffAccount:[{required:true,message:'员工账号不能为空',trigger:'blur'}],
        staffPassword:[{required:true,message:'员工密码不能为空',trigger:'blur'}],
        staffTrueName:[{required:true,message:'员工姓名不能为空',trigger:'blur'}],
        staffPosition:[{required:true,message:'员工职位不能为空',trigger:'blur'}],
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
        staffRegion:[{required:true,message:'行政区划不能为空',trigger:'blur'}],
        staffDetailAddress:[{required:true,message:'详细地址不能为空',trigger:'blur'}],
        staffAddress:[{required:true,message:'家庭住址不能为空',trigger:'blur'}],
        staffStatus:[{required:true,message:'当前状态不能为空',trigger:'blur'}]
      },
      statusOptions: [{
        value: '在职',
        label: '在职'
      }, {
        value: '空闲',
        label: '空闲'
      },{
        value: '休假',
        label: '休假'
      }],
      positionOptions: [{
        value: '司机',
        label: '司机'
      }, {
        value: '车队副队长',
        label: '车队副队长'
      }, {
        value: '车队队长',
        label: '车队队长'
      }, {
        value: '副主管',
        label: '副主管'
      }, {
        value: '主管',
        label: '主管'
      }],
      options: regionData,
      selectedOptions: []
    }
  },
  mounted() {
    this.initStaffInfo();
    this.getStaffNum();
  },
  methods:{
    showEditMenu(data){
      this.editStaffDetails.staffAddress = data.staffAddress;
      this.editStaffDetails.staffGender = data.staffGender;
      this.editStaffDetails.staffBirthday = data.staffBirthday;
      this.editStaffDetails.staffPosition = data.staffPosition;
      this.editStaffDetails.staffIdNumber = data.staffIdNumber;
      this.editStaffDetails.staffPhoneNumber = data.staffPhoneNumber;
      this.editStaffDetails.staffTrueName = data.staffTrueName;
      this.editStaffDetails.staffStatus = data.staffStatus;
      this.editStaffDetails.staffPassword = '';
      this.editStaffDetails.staffAccount = data.staffAccount;
      this.editDialogVisible = true;
    },
    showAddMenu(){
      this.addDialogVisible = true;
      this.$refs['addStaffForm'].resetFields();
      this.selectedOptions = [];
    },
    deleteStaffSearch(data){
      this.$confirm('此操作将永久删除员工'+ data.staffTrueName +'，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/staff?id=' + data.staffAccount).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该员工信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.dialogTableVisible = false;
            this.initStaffInfo();
            this.getStaffNum();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    deleteStaff(data){
      this.$confirm('此操作将永久删除员工'+ data.staffTrueName +'，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/staff?id=' + data.staffAccount).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该员工信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.initStaffInfo();
            this.getStaffNum();
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
      this.$refs['addStaffForm'].validate(valid=>{
        if (valid){
          let pwdMD5 = this.$md5(this.staffDetails.staffPassword);
          this.staffDetails.staffPassword = pwdMD5;
          this.staffDetails.staffAddress = this.staffDetails.staffRegion + this.staffDetails.staffDetailAddress;
          postRequest('/staff',this.staffDetails).then(resp=>{
            if (resp) {
              this.addDialogVisible = false;
              this.$notify({
                title: '新增成功',
                message: '该员工信息已添加至系统！',
                type: 'success',
                duration: 3000
              });
              this.getStaffNum();
              this.initStaffInfo();
              this.$refs['addStaffForm'].resetFields();
              this.selectedOptions = [];
            }
          })
        }
      })
    },
    submitEdit(){
      this.$refs['editStaffForm'].validate(valid=>{
        if (valid){
          let pwdMD5 = this.$md5(this.editStaffDetails.staffPassword);
          this.editStaffDetails.staffPassword = pwdMD5;
          putRequest('/staff?staffAccount='+this.editStaffDetails.staffAccount
              +'&staffTrueName='+this.editStaffDetails.staffTrueName
              +'&staffStatus='+this.editStaffDetails.staffStatus
              +'&staffGender='+this.editStaffDetails.staffGender
              +'&staffAddress='+this.editStaffDetails.staffAddress
              +'&staffPosition='+this.editStaffDetails.staffPosition
              +'&staffPhoneNumber='+this.editStaffDetails.staffPhoneNumber
              +'&staffIdNumber='+this.editStaffDetails.staffIdNumber
              +'&staffPassword='+this.editStaffDetails.staffPassword
              +'&staffBirthday='+this.editStaffDetails.staffBirthday).then(resp=>{
            if (resp) {
              this.editDialogVisible = false;
              this.$notify({
                title: '修改成功',
                message: '该员工信息已修改成功！',
                type: 'success',
                duration: 3000
              });
              this.dialogTableVisible = false;
              this.getStaffNum();
              this.initStaffInfo();
            }
          })
        }
      })
    },
    currentChange(currentPage){
      this.currentPage = currentPage;
      this.initStaffInfo();
    },
    sizeChange(pageSize){
      this.pageSize = pageSize;
      this.initStaffInfo();
    },
    initStaffInfo(){
      this.loading = true;
      getRequest('/staff/list?pageNum='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
        this.loading = false;
        if (resp) {
          this.staffInfo = resp.list;
        }
      })
    },
    getStaffNum(){
      getRequest('/staff/count').then(resp=>{
        this.total = resp;
      })
    },
    searchStaffByName(){
      this.loadingSearchResult = true;
      this.searchResult = [];
      getRequest('/staff/search?staffTrueName='+this.staffName).then(resp=>{
        this.loadingSearchResult = false;
        this.dialogTableVisible = true;
        if (resp){
          this.searchResult = resp;
        }
      })
    },
    genderFormatter(row,column){
      let gender = row.staffGender;
      if (gender === false){
        return '女';
      }else {
        return '男';
      }
    },
    handleChange() {
      let loc = "";
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc += CodeToText[this.selectedOptions[i]];
      }
      console.log(loc);
      this.staffDetails.staffRegion = loc;
    }
  }
}
</script>
