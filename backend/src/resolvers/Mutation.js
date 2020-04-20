const Mutations = {
  async createStore(parents, args, ctx, info) {
    // TODO Check if logged in

    const store = await ctx.db.mutation.createStore(
      {
        data: {
          ...args
        }
      },
      info
    );

    return store;
  }
};

module.exports = Mutations;
