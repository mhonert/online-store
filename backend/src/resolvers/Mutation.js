const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, createEmail } = require("../mail");
const { checkPermissions } = require("../utils");

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
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that!");
    }

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          user: {
            connect: {
              id: ctx.request.userId
            }
          }
        }
      },
      info
    );

    return item;
  },

  updateItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that!");
    }

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
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that!");
    }

    const where = { id: args.id };

    // 1. Find the item
    const item = await ctx.db.query.item({ where }, `{id user { id }}`);

    // 2. Check if they own that item or have the permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );
    if (!ownsItem && !hasPermissions) {
      throw new Error("You do not have the permission to delete this item!");
    }

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
  },

  async requestReset(parent, args, ctx, info) {
    // Check if this is an existing user
    const email = args.email.toLowerCase();

    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error("User does not exist!");
    }

    // Set a reset token and expiry on that user
    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    const response = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });

    // Email them that reset token
    const mailResponse = await transport.sendMail({
      from: "freshfruits@localhost",
      to: user.email,
      subject: "Your Password Reset Request",
      html: createEmail(
        user.name,
        `You can reset your password 
                        <a href="${
                          process.env.FRONTEND_URL
                        }/reset?resetToken=${resetToken}">here</a>.`
      )
    });

    return { message: "Successful" };
  },

  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords do not match!");
    }

    const user = await ctx.db.query.user({
      where: { resetToken: args.resetToken }
    });
    if (!user) {
      throw new Error("Invalid or expired reset token!");
    }

    if (user.resetTokenExpiry < Date.now()) {
      throw new Error("Invalid or expired reset token!");
    }

    // Set new password
    const password = await bcrypt.hash(args.password, 10);

    const response = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: { resetToken: null, resetTokenExpiry: null, password }
    });

    setJwtCookie(ctx.response, user.id);

    return response;
  },

  async updatePermissions(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }

    checkPermissions(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    return ctx.db.mutation.updateUser({
      data: { permissions: { set: args.permissions } },
      where: { id: args.userId }
    });
  },

  async addToCart(parent, args, ctx, info) {
    const userId = ctx.request.userId;
    if (!userId) {
      throw new Error("You must be logged in!");
    }

    // Item already exists in cart?
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });

    if (existingCartItem) {
      console.log(
        "Update existing cart item",
        existingCartItem.id,
        userId,
        args.id
      );
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 }
      });
    }

    // No -> create new cart item
    console.log("Create new cart item", userId, args.id);

    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId }
        },
        item: {
          connect: { id: args.id }
        }
      }
    });
  },

  async removeFromCart(parent, args, ctx, info) {
    const userId = ctx.request.userId;
    if (!userId) {
      throw new Error("You must be logged in!");
    }

    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id }
      }
    });

    if (!existingCartItem) {
      throw new Error("Item does not exist in cart");
    }

    if (existingCartItem.quantity <= 1) {
      console.log(
        "Remove last item of this type in cart",
        existingCartItem.id,
        userId,
        args.id
      );
      // delete cart item
      const deletedItem = await ctx.db.mutation.deleteCartItem({
        where: {
          id: existingCartItem.id
        }
      });

      return {
        ...deletedItem,
        quantity: 0
      };
    }

    // Reduce quantity of item in cart
    console.log(
      "Reduce quantity of item in cart",
      existingCartItem.id,
      userId,
      args.id
    );
    return ctx.db.mutation.updateCartItem({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity - 1 }
    });
  }
};

module.exports = Mutations;
