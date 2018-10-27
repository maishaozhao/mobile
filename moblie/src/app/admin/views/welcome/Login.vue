<template>
  <div class="login">
    <div class="login-inner">
      <div class="login-head">欢迎登陆</div>
      <div class="login-body">
        <Form ref="formData" :model="formData" :rules="ruleInline">
          <FormItem prop="phone">
            <Input type="text" v-model="formData.phone" placeholder="请输入登录账号">
              <Icon type="ios-person" size="16" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formData.password" placeholder="请输入登录密码">
              <Icon type="ios-lock" size="16" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary"
              :loading="loading"
              long
              @click="handleSubmit('formData')">登陆</Button>
          </FormItem>
        </Form>
        <div class="tips">
          <p>技术服务：广州锦皓科技有限公司</p>
          <p><span>电话：020-36480081</span><span>微信：weixin</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import http         from '@/common/service/http';
import LocalStorage from '@/common/service/localStorage.cookie';

export default {
  name: 'login',
  data() {
    return {
      loading: false,
      formData: {
        phone: '',
        password: '',
      },
      ruleInline: {
        phone: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  components: {
  },
  methods: {
    handleSubmit(name) {
      const self = this;
      self.loading = true;

      self.$refs[name].validate((valid) => {
        if (valid) {
          http.Put('Welcome.Login', self.formData)
            .then((res) => {
              if (res.code * 1 === 200) {
                const data = res.data;
                LocalStorage.set('Authorization', data, 60 * 60 * 23);

                self.$Message.success(res.msg);

                // 跳转到来路
                setTimeout(() => {
                  let route = { name: 'admin.Home' };
                  const routeQuery = _.get(self.$route, 'query.dt');
                  try {
                    route = JSON.parse(routeQuery);
                  }
                  catch (err) {
                    route = {
                      name: 'admin.Home',
                    };
                  }
                  self.$router.push(route);
                }, 2000);
              }
              else {
                self.loading = false;
              }
            });
        } else {
          self.$Message.error('请正确填写表单');
          setTimeout(() => {
            self.loading = false;
          }, 500);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .login {
    width: 100%;
    height: 100%;
    background-image: url('~@admin/assets/img/login-bg.jpg');
    background-position: 50%;
    background-size: cover;

    .login-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300px;
      border: 1px solid #e8e8e8;
      border-radius: 5px;
      background: #fff;
      box-shadow: 5px 5px 15px rgba(255, 255, 255, .5);
      transform: translate(-50%, -60%);

      .login-head {
        padding: 0 20px;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #333;
        border-bottom: 1px solid #e8e8e8;
      }

      .login-body {
        padding: 20px;
      }

      .tips {
        font-size: 12px;
        color: #999;

        > p > span {
          margin-right: 10px;

          &:last-child {
            margin-right: 0;
          }

        }
      }
    }
  }
</style>

