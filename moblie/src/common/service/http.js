import Jsencrypt    from 'jsencrypt';
import { AES, enc, MD5, mode, pad } from 'crypto-js';
import api          from '@/common/utils/api';
import LocalStorage from './localStorage.cookie';

class Http {
  constructor() {
    this.init();
    this.app        = null;
    this.redirect   = null;
    this.route      = '';
    this.url        = '';
    this.rasGroup   = {};
    this.$toast     = null;
  }

  init() {
    // axios配置
    const axiosDefaults = {
      baseURL    : process.env.NODE_ENV === 'production' && _.includes(window.location.host, 'test') === false ? 'http://localhost:1874' : 'http://localhost:1874',
      retry      : 2,
      retryDelay : 1000,
      timeout    : 10000,
    };

    axios.defaults = Object.assign(axios.defaults, axiosDefaults);

    // 注入request请求信息
    let request    = 0;

    axios.interceptors.request.use(async (config) => {
      // 私钥
      if (process.env.NODE_ENV === 'production') {
        const jse        = new Jsencrypt();
        const PublicKey  = jse.getPublicKey();
        const PrivateKey = jse.getPrivateKey();

        let key          = PrivateKey;

        if (_.get(config, 'method') === 'get') {
          // get 请求的传公钥
          key = PublicKey;
          request ++;
          this.handleRequest(request);
        }
        else {
          config.data = {
            content: this.encrypt(jse, config.data),
          };
        }

        key = window.btoa(this.aesEncrypt(key));
        const hash = MD5(key.slice(8, 108) + 'EQUOYpl72tsjwzJnnY');

        this.rasGroup[hash] = jse;

        config.headers = Object.assign({}, config.headers, {
          'Secret-Key' : key,
          Hash         : hash,
        });
      }

      const token = await LocalStorage.get('Authorization');

      if (!_.isEmpty(_.get(token, 'data'))) {
        config.headers = Object.assign({}, config.headers, {
          Authorization: `Bearer ${_.get(token, 'data')}`,
        });
      }

      return config;
    }, (err) => {
      return Promise.reject(err);
    });

    // 返回结果拦截
    axios.interceptors.response.use(async (response) => {
      if (_.get(response, 'config.method')) {
        request --;
        this.handleRequest(request);
      }

      let data;
      if (response.status === 200) {
        data = await _.get(response, 'data');
      }
      else {

        data = response.data;

        const err = new Error(data.description);

        err.data = data;
        err.response = response;

        throw err;
      }

      // 解密数据
      if (process.env.NODE_ENV === 'production' && this.rasGroup[_.get(response, 'config.headers.Hash')] && data.data) {
      // if (data.data) {
        data.data = this.decrypt(this.rasGroup[_.get(response, 'config.headers.Hash')], data.data);
      }

      // 登录Token失效
      if (data.code * 1 === 401) {
        LocalStorage.remove('Authorization');
        this.$toast(data.data || 'Authorization 授权已失效');

        if (_.includes(this.route.path, 'welcome') !== true && this.app.$is_wechat === false) {
          let dtLink = {};
          dtLink = {
            name: this.route.name,
          };

          if (!_.isEmpty(this.route.params)) {
            dtLink.params = this.route.params;
          }

          if (!_.isEmpty(this.route.query)) {
            dtLink.query = this.route.query;
          }

          // 跳转到登陆页
          this.redirect({
            path: `/welcome/login?dt=${JSON.stringify(dtLink)}`,
          });
        }
      }

      // 失败状态统一提示
      else if (data.code * 1 !== 200) {
        this.$toast(data.data || 'Authorization 授权已失效');
      }

      // 删除队列里面的hash值
      delete this.rasGroup[_.get(response, 'config.headers.Hash')];
      return data;
    }, (err) => {

      request --;
      this.handleRequest(request);
      const errMsg = err.message;

      if (errMsg.indexOf('timeout') !== -1) {
        const { config } = err.config;
        // this.app.$loading.hide();
        // this.app.$toast(errMsg);
        config.__retryCount = config.__retryCount || 0;

        config.__retryCount += 1;

        const backoff = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, config.retryDelay || 1);
        });

        return backoff.then(() => {
          return axios(config);
        });

      }
      else if (errMsg.indexOf('Network') !== -1) {
        // this.app.$loading.hide();
        // this.app.$toast(errMsg);
        return Promise.reject(err);

      }

