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
  }
};

module.exports = Query;
