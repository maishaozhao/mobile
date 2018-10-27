<template>
  <div class="user-detail-page">
    <div class="wrapper">
      <div class="controller">
        <Tabs type="card" class="tabs">
          <TabPane label="添加部门">
            <Row type="flex" align="bottom" class="input-group" :gutter="16">
              <Col span="6" class="input-item">
                <Form ref="form" :model="formData" label-position="right" :label-width="100"  @submit.prevent="handleSumbit">
                  <FormItem label="手机号码："
                    prop="username"
                    :rules="{required: true, pattern: /^1([38][0-9]|14[57]|5[^4])\d{8}$/, message: '请输入手机号码', trigger: 'blur'}">
                    <Input v-model="formData.username"></Input>
                  </FormItem>

                  <FormItem label="密码："
                    prop="password"
                    :rules="{required: true, pattern: /^(\S){6,12}$/, message: '请输入新密码', trigger: 'blur'}">
                    <Input type="password" v-model="formData.password"></Input>
                  </FormItem>

                  <FormItem label="确定密码："
                    prop="password1"
                    :rules="{required: true, pattern: /^(\S){6,12}$/, message: '请再次输入密码', trigger: 'blur'}">
                    <Input type="password" v-model="formData.password1"></Input>
                  </FormItem>

                  <FormItem label="用户昵称："
                    prop="nickname"
                    :rules="{required: true, message: '请输入昵称', trigger: 'blur'}">
                    <Input type="text" v-model="formData.nickname"></Input>
                  </FormItem>

                  <FormItem label="管理组：">
                    <Select v-model="formData.groups">
                      <Option v-for="(item, index) in formTemp.groups" :key="index" :value="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>

                  <FormItem label="角色：">
                    <Select v-model="formData.role">
                      <Option v-for="(item, index) in formTemp.role" :key="index" :value="item.value">{{ item.label }}</Option>
                    </Select>
                  </FormItem>

                  <FormItem label="状态：">
                    <i-switch v-model="formTemp.state" size="large">
                      <span v-for="(item, index) in this.$options.filters.state([])" :key="index" :slot="0 === item.value * 1 ? 'open' : 'close'">{{ item.label }}</span>
                    </i-switch>
                  </FormItem>

                  <FormItem>
                    <Button type="primary" :loading="loading" @click="handleSumbit">保存</Button>
                    <router-link :to="{ name: 'admin.AuthGroupList'}">
                      <Button style="margin-left: 8px">返回</Button>
                    </router-link>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'authGroupAdd',
  data() {
    return {
      loading: false,
      formTemp: {
        state  : true,
        role   : [],
        groups : [],
      },
      formData: {
        username  : '',
        password  : '',
        password1 : '',
        role      : 0,
        groups    : 0,
      },
    };
  },
  created() {
  },
  computed: {

  },
  components: {
  },
  methods: {

    // 提交
    handleSumbit() {

    },
  },
};
</script>

<style lang="scss" scoped>
  .user-detail-page {

    .tabs {
      padding: 20px;
      overflow: inherit;

      > :first-child, {
        margin-bottom: 0;
      }

      > :last-child, {
        border: 1px solid #dddee1;
        border-top: none;
      }

    }

    .input-group {
      padding: 10px;

      .input-item {
        margin: 5px 0;

         .btn {
           background: #ff8b1b;
           border-radius: 10px;
         }

      }

    }

    .button {
      padding-top: 30px;
    }
  }

</style>