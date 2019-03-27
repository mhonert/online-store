const { forwardTo } = require("prisma-binding");
const { checkPermissions } = require("../utils");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      // there is no current user Id
      return null;
    }

    return ctx.db.query.user({ where: { id: userId } }, info);
  },

  async users(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in!");
    }

    checkPermissions(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    return ctx.db.query.users({}, info);
  },

  async order(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in!");
    }

    const order = await ctx.db.query.order(
      {
        where: { id: args.id }
      },
      info
    );

    if (!order) {
      throw new Error(`Order ${id} not found`);
    }

    const ownsOrder = order.user.id === userId;
    const hasPermissionToSeeOrder =
      ownsOrder || ctx.request.user.permissions.includes("ADMIN");

    if (!hasPermissionToSeeOrder) {
      throw new Error("You do not have sufficient permissions");
    }

    return order;
  }
};

module.exports = Query;
