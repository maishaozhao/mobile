import Vue  from 'vue';

Vue.filter('state', (key) => {
  const dict = [
    {
      label: '启动',
      value: 0,
    },
    {
      label: '禁用',
      value: 1,
    },
  ];

  if (_.isObject(key) || _.isArray(key)) {
    return dict;
  }

  const item = _.find(dict, { value: key });
  return item ? item.label : key;
});
