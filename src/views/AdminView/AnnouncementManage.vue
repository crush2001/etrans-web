<template>
  <div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between;">
      <div>
        <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search" placeholder="请输入要查询的公告标题" v-model="searchAnnouncementTitle" clearable @keydown.enter.native="searchAnnouncementByTitle"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchAnnouncementByTitle">查询</el-button>
        <el-button type="warning" icon="el-icon-refresh" @click="initAnnouncement" @click.native="getAnnouncementNum">刷新</el-button>
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
              <el-table-column fixed prop="announcementId" header-align="center" align="center" width="50px" label="公告ID"></el-table-column>
              <el-table-column prop="announcementTitle" header-align="center" align="center" width="200px" label="公告标题"></el-table-column>
              <el-table-column prop="announcementContent" header-align="center" label="公告内容" width="900px">
                <template slot-scope="scope">
                  <div v-html="scope.row.announcementContent"></div>
                </template>
              </el-table-column>
              <el-table-column prop="announcementPublisher" header-align="center" align="center" label="公告发布者"></el-table-column>
              <el-table-column prop="announcementPublishTime" header-align="center" align="center" label="公告发布时间">
                <template slot-scope="scope">{{scope.row.announcementPublishTime | dateFormat("YYYY年M月D日 HH:mm:ss")}}</template>
              </el-table-column>
              <el-table-column fixed="right" width="200px" header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">查看和修改</el-button>
                  <br /><br />
                  <el-button @click="deleteAnnouncementSearch(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </div>
      </div>
      <div>
        <el-button type="success" icon="el-icon-plus" @click="showAddMenu">发布公告</el-button>
      </div>
    </div>
    <div style="margin-top: 15px">
      <div>
        <el-table
            :data="announcementInfo"
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
              width="50px"
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
              width="200px"
              header-align="center"
              align="center"
              label="操作">
            <template slot-scope="scope">
              <el-button @click="showEditMenu(scope.row)" type="info" size="mini" icon="el-icon-edit">查看和修改</el-button>
              <br /><br />
              <el-button @click="deleteAnnouncement(scope.row)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
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
    <el-dialog title="发布新公告" :visible.sync="addDialogVisible" width="60%">
      <div>
        <el-form ref="addAnnouncementForm" :model="announcementDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="公告标题：" prop="announcementTitle">
                <el-input v-model="announcementDetails.announcementTitle" prefix-icon="el-icon-edit" placeholder="请输入公告标题" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公告发布者：" prop="announcementPublisher">
                <el-input v-model="announcementDetails.announcementPublisher" prefix-icon="el-icon-user" placeholder="请输入公告发布者" size="medium" style="width: 300px" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="公告内容：" prop="announcementContent">
                <quill-editor
                    v-model="announcementDetails.announcementContent"
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
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">发 布</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看和修改公告" :visible.sync="editDialogVisible" width="60%">
      <div>
        <el-form ref="editAnnouncementForm" :model="editAnnouncementDetails" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="公告标题：" prop="announcementTitle">
                <el-input v-model="editAnnouncementDetails.announcementTitle" prefix-icon="el-icon-edit" placeholder="请输入公告标题" size="medium"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公告最后修改者：" prop="announcementPublisher">
                <el-input v-model="editAnnouncementDetails.announcementPublisher" prefix-icon="el-icon-user" placeholder="请输入公告发布者" size="medium" style="width: 300px" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="公告内容：" prop="announcementContent">
                <quill-editor
                    v-model="editAnnouncementDetails.announcementContent"
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
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";

