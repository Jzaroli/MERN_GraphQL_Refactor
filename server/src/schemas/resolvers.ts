import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  bookCount: Number;
  savedBooks: [];
  //might need to edit aboved saveBooks array as Book Type XXXXXXXXX
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
  userId: string;
  authors: string[];
  description: string;
  title: string;
  image: string;
  link: string;
}

interface RemoveBookArgs {
  userId: string;
  title: string;
}

interface Context {
  user?: User;
}

const resolvers = {
  Query: {
    // profiles: async (): Promise<Profile[]> => {
    //   return await Profile.find();
    // },
    // profile: async (_parent: any, { profileId }: ProfileArgs): Promise<Profile | null> => {
    //   return await Profile.findOne({ _id: profileId });
    // },
    
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
    saveBook: async (_parent: any, { userId, authors, description, title, image, link }: SaveBookArgs, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: userId },
          {
            $addToSet: { books: authors, description, title, image, link },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    removeBook: async (_parent: any, { title }: RemoveBookArgs, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { books: title } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;
