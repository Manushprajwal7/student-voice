import connectToDatabase from "@app/lib/mongoose";
import User from "@/models/user.model";
import Problem from "@/models/problem.model";

export async function getUserProfile(userId) {
  try {
    await connectToDatabase();
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new Error("User not found");
    }
    const problems = await Problem.find({ author: userId }).lean();
    return {
      ...user,
      problems,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function deleteUserProblem(userId, problemId) {
  try {
    await connectToDatabase();
    const problem = await Problem.findOneAndDelete({
      _id: problemId,
      author: userId,
    });
    if (!problem) {
      throw new Error("Problem not found or user not authorized");
    }
    return problem;
  } catch (error) {
    console.error("Error deleting user problem:", error);
    throw error;
  }
}