export default {
  name: "AnnouncementManage",
  data(){
    return{
      announcementInfo:[],
      searchResult:[],
      total:0,
      pageSize:1,
      currentPage:1,
      loading:false,
      dialogTableVisible:false,
      loadingAnnouncementSearchResult:false,
      searchAnnouncementTitle:'',
      addDialogVisible:false,
      editDialogVisible:false,
      announcementDetails:{
        announcementTitle:'',
        announcementContent:'',
        announcementPublisher:''
      },
      editAnnouncementDetails:{
        announcementId:0,
        announcementTitle:'',
        announcementContent:'',
        announcementPublisher:''
      },
      rules:{
        announcementTitle:[{required:true,message:'公告标题不能为空',trigger:'blur'}],
        announcementContent:[{required:true,message:'公告内容不能为空',trigger:'blur'}],
        announcementPublisher:[{required:true,message:'公告发布者不能为空',trigger:'blur'}]
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
    this.initAnnouncement();
    this.getAnnouncementNum();
  },
  methods:{
    showEditMenu(data) {
      this.editAnnouncementDetails.announcementId = data.announcementId;
      this.editAnnouncementDetails.announcementTitle = data.announcementTitle;
      this.editAnnouncementDetails.announcementContent = data.announcementContent;
      this.editAnnouncementDetails.announcementPublisher = window.sessionStorage.getItem('loginAdmin');
      this.editDialogVisible = true;
    },
    showAddMenu(){
      this.addDialogVisible = true;
      this.announcementDetails.announcementPublisher = window.sessionStorage.getItem('loginAdmin');
      this.$refs['addAnnouncementForm'].resetFields();
    },
    deleteAnnouncement(data){
      this.$confirm('此操作将永久删除该公告，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/announcement?id='+ data.announcementId).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该公告信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.initAnnouncement();
            this.getAnnouncementNum();
          }
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    deleteAnnouncementSearch(data){
      this.$confirm('此操作将永久删除该公告，是否继续？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        deleteRequest('/announcement?id='+ data.announcementId).then(resp => {
          if (resp) {
            this.$notify({
              title: '删除成功',
              message: '该公告信息已成功删除！',
              type: 'success',
              duration: 3000
            });
            this.dialogTableVisible = false;
            this.initAnnouncement();
            this.getAnnouncementNum();
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
      this.$refs['addAnnouncementForm'].validate(valid=>{
        if (valid) {
          postRequest('/announcement',this.announcementDetails).then(resp=>{
            if (resp) {
              this.addDialogVisible = false;
              this.$notify({
                title: '新增成功',
                message: '该公告已成功发布！',
                type: 'success',
                duration: 3000
              });
              this.getAnnouncementNum();
              this.initAnnouncement();
              this.$refs['addAnnouncementForm'].resetFields();
            }
          })
        }
      })
    },
    submitEdit(){
      this.$refs['editAnnouncementForm'].validate(valid=>{
        if (valid) {
          putRequest('/announcement?announcementId='+this.editAnnouncementDetails.announcementId
              +'&announcementTitle='+this.editAnnouncementDetails.announcementTitle
              +'&announcementContent='+this.editAnnouncementDetails.announcementContent
              +'&announcementPublisher='+this.editAnnouncementDetails.announcementPublisher).then(resp=>{
                if (resp) {
                  this.editDialogVisible = false;
                  this.$notify({
                    title: '修改成功',
                    message: '该公告信息已修改成功！',
                    type: 'success',
                    duration: 3000
                  });
                  this.dialogTableVisible = false;
                  this.getAnnouncementNum();
                  this.initAnnouncement();
                }
          })
        }
      })
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.initAnnouncement();
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.initAnnouncement();
    },
    initAnnouncement(){
      this.loading = true;
      getRequest('/announcement/list?pageNum='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
        this.loading = false;
        if (resp) {
          this.announcementInfo = resp.list;
        }
      })
    },
    searchAnnouncementByTitle(){
      this.loadingAnnouncementSearchResult = true;
      this.searchResult = [];
      getRequest('/announcement/search?announcementTitle='+this.searchAnnouncementTitle).then(resp=>{
        this.loadingAnnouncementSearchResult = false;
        this.dialogTableVisible = true;
        if (resp) {
          this.searchResult = resp;
        }
      })
    },
    getAnnouncementNum(){
      getRequest('/announcement/count').then(resp=>{
        this.total = resp;
      })
    },
    onEditorBlur(){},
    onEditorFocus(){},
    onEditorChange(){}
  }
}
</script>
