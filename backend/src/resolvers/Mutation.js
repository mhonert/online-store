const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const setJwtCookie = (response, userId) => {
  // create JWT for the user
  const token = jwt.sign({ userId: userId }, process.env.APP_SECRET);

  // save JWT in cookie
  response.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
  });
};

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    return item;
  },

  updateItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    const updates = { ...args };
    delete updates.id;

    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    // 1. Find the item
    const item = await ctx.db.query.item({ where }, `{id title}`);

    // 2. Check if they own that item or have the permissions
    // TODO

    // 3 Delete it

    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    const email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);

    // create user
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          name: args.name,
          email,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );

    setJwtCookie(ctx.response, user.id);

    return user;
  },

  async signin(parent, args, ctx, info) {
    const email = args.email.toLowerCase();

    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error("User does not exist!");
    }

    const passwordValid = await bcrypt.compare(args.password, user.password);
    if (!passwordValid) {
      throw new Error("Invalid Password!");
    }

    setJwtCookie(ctx.response, user.id);
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    ctx.request.userId = null;

    return { message: "User signed out" };
  }
};

module.exports = Mutations;
