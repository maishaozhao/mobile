<template>
  <div class="wechat-page">
    <div class="wrapper">
      <div class="controller">
        <div class="table">
          <router-link :to="{ name: 'admin.AuthGroupAdd' }">
            <Button class="export-data" type="primary">
              <Icon type="ios-plus-empty"></Icon>添加部门
            </Button>
          </router-link>
          <Table ref="selection" :loading="loading" border :columns="columns" :data="formTemp.list"></Table>
        </div>
        <div class="page-list">
          <Page show-total :total="total" :current="page" :page-size="per_page" @on-change="handleChangePage" show-elevator></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'authGroupList',
  data() {
    return {
      loading: false,
      formTemp: {
        list: [],
      },
      columns: [
        {
          title : '编号',
          key   : 'index',
          width : 80,
          align : 'center',
        },
        {
          title: '角色',
          key: 'role',
          align : 'center',
          render: (h, params) => {
            let color = '#666';
            switch (params.row.role) {
              case 1:
                color = '#ff9900';
                break;
              case 2:
                color = '#19be6b';
                break;
              default:
                color = '#666';
            }

            return h('div', [
              h('span', {
                style: {
                  color,
                },
              }, this.$UserInfo.role * 1 === 1 ? this.$options.filters.adminType(params.row.role * 1) : '管理员'),
            ]);
          },
        },
        {
          title: '用户名',
          key: 'username',
          width : 150,
          align : 'center',
        },
        {
          title: '昵称',
          key: 'nickname',
          width : 150,
          align : 'center',
        },
        {
          title: '登陆次数',
          key: 'login_count',
          width : 150,
          align : 'center',
        },
        {
          title: '登陆时间',
          key: 'login_time',
          width : 150,
          align : 'center',
        },
        {
          title: '上次登陆时间',
          key: 'last_time',
          width : 150,
          align : 'center',
        },
        {
          title: '更新时间',
          key: 'update_time',
          width : 150,
          align : 'center',
        },
        // {
        //   title: '操作',
        //   key: 'action',
        //   width: 220,
        //   align: 'center',
        //   sortable: true,
        //   render: (h, params) => {
        //     return h('div', [

        //       h('Button', {
        //         props: {
        //           type: 'primary',
        //           size: 'small'
        //         },
        //         style: {
        //            marginRight: '5px'
        //         },
        //         on: {
        //           click: () => {
        //             this.$router.push({
        //               name: 'indexControlcenter',
        //               params: {
        //                 id: params.row.id
        //               }
        //             })
        //           }
        //         }
        //       }, '编辑'),

        //       h('Button', {
        //         props: {
        //           type: 'error',
        //           size: 'small'
        //         },
        //         on: {
        //           click: () => {
        //             this.handleAsync(params);
        //           }
        //         }
        //       }, '删除')
        //     ]);
        //   }
        // }
      ],

      page    : 1,
      total   : 0,
      per_page: 0,
    };
  },
  components: {
  },
  created() {
    this.handleList();
  },
  computed: {

  },
  mounted() {
  },
  watch: {

  },

  filters: {

  },

  methods: {

    // 获取列表
    handleList() {

    },

    // 切换分页
    handleChangePage(page) {
      this.page = page;
      this.handleList();
    },
    // 数据排序
    sortData() {
      _.each(this.formTemp.list, (item, index) => {
        item.index = ((this.page - 1) * this.per_page) + index + 1;
      });
    },

    // 是否要删除该条记录
    handleAsync() {
      // this.$Modal.confirm({
      //   title: '温馨提示',
      //   content: '<p>是否要删除该条记录</p>',
      //   loading: true,
      //   onOk: () => {
      //     setTimeout(() => {
      //       this.handleDelete(params);
      //     }, 500);
      //   }
      // });
    },

    // 删除记录
    handleDelete() {
      // if (item.row) {
      //   Models.Users
      //   .DeleteUserLevel({
      //     data: {
      //       id: _.get(item, 'row.id') * 1
      //     }
      //   })
      //   .then((res) => {
      //     this.$Modal.remove();
      //     if (0 === res.code * 1) {
      //       this.$Message.success(res.data);
      //       this.formTemp.list.splice(item.index, 1);
      //       this.sortData();
      //     }

      //   })
      //   .catch((err) => {
      //     this.$Notice.error({
      //       title: err,
      //     });
      //     this.$Modal.remove();
      //   });

      // }
    },
  },
};
</script>


<style lang="scss" scoped>
  .wechat-page {
    .table {
      padding: 20px;

      .export-data {
        margin-bottom: 5px;

        .ivu-icon {
          margin-right: 5px;
        }
      }
    }

    .page-list {
      text-align: center;
    }
  }

</style>