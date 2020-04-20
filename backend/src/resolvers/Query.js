const { forwardTo } = require('prisma-binding');

const Query = {
  stores: forwardTo('db'),
  // async stores(parent, args, ctx, info) {
  //   const stores = await ctx.db.query.stores();
  //   return stores;
  // }
};

module.exports = Query;
