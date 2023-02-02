<template>
  <div>
    <div style="display:flex;">
      <div style="width: 48%">
        <div style="margin-top: 1px">
          <h2>系统管理员账号{{ loginAdmin }}，欢迎您登录E-Trans协同办公系统！</h2>
        </div>
        <div>
          <h1>公司统计概览：</h1>
          <el-row :gutter="20">
            <el-col :span="8">
              <div><el-statistic :value="staffNum" title="员工总数"><template slot="prefix"><i class="el-icon-s-custom"></i></template></el-statistic></div>
            </el-col>
            <el-col :span="8">
              <div><el-statistic :value="routeNum" title="线路总数"><template slot="prefix"><i class="el-icon-s-promotion"></i></template></el-statistic></div>
            </el-col>
            <el-col :span="8">
              <div><el-statistic :value="scheduleNum" title="班次总数"><template slot="prefix"><i class="el-icon-s-order"></i></template></el-statistic></div>
            </el-col>
          </el-row>
          <br />
          <el-row :gutter="20">
            <el-col :span="8">
              <div><el-statistic :value="vehicleNum" title="车辆总数"><template slot="prefix"><i class="el-icon-star-on"></i></template></el-statistic></div>
            </el-col>
            <el-col :span="8">
              <div><el-statistic :value="stationNum" title="车站总数"><template slot="prefix"><i class="el-icon-location"></i></template></el-statistic></div>
            </el-col>
            <el-col :span="8">
              <div><el-statistic :value="workorderNum" title="工单总数"><template slot="prefix"><i class="el-icon-s-claim"></i></template></el-statistic></div>
            </el-col>
          </el-row>
        </div>
        <div>
          <h1>员工数据统计：</h1>
          <div style="display: flex">
            <div style="margin-top: 5px;width: 50%">
              <h4 style="text-align: center">员工职位统计</h4>
              <div id="staffPositionChart"
                   ref="staffPositionChart"
                   style="width: 450px;height: 400px;margin: 10px auto">
              </div>
            </div>
            <div style="margin-left: 30px;width: 50%">
              <h4 style="text-align: center">员工状态统计</h4>
              <div id="staffStatusChart"
                   ref="staffStatusChart"
                   style="width: 450px;height: 400px;margin: 10px auto">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 48%">
        <div>
          <h1>车辆与线路数据统计：</h1>
          <div style="display: flex">
            <div style="margin-top: 5px;width: 50%">
              <h4 style="text-align: center">各线路车辆数</h4>
              <el-table :data="vehicleGroupByRoute" border stripe height="270">
                <el-table-column fixed prop="vehicleRoute" header-align="center" align="center" label="线路号"></el-table-column>
                <el-table-column fixed="right" prop="totalNum" header-align="center" align="center" label="车辆数"></el-table-column>
              </el-table>
            </div>
            <div style="width:45%;margin-left: 30px">
              <h4 style="text-align: center">车辆状态统计</h4>
              <div id="vehicleStatusChart"
                   ref="vehicleStatusChart"
                   style="width: 450px;height: 270px;margin: 10px auto">
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1>工单申请数据统计：</h1>
          <div style="display: flex">
            <div style="margin-top: 5px;width: 50%">
              <h4 style="text-align: center">工单申请类型统计</h4>
              <div id="workorderTypeChart"
                   ref="workorderTypeChart"
                   style="width: 450px;height: 270px;margin: 10px auto">
              </div>
            </div>
            <div style="margin-left: 30px;width: 50%">
              <h4 style="text-align: center">工单申请状态统计</h4>
              <div id="workorderStatusChart"
                   ref="workorderStatusChart"
                   style="width: 450px;height: 270px;margin: 10px auto">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";
import * as echarts from "echarts";

