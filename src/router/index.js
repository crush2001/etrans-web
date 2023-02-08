import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/LoginView/LoginIndex.vue')
  },
  {
    path: '/staffHome',
    name: 'StaffHome',
    component: () => import('../views/StaffView/StaffHome.vue'),
    children:[
      {
        path: '/personalCenter',
        name: '个人中心',
        component: () => import('../views/StaffView/PersonalCenter.vue')
      },
      {
        path: '/mySchedule',
        name: '我的排班',
        component: () => import('../views/StaffView/MySchedule.vue')
      },
      {
        path: '/mySalary',
        name: '我的薪酬',
        component: () => import('../views/StaffView/MySalary.vue')
      },
      {
        path: '/companyAnnouncement',
        name: '公司公告',
        component: () => import('../views/StaffView/CompanyAnnouncement.vue')
      },
      {
        path: '/myApplication',
        name: '我的申请',
        component: () => import('../views/StaffView/MyApplication.vue')
      },
      {
        path: '/staffHelps',
        name: '帮助与关于',
        component: () => import('../views/StaffView/StaffHelps.vue')
      },
    ]
  },
  {
    path: '/adminHome',
    name: 'AdminHome',
    component: () => import('../views/AdminView/AdminHome.vue'),
    children:[
      {
        path: '/staffManage',
        name: '员工管理',
        component: () => import('../views/AdminView/StaffManage.vue')
      },
      {
        path: '/routeManage',
        name: '线路管理',
        component: () => import('../views/AdminView/RouteManage.vue')
      },
      {
        path: '/scheduleManage',
        name: '班次管理',
        component: () => import('../views/AdminView/ScheduleManage.vue')
      },
      {
        path: '/announcementManage',
        name: '公告管理',
        component: () => import('../views/AdminView/AnnouncementManage.vue')
      },
      {
        path: '/onlineApproval',
        name: '在线审批',
        component: () => import('../views/AdminView/OnlineApproval.vue')
      },
      {
        path: '/adminHelps',
        name: '帮助与关于',
        component: () => import('../views/AdminView/AdminHelps.vue')
      },
      {
        path: '/vehicleManage',
        name: '车辆管理',
        component: () => import('../views/AdminView/VehicleManage.vue')
      },
      {
        path: '/stationManage',
        name: '车站管理',
        component: () => import('../views/AdminView/StationManage.vue')
      },
      {
        path: '/adminHomePage',
        name: '系统首页',
        component: () => import('../views/AdminView/AdminHomePage.vue')
      },
      {
        path: '/salaryManage',
        name: '薪酬管理',
        component: () => import('../views/AdminView/SalaryManage.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  //mode: "history"
})

export default router
