const Mutations = {
  async createStore(parents, args, ctx, info) {
    // TODO Check if logged in

    const store = await ctx.db.mutation.createStore(
      {
        data: {
          ...args,
        },
      },
      info,
    );

    return store;
  },
  async updateStore(parent, args, ctx, info) {
    // take a copr of updates
    const updates = { ...args };
    // remove the ID from updates
    delete updates.id;
    // run the update method
    const store = await ctx.db.mutation.updateStore(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info,
    );
    return store;
  },
};

module.exports = Mutations;

// updateStore(data: StoreUpdateInput!, where: StoreWhereUniqueInput!): Store