export default {
  name: "AdminHomePage",
  data() {
    return {
      loginAdmin:'',
      staffNum:0,
      routeNum:0,
      scheduleNum:0,
      vehicleNum:0,
      stationNum:0,
      workorderNum:0,
      vehicleGroupByRoute:[]
    };
  },
  mounted() {
    this.initLoginAdminInfo();
    this.getStaffNum();
    this.getRouteNum();
    this.getScheduleNum();
    this.getVehicleNum();
    this.getStationNum();
    this.getWorkorderNum();

    this.initVehicleGroupByRoute();

    setTimeout(() => {
      this.initVehicleStatusChart();
      this.initStaffPositionChart();
      this.initStaffStatusChart();
      this.initWorkorderStatusChart();
      this.initWorkorderTypeChart();
    },300)
  },
  methods:{
    initLoginAdminInfo(){
      let loginAdminToken = sessionStorage.getItem("token");
      getRequest('/administrator/getLoginId',{"token":loginAdminToken}).then(resp=>{
        this.loginAdmin = resp.data;
      });
    },
    getStaffNum() {
      getRequest('/staff/count').then(resp=>{
        if (resp) {
          this.staffNum = resp;
        }
      })
    },
    getRouteNum() {
      getRequest('/route/count').then(resp=>{
        if (resp) {
          this.routeNum = resp;
        }
      })
    },
    getScheduleNum() {
      getRequest('/schedule/count').then(resp=>{
        if (resp) {
          this.scheduleNum = resp;
        }
      })
    },
    getVehicleNum() {
      getRequest('/vehicle/count').then(resp=>{
        if (resp) {
          this.vehicleNum = resp;
        }
      })
    },
    getStationNum() {
      getRequest('/station/count').then(resp=>{
        if (resp) {
          this.stationNum = resp;
        }
      })
    },
    getWorkorderNum() {
      getRequest('/workorder/count').then(resp=>{
        if (resp) {
          this.workorderNum = resp;
        }
      })
    },
    initVehicleGroupByRoute(){
      getRequest('/vehicle/queryGroupByVehicleRoute').then(resp=>{
        if (resp) {
          this.vehicleGroupByRoute = resp;
        }
      })
    },
    initVehicleStatusChart(){
      let normalVehicle = 0;
      let overhaulVehicle = 0;
      let faultyVehicle = 0;

      getRequest('/vehicle/queryGroupByVehicleStatus').then(resp=>{
        if (resp) {
          resp.forEach(item => {
            if (item.vehicleStatus === '正常') {
              normalVehicle = parseInt(item.totalNum);
            }else if (item.vehicleStatus === '检修') {
              overhaulVehicle = parseInt(item.totalNum);
            }else if (item.vehicleStatus === '故障') {
              faultyVehicle = parseInt(item.totalNum);
            }
          })
          let chartDom = document.getElementById('vehicleStatusChart');
          let myChart = echarts.init(chartDom);
          let option;

          option = {
            title: {
              text: '车辆状态统计',
              subtext: '公司现有车辆状态统计图',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: '车辆状态',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: normalVehicle, name: '正常' },
                  { value: overhaulVehicle, name: '检修' },
                  { value: faultyVehicle, name: '故障' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },
    initStaffStatusChart(){
      let onVacation = 0;
      let leisure = 0;
      let onDuty = 0;

      getRequest('/staff/queryGroupByStaffStatus').then(resp=>{
        if (resp) {
          resp.forEach(item => {
            if (item.staffStatus === '休假') {
              onVacation = parseInt(item.totalNum);
            }else if (item.staffStatus === '空闲') {
              leisure = parseInt(item.totalNum);
            }else if (item.staffStatus === '在职') {
              onDuty = parseInt(item.totalNum);
            }
          })
          let chartDom = document.getElementById('staffStatusChart');
          let myChart = echarts.init(chartDom);
          let option;

          option = {
            title: {
              text: '员工状态统计',
              subtext: '公司现有员工在岗状态统计图',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: '员工状态',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: onVacation, name: '休假' },
                  { value: leisure, name: '空闲' },
                  { value: onDuty, name: '在职' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },
    initWorkorderStatusChart(){
      let approve = 0;
      let reject = 0;
      let reviewing = 0;

      getRequest('/workorder/queryGroupByWorkorderStatus').then(resp=>{
        if (resp) {
          resp.forEach(item => {
            if (item.workorderStatus === '批准') {
              approve = parseInt(item.totalNum);
            }else if (item.workorderStatus === '驳回') {
              reject = parseInt(item.totalNum);
            }else if (item.workorderStatus === '待审核') {
              reviewing = parseInt(item.totalNum);
            }
          })
          let chartDom = document.getElementById('workorderStatusChart');
          let myChart = echarts.init(chartDom);
          let option;

          option = {
            title: {
              text: '工单申请状态统计',
              subtext: '系统现有工单申请状态统计图',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: '工单申请状态',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: approve, name: '批准' },
                  { value: reject, name: '驳回' },
                  { value: reviewing, name: '待审核' }
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },
    initStaffPositionChart(){
      let driver = 0;
      let viceCaptain = 0;
      let captain = 0;
      let viceSupervisor = 0;
      let supervisor = 0;

      getRequest('/staff/queryGroupByStaffPosition').then(resp=>{
        if (resp) {
          resp.forEach(item => {
            if (item.staffPosition === '司机') {
              driver = parseInt(item.totalNum);
            }else if (item.staffPosition === '车队副队长') {
              viceCaptain = parseInt(item.totalNum);
            }else if (item.staffPosition === '车队队长') {
              captain = parseInt(item.totalNum);
            }else if (item.staffPosition === '副主管') {
              viceSupervisor = parseInt(item.totalNum);
            }else if (item.staffPosition === '主管') {
              supervisor = parseInt(item.totalNum);
            }
          })
          let chartDom = document.getElementById('staffPositionChart');
          let myChart = echarts.init(chartDom);
          let option;

          option = {
            xAxis: {
              type: 'category',
              data: ['司机', '副队长', '队长', '副主管', '主管']
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: [
                  {
                    value: driver,
                    itemStyle: {
                      color: 'blue'
                    }
                  },
                  {
                    value: viceCaptain,
                    itemStyle: {
                      color: 'red'
                    }
                  },
                  {
                    value: captain,
                    itemStyle: {
                      color: 'orange'
                    }
                  },
                  {
                    value: viceSupervisor,
                    itemStyle: {
                      color: 'pink'
                    }
                  },
                  {
                    value: supervisor,
                    itemStyle: {
                      color: 'green'
                    }
                  },
                ],
                type: 'bar'
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },
    initWorkorderTypeChart(){
      let leave = 0;
      let changeSchedule = 0;
      let changeVehicle = 0;
      let changeRoute = 0;
      let suggestion = 0;

      getRequest('/workorder/queryGroupByWorkorderType').then(resp=>{
        if (resp) {
          resp.forEach(item => {
            if (item.workorderType === '请假') {
              leave = parseInt(item.totalNum);
            }else if (item.workorderType === '换班') {
              changeSchedule = parseInt(item.totalNum);
            }else if (item.workorderType === '换线') {
              changeRoute = parseInt(item.totalNum);
            }else if (item.workorderType === '建议') {
              suggestion = parseInt(item.totalNum);
            }else if (item.workorderType === '换车') {
              changeVehicle = parseInt(item.totalNum);
            }
          })
          let chartDom = document.getElementById('workorderTypeChart');
          let myChart = echarts.init(chartDom);
          let option;

          option = {
            xAxis: {
              type: 'category',
              data: ['请假', '换班', '换车', '换线', '建议']
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: [
                  {
                    value: leave,
                    itemStyle: {
                      color: 'blue'
                    }
                  },
                  {
                    value: changeSchedule,
                    itemStyle: {
                      color: 'red'
                    }
                  },
                  {
                    value: changeVehicle,
                    itemStyle: {
                      color: 'orange'
                    }
                  },
                  {
                    value: changeRoute,
                    itemStyle: {
                      color: 'pink'
                    }
                  },
                  {
                    value: suggestion,
                    itemStyle: {
                      color: 'green'
                    }
                  },
                ],
                type: 'bar'
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    }
  }
}
</script>
