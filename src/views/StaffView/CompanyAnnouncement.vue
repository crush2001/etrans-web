<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between;">
      <div>
        <el-input style="width: 300px; margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询的公告标题" v-model="searchStaffAnnouncementTitle" clearable @keydown.enter.native="searchStaffAnnouncementByTitle"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchStaffAnnouncementByTitle">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initStaffAnnouncement" @click.native="getStaffAnnouncementNum">刷新</el-button>
        <div>
          <el-dialog title="搜索结果" :visible.sync="dialogTableVisible" width="90%">
            <el-table :data="searchResult" border stripe style="width: 100%" max-height="500px"
                      v-loading="loadingAnnouncementSearchResult"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
              <template slot="empty">
                <el-empty :image-size="80" description='查询不到该公告的信息'></el-empty>
              </template>
              <el-table-column fixed prop="announcementId" header-align="center" align="center" width="80px" label="公告ID"></el-table-column>
              <el-table-column prop="announcementTitle" header-align="center" align="center" width="200px" label="公告标题"></el-table-column>
              <el-table-column prop="announcementContent" header-align="center" label="公告内容" width="900px">
                <template slot-scope="scope">
                  <div v-html="scope.row.announcementContent"></div>
                </template>
              </el-table-column>
              <el-table-column prop="announcementPublisher" header-align="center" align="center" label="公告发布者" width="100px"></el-table-column>
              <el-table-column prop="announcementPublishTime" header-align="center" align="center" label="公告发布时间">
                <template slot-scope="scope">{{scope.row.announcementPublishTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
              </el-table-column>
              <el-table-column fixed="right" width="120px" header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button @click="showMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="staffAnnouncementInfo"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            stripe
            style="width: 100%">
          <el-table-column
              fixed
              prop="announcementId"
              header-align="center"
              align="center"
              width="80px"
              label="公告ID">
          </el-table-column>
          <el-table-column
              prop="announcementTitle"
              header-align="center"
              align="center"
              width="200px"
              label="公告标题">
          </el-table-column>
          <el-table-column
              prop="announcementContent"
              header-align="center"
              width="900px"
              label="公告内容">
            <template slot-scope="scope">
              <div v-html="scope.row.announcementContent"></div>
            </template>
          </el-table-column>
          <el-table-column
              prop="announcementPublisher"
              header-align="center"
              align="center"
              width="100px"
              label="公告发布者">
          </el-table-column>
          <el-table-column
              prop="announcementPublishTime"
              header-align="center"
              align="center"
              label="公告发布时间">
            <template slot-scope="scope">{{scope.row.announcementPublishTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
          </el-table-column>
          <el-table-column
              fixed="right"
              width="120px"
              header-align="center"
              align="center"
              label="操作">
            <template slot-scope="scope">
              <el-button @click="showMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 15px;display: flex;justify-content: flex-end">
        <el-pagination
            background
            :page-sizes="[1,5,10,20]"
            :page-size="pageSize"
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="查看详情" :visible.sync="showDialogVisible" width="60%">
      <div>
        <el-form ref="showAnnouncementForm" :model="staffAnnouncementDetails">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="公告标题：" prop="announcementTitle">
                <el-input v-model="staffAnnouncementDetails.announcementTitle" prefix-icon="el-icon-edit" placeholder="请输入公告标题" size="medium" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公告最后修改者：" prop="announcementPublisher">
                <el-input v-model="staffAnnouncementDetails.announcementPublisher" prefix-icon="el-icon-user" placeholder="请输入公告发布者" size="medium" style="width: 300px" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="公告内容：" prop="announcementContent">
                <quill-editor
                    v-model="staffAnnouncementDetails.announcementContent"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @change="onEditorChange($event)">
                </quill-editor>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  name: "CompanyAnnouncement",
  data(){
    return{
      staffAnnouncementInfo:[],
      searchResult:[],
      loading:false,
      dialogTableVisible:false,
      loadingAnnouncementSearchResult:false,
      showDialogVisible:false,
      total:0,
      pageSize:1,
      currentPage:1,
      searchStaffAnnouncementTitle:'',
      staffAnnouncementDetails:{
        announcementId:0,
        announcementTitle:'',
        announcementContent:'',
        announcementPublisher:''
      },
      editorOption: {
        placeholder: '请输入公告内容',
        modules: {
          toolbar: {
            container:[
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean']
            ]
          },
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      }
    }
  },
  mounted() {
    this.initStaffAnnouncement();
    this.getStaffAnnouncementNum();
  },
  methods:{
    showMenu(data){
      this.staffAnnouncementDetails.announcementId = data.announcementId;
      this.staffAnnouncementDetails.announcementTitle = data.announcementTitle;
      this.staffAnnouncementDetails.announcementPublisher =data.announcementPublisher;
      this.staffAnnouncementDetails.announcementContent = data.announcementContent;
      this.showDialogVisible = true;
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initStaffAnnouncement();
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initStaffAnnouncement()
    },
    initStaffAnnouncement(){
      this.loading = true;
      getRequest('/announcement/list?pageNum='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
        this.loading = false;
        if (resp) {
          this.staffAnnouncementInfo = resp.list;
        }
      })
    },
    getStaffAnnouncementNum(){
      getRequest('/announcement/count').then(resp=>{
        this.total = resp;
      })
    },
    searchStaffAnnouncementByTitle(){
      this.loadingAnnouncementSearchResult = true;
      this.searchResult = [];
      getRequest('/announcement/search?announcementTitle='+this.searchStaffAnnouncementTitle).then(resp=>{
        this.loadingAnnouncementSearchResult = false;
        this.dialogTableVisible = true;
        if (resp) {
          this.searchResult = resp;
        }
      })
    },
    onEditorBlur(){},
    onEditorFocus(event){
      event.enable(false);
    },
    onEditorChange(){}
  }
}
</script>
