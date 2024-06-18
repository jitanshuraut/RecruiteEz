import axios from "axios";

export const Get_recruiter_Jobs = async ({ queryKey }) => {
  const [_, recruiterId] = queryKey;
  const apiUrl = `http://localhost:8080/jobs/all/recruiter?recruiterId=${recruiterId}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};


