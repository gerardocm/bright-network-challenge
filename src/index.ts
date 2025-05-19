import { getJobs, getMembers } from "./data";
import { CustomMember, getAllJobRecommendations } from "./data-processing";

const main = async () => {
  // Get jobs
  const jobs = await getJobs();
  // Get members
  const members = await getMembers();

  // Process the data from member
  getAllJobRecommendations(members, jobs);

  // Presents the information in the console
  (members as CustomMember[]).forEach((member: CustomMember) => {
    console.log("----------------------------------------");
    console.log("member: ", member.name);
    console.log("recommended: ", member.recommendedJob);
  });
  console.log("----------------------------------------");
};

main();
