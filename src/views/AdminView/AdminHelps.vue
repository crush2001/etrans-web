<template>
  <div>
    <h1 style="text-align: center">欢迎使用E-Trans公共交通企业协同办公系统！</h1>
    <span>
      本系统旨在为公共交通企业运营及管理信息化赋能，实现对公司日常运营的数字化管理<br />
      本系统基于SpringBoot+Vue2.0+MyBatis构建，同时使用以下的开源软件进行构建：<br /><br />
      （1）Element UI，开源Vue2.0前端组件库，用于构造系统前端页面<br />
      （2）Font-Awesome开源图标库，用于构造系统前端页面<br />
      （3）Moment.js，用于对系统前端展示、处理的时间数据进行格式化操作，以便利用户使用和后端处理<br />
      （4）js-md5，用于对用户数据进行md5加密，保证系统数据的安全性<br />
      （5）echarts，用于可视化图表的展示，使公司的概况和各项数据一目了然，提升管理效率<br /><br />
      对本系统管理员，提供数据可视化统计、员工管理、薪酬管理、公共交通线路管理、公共交通班次管理、公司资产管理（包括车辆管理和车站管理）、公告管理、会议管理和在线审批等功能<br /><br />
      本系统作者为闽南师范大学计算机学院19级计算机科学与技术专业2班本科生翁辰龙，为本人的毕业设计项目<br />
      代码开源地址：<br />
      前端：<el-link icon="el-icon-upload" href="https://github.com/crush2001/etrans-web">E-Trans易运前端</el-link>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      后端：<el-link icon="el-icon-upload" href="https://github.com/crush2001/etrans-web">E-Trans易运后端</el-link>
      <br /><br />
      <div class="block">
        <el-timeline>
          <el-timeline-item timestamp="2022年6月" placement="top">
            <el-card>
              <h4>确定选题</h4>
              <p>确定本人毕业设计选题为“E-Trans易运协同办公系统”，旨在实现一个前后端分离的、基于Vue2+Element UI+SpringBoot+MySQL+MyBatis的公共交通运营企业协同办公系统</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2023年2月" placement="top">
            <el-card>
              <h4>完成代码编写和文档撰写</h4>
              <p>完成前端Vue代码、后端SpringBoot代码编写并提交代码至Github，完成需求说明书、开题报告、毕业论文及其他辅助性文档编写</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <el-divider></el-divider>
      <div style="text-align: center">
        Copyright ©2022-2023 E-Trans-OASystem All Rights Reserved.
      </div>
    </span>
  </div>
</template>

<script>
  export default {
    name: "AdminHelps"
  }
</script>
