import axios from "axios";

export const Get_Job = async ({ queryKey }) => {
  const [_, jobId] = queryKey;

  const response = await axios.get(`http://localhost:8080/jobs/${jobId}`);
  return response.data;
};

export const Apply_Job = async (jobId) => {
  try {
    let token = sessionStorage.getItem("token");
    console.log("token is,", token);

    const response = await axios.post("http://localhost:8080/jobs/apply", {
      jobId,
      token: token,
    });
    return response.data;
  } catch (error) {
    console.error("Error Applying for the job", error.response.data);
  }
};

export const Get_All_Post = async () => {
  const response = await axios.get(`http://localhost:8080/jobs/allPost`);
  return response.data;
};

export const Create_Jobs = async (newJob) => {
  console.log(newJob);
  try {
    const response = await axios.post("http://localhost:8080/jobs/", newJob);
    return response.data;
  } catch (error) {
    console.error("Error Applying for the job", error.response.data);
  }
};

export const Toggle_Job = async (jobId, currentStatus) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/jobs/${jobId}/status`,
      {
        active: !currentStatus,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Applying for the job", error.response.data);
  }
};

export const job_Candidates = async ({ queryKey }) => {
  const [_, jobId] = queryKey;

  const response = await axios.get(
    `http://localhost:8080/jobs/${jobId}/candidates`
  );
  return response.data;
};

export const job_Interviews = async ({ queryKey }) => {
  const [_, jobId] = queryKey;

  const response = await axios.get(
    `http://localhost:8080/jobs/${jobId}/interviews`
  );
  return response.data;
};

export const hireCandidate = async ({ jobId, userId }) => {
  const response = await axios.put(
    `http://localhost:8080/jobs/${jobId}/hire-candidate`,
    {
      candidateId: userId,
    }
  );
  return response.data;
};

export const handle_Reject = async ({jobId, userId}) => {
  console.log(userId);
  try {
    const response = await axios.put(
      `http://localhost:8080/jobs/${jobId}/reject`,
      {
        userId,
      }
    );

    console.log(response.data.message);
  } catch (error) {
    console.error(
      "Failed to reject candidate:",
      error.response?.data?.error || error.message
    );
  }
};
