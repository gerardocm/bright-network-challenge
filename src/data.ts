const BASE_URL = "https://bn-hiring-challenge.fly.dev/";

export interface Member {
  name: string;
  bio: string;
}

export interface Job {
  title: string;
  location: string;
}

const request = async (path: string) => {
  const response = fetch(BASE_URL + path)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      throw err;
    });
  return await response;
};

export const getJobs = async (): Promise<Job[]> => {
  try {
    const jobs: Job[] = await request("jobs.json");
    return jobs;
  } catch (err) {
    throw err;
  }
};

export const getMembers = async (): Promise<Member[]> => {
  try {
    const members = await request("members.json");
    return members;
  } catch (err) {
    throw err;
  }
};
