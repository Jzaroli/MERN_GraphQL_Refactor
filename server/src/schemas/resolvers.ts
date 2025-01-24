import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';
import type { BookDocument } from '../models/Book.js';


interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  bookCount: Number;
  savedBooks: BookDocument[];
}

// interface UserArgs {
//   userId: string;
// }

interface AddUserArgs {
  input:{
    username: string;
    email: string;
    password: string;
  }
}

interface SaveBookArgs {
  input:{
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image: string;
    link: string;
  }
}

// interface RemoveBookArgs {
//   bookId: string;
// }

interface Context {
  user?: User;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; user: User }> => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_parent: any, { input }: AddUserArgs): Promise<{ token: string; user: User }> => {
        const user = await User.create({ ...input });
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      },
    saveBook: async (_parent: any, { input }: SaveBookArgs, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { savedBooks: input },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    removeBook: async (_parent: any, { bookId } : { bookId: string }, context: Context): Promise<User | null> => {
      if (context.user) {
        console.log('bId', bookId)
        console.log('context', context.user)
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;