      return Promise.reject(err);
    });

  }

  // ras加密
  encrypt(jse, value) {
    if (_.isObject(value)) {
      value = JSON.stringify(value);
    }

    let str = '';
    const limitLen = 117;
    for (let i = 0; i < value.length; i += limitLen) {
      str += jse.encrypt(value.slice(i, i + limitLen));
    }
    return str;
  }

  // ras解密
  decrypt(jse, value) {
    const reqData = value;
    if (typeof value === 'object') {
      value = _.get(value, 'content');
    }

    if (!value) {
      return reqData;
    }

    if (jse && value) {
      const limitLen = 172;
      const valueLen = value.length;
      if (valueLen % limitLen !== 0) {
        return false;
      }
      let str = '';
      for (let i = 0; i < valueLen; i += limitLen) {
        str += jse.decrypt(value.slice(i, i + limitLen));
      }

      try {
        return JSON.parse(str);
      } catch (err) {
        return str;
      }
    }
  }

  // Aes加密
  aesEncrypt(word) {
    let key = '!IWCT$C6hSA5iVQ8';
    key = this.PaddingLeft(key, 16);
    key = enc.Utf8.parse(key);
    // 加密结果返回的是CipherParams object类型
    const encrypted = AES.encrypt(word, key, {
      iv: key,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    });
    // ciphertext是密文，toString()内传编码格式，比如Base64，这里用了16进制
    return  encrypted.ciphertext.toString(enc.Hex);
  }

  // 偏移
  PaddingLeft(key, length) {
    let pkey = key.toString();
    const l = pkey.length;
    if (l < length) {
      pkey = new Array((length - l) + 1).join('0') + pkey;
    }
    else if (l > length) {
      pkey = pkey.slice(length);
    }
    return pkey;
  }

  handleRequest(data) {
    if (data === 1) {
      // this.app.$toast('请求数据');
      // console.log('service http 请求数据...');
      // this.app.$loading.show('请求数据...');
    }

    if (data <= 0) {
      setTimeout(() => {
        // console.log('service http hide');
        // this.app.$loading.hide();
      }, 500);
    }
  }

  // 通过中间件传过来的值，重置app, redirect, route
  setConfig({ app, redirect, route } = {}) {
    this.app      = app || this.app;
    this.route    = route || this.route;
    this.redirect = redirect || this.redirect;
    this.$toast   = (text) => {
      if (this.app.$toast) {
        this.app.$toast(text);
      } else {
        this.app.$Message.error(text);
      }
    };
  }

  // 通过查找common/utils/api文件里面的路由字典
  setUrl(url) {
    return _.get(api, url);
  }

  // 重新返回一个axios方法
  axios(method, apiUrl, data) {
    const url = this.setUrl(apiUrl);
    if (!url) {
      const errMsg = `Error：${apiUrl} api url not defined`;

      this.app.$Dialog.confirm({
        show: true,
        title: '错误提示',
        content: errMsg,
        button: [
          {
            msg: '关闭',
          },
        ],
      });

      return Promise.reject(errMsg);
    }

    return axios({ method, url, data });
  }

  // get请求方式
  Get(url, data) {
    return this.axios('get', url, data);
  }

  // post请求方式
  Post(url, data) {
    return this.axios('post', url, data);
  }

  // put请求方式
  Put(url, data) {
    return this.axios('put', url, data);
  }

  // delete请求方式
  Delete(url, data) {
    return this.axios('delete', url, data);
  }

}

export default new Http();

