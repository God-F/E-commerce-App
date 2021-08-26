import request from './request';
// 请求侧边连数据
export async function getSidebar(type) {
  const data = await request.get('/getsidebar', {
    params: {
      type,
    },
  });
  return data;
}
// 获取商品数据
export async function getGoods(type, page, size, sort) {
  const data = await request.get('/getGoodsList', {
    params: {
      type,
      page,
      size,
      sort,
    },
  });
  return data;
}

// 模糊查询
export async function getLikeSearch(value) {
  const data = await request.get('/likeSearch', {
    params: {
      likeValue: value,
    },
  });
  return data;
}

// 搜索
export async function searchGoods(type, page, size) {
  const data = await request.get('/search', {
    params: {
      type,
      page,
      size,
    },
  });
  return data;
}

// 根据id查询数据
export async function getGoodsById(ids) {
  const data = await request.get('/getGoodsByIds', {
    params: {
      value: ids,
    },
  });
  return data;
}
