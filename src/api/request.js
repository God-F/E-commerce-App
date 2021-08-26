import axios from 'axios';
// 创建实例
const request = axios.create({
  baseURL: 'https://mallapi.duyiedu.com/goods/',
  params: {
    appkey: 'dd_1597654682810',
  },
});
// 设置拦截器
request.interceptors.response.use((config) => config.data);
// 导出实例
export default request;
