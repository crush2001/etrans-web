<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询的会议主题" v-model="searchTheme" clearable @keydown.enter.native="searchMeetingByTheme"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchMeetingByTheme">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initCompanyMeetingInfo">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="70%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingSearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该会议的信息'></el-empty>
              </template>
              <el-table-column width="80" fixed prop="meetingId" header-align="center" align="center" label="会议ID"></el-table-column>
              <el-table-column prop="meetingTheme" header-align="center" align="center" label="会议主题"></el-table-column>
              <el-table-column prop="meetingDetails" header-align="center" align="center" label="会议详情"></el-table-column>
              <el-table-column width="120" prop="meetingType" header-align="center" align="center" label="会议类型">
                <template slot-scope="scope">
                  <el-tag type="info" effect="plain">{{scope.row.meetingType}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column width="123" prop="meetingTime" header-align="center" align="center" label="会议时间">
                <template slot-scope="scope">{{scope.row.meetingTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
              </el-table-column>
              <el-table-column fixed="right" width="150" prop="meetingArranger" header-align="center" align="center" label="会议安排者账号"></el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="companyMeetingInfo"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            stripe
            style="width: 100%">
          <el-table-column
              fixed
              prop="meetingId"
              header-align="center"
              align="center"
              width="80"
              label="会议ID">
          </el-table-column>
          <el-table-column
              prop="meetingTheme"
              header-align="center"
              align="center"
              label="会议主题">
          </el-table-column>
          <el-table-column
              prop="meetingDetails"
              header-align="center"
              align="center"
              label="会议详情">
          </el-table-column>
          <el-table-column
              prop="meetingType"
              header-align="center"
              align="center"
              width="120"
              label="会议类型">
            <template slot-scope="scope">
              <el-tag type="info" effect="plain">{{scope.row.meetingType}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="meetingTime"
              header-align="center"
              align="center"
              width="123"
              label="会议时间">
            <template slot-scope="scope">{{scope.row.meetingTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
          </el-table-column>
          <el-table-column
              fixed="right"
              prop="meetingArranger"
              header-align="center"
              align="center"
              width="150"
              label="会议安排者账号">
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
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  name: "MyMeeting",
  data(){
    return{
      companyMeetingInfo:[],
      loading:false,
      total:0,
      pageSize:8,
      currentPage:1,
      dialogTableVisible:false,
      searchResult:[],
      loadingSearchResult:false,
      searchTheme:'',
      myAccount:''
    }
  },
  mounted() {
    this.initCompanyMeetingInfo();
  },
  methods:{
    currentChange(currentPage){
      this.currentPage = currentPage;
      this.initCompanyMeetingInfo()
    },
    sizeChange(pageSize){
      this.pageSize = pageSize;
      this.initCompanyMeetingInfo();
    },
    initCompanyMeetingInfo(){
      this.loading = true;
      this.myAccount = window.sessionStorage.getItem('loginStaff');
      getRequest('/meeting/queryMyMeeting?pageNum='+this.currentPage+'&pageSize='+this.pageSize+"&singleParticipant="+this.myAccount).then(resp=>{
        this.loading = false;
        if (resp) {
          this.companyMeetingInfo = resp.list;
          this.total = resp.total;
        }
      })
    },
    searchMeetingByTheme(){
      this.loadingSearchResult = true;
      this.searchResult = [];
      this.myAccount = window.sessionStorage.getItem('loginStaff');
      getRequest('/meeting/search?meetingTheme='+this.searchTheme+'&singleParticipant='+this.myAccount).then(resp=>{
        this.loadingSearchResult = false;
        this.dialogTableVisible = true;
        if (resp) {
          this.searchResult = resp;
        }
      })
    },
  }
}
</script>
