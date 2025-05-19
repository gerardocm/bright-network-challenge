import {
  checkKNeighbours,
  CustomMember,
  getAllJobRecommendations,
  normalizeJobs,
  removePuctuation,
  removeStopWords,
} from "./../data-processing";
import mockedJobs from "./__mocks__/jobs";
import mockedMembers from "./__mocks__/members";

describe("Data Processing", () => {
  it("should convert jobs to lowercase", () => {
    const jobs = [...mockedJobs];
    const normalizedJobs = normalizeJobs(jobs);
    normalizedJobs.forEach((job) => {
      expect(job.location).toEqual(job.location.toLowerCase());
      expect(job.title).toEqual(job.title.toLowerCase());
    });
  });

  it("should check for location context", () => {
    const positiveRes = checkKNeighbours(["relocate", "london"], 1, 2);
    const negativeRes = checkKNeighbours(["outside", "london"], 1, 2);
    const neutralRes = checkKNeighbours(["living", "in", "london"], 1, 2);
    expect(positiveRes).toBe(1.5);
    expect(negativeRes).toBe(-1);
    expect(neutralRes).toBe(1);
  });

  it("should remove stop words", () => {
    const res = removeStopWords(["the", "London", "is", "are", "you", "us"]);
    expect(res).toMatchObject(["London"]);
  });

  it("should remove punctuation and numbers", () => {
    const res = removePuctuation("Hello!!!!!! This. Is. A, test5 ?");
    expect(res).toBe("Hello This Is A test ");
  });

  it("should return best matching job for default data", () => {
    const jobs = [...mockedJobs];
    const members = [...mockedMembers];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "UX Designer"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[1] as CustomMember).recommendedJob?.title).toBe(
      "Legal Internship"
    );
    expect((members[1] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[2] as CustomMember).recommendedJob?.title).toBe(
      "UX Designer"
    );
    expect((members[2] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[3] as CustomMember).recommendedJob?.title).toBe(
      "Marketing Internship"
    );
    expect((members[3] as CustomMember).recommendedJob?.location).toBe("York");
    expect((members[4] as CustomMember).recommendedJob?.title).toBe(
      "Software Developer"
    );
    expect((members[4] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[5] as CustomMember).recommendedJob?.title).toBe(
      "Software Developer"
    );
    expect((members[5] as CustomMember).recommendedJob?.location).toBe(
      "Edinburgh"
    );
  });

  it("should return best matching job with title but not available city on bio", () => {
    const jobs = [...mockedJobs];
    const members = [{ name: "Test", bio: "I am a waiter in england" }];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe("Waiter");
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return best matching job with city and job title in bio", () => {
    const jobs = [...mockedJobs];
    const members = [{ name: "Test", bio: "I am a waiter in London" }];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe("Waiter");
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return null with title and city in bio not existing in jobs", () => {
    const jobs = [...mockedJobs];
    const members = [{ name: "Test", bio: "I am a dentist in Newcastle" }];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob).toBeNull();
  });

  it("should return best matching job with only bio's city in jobs", () => {
    const jobs = [...mockedJobs];
    const members = [{ name: "Test", bio: "I am a zoologist in London" }];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Zoologist"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return best matching partial job title and city in member's bio in jobs", () => {
    const jobs = [...mockedJobs];
    const members = [
      {
        name: "Test",
        bio: "I am from London and I worked in a zoo previously.",
      },
    ];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Zoologist"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return best matching partial bio's valid job title but invalid city in member's bio", () => {
    const jobs = [...mockedJobs];
    const members = [
      {
        name: "Test",
        bio: "I am from Newcastle and I worked in a zoo previously.",
      },
    ];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Zoologist"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return best matching when job title has multiple words and valid city in member's bio", () => {
    const jobs = [...mockedJobs];
    const members = [
      {
        name: "Test",
        bio: "I am from London and I have worked in Sushi restaurants.",
      },
      { name: "Test", bio: "I am a Chef from London" },
    ];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[1] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[1] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return best matching when job title has multiple words and invalid city in member's bio", () => {
    const jobs = [...mockedJobs];
    const members = [
      {
        name: "Test",
        bio: "I am from Oxford and I have worked in Sushi restaurants.",
      },
      { name: "Test", bio: "I am a Chef from Oxford" },
    ];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[1] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[1] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return best matching when job title has multiple words in member's bio, but city in members is not as job", () => {
    const jobs = [...mockedJobs];
    const members = [
      {
        name: "Test",
        bio: "I am from Manchester and I have worked in Sushi restaurants.",
      },
      { name: "Test", bio: "I am a Chef from Manchester" },
    ];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[1] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[1] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return best matching when job title has multiple words in member's bio, but city has positive score", () => {
    const jobs = [...mockedJobs];
    const members = [
      {
        name: "Test",
        bio: "I am from Bristol but moving to Manchester and I have worked in Chef restaurants.",
      },
      {
        name: "Test",
        bio: "I am a Chef from Bristol but looking for Manchester jobs",
      },
    ];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Project Manager"
    );
    expect((members[1] as CustomMember).recommendedJob?.title).toBe(
      "Project Manager"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "Manchester"
    );
    expect((members[1] as CustomMember).recommendedJob?.location).toBe(
      "Manchester"
    );
  });

  it("should return best matching when job title has multiple words matching in member's bio, but city has positive score", () => {
    const jobs = [...mockedJobs];
    const members = [
      {
        name: "Test",
        bio: "I am from Bristol but moving to Manchester and I have worked as Sushi Chef.",
      },
      {
        name: "Test",
        bio: "I am a Sushi Chef from Manchester but looking for Bristol jobs",
      },
    ];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[1] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[1] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return best matching when job title has multiple words but city has negative score", () => {
    const jobs = [...mockedJobs];
    const members = [
      {
        name: "Test",
        bio: "I have worked in sushi restaurants looking for jobs ouside of Bristol.",
      },
      {
        name: "Test",
        bio: "I have worked in sushi restaurants looking for jobs ouside of London.",
      },
      {
        name: "Test",
        bio: "I am a Chef from Manchester but looking for jobs ouside of Bristol.",
      },
      {
        name: "Test",
        bio: "I am a Chef from Manchester but looking for jobs ouside of London.",
      },
    ];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[1] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[1] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return best matching when job title has multiple words matching in member's bio, but city has negative score", () => {
    const jobs = [...mockedJobs];
    const members = [
      {
        name: "Test",
        bio: "I have worked as sushi chef looking for jobs ouside of Bristol.",
      },
      {
        name: "Test",
        bio: "I have worked as sushi chef looking for jobs ouside of London.",
      },
      {
        name: "Test",
        bio: "I am a sushi Chef from Manchester but looking for jobs ouside of Bristol.",
      },
      {
        name: "Test",
        bio: "I am a sushi Chef from Manchester but looking for jobs ouside of London.",
      },
    ];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[1] as CustomMember).recommendedJob?.title).toBe(
      "Sushi Chef"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[1] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
  });

  it("should return best matching when job title has 3 words", () => {
    const jobs = [...mockedJobs];
    const members = [
      { name: "Test", bio: "I am looking for a Software role in London." },
      {
        name: "Test",
        bio: "I am looking for a Software Manager role in London.",
      },
      { name: "Test", bio: "I am looking for a Software role in Europe." },
    ];

    // Normalize jobs
    normalizeJobs(jobs);
    // Process the data from member
    getAllJobRecommendations(members, jobs);

    expect((members[0] as CustomMember).recommendedJob?.title).toBe(
      "Software Engineer"
    );
    expect((members[1] as CustomMember).recommendedJob?.title).toBe(
      "Software Engineer"
    );
    expect((members[2] as CustomMember).recommendedJob?.title).toBe(
      "Software Engineer Manager"
    );
    expect((members[0] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[1] as CustomMember).recommendedJob?.location).toBe(
      "London"
    );
    expect((members[2] as CustomMember).recommendedJob?.location).toBe(
      "Europe"
    );
  });
});
