import axios from "axios";

export const Get_All_Jobs = async ({ queryKey }) => {
  const [_, userId] = queryKey;

  const response = await axios.post("http://localhost:8080/jobs/all", {
    userId: userId,
  });
  return response.data;
};

export const Update_Profile = async ({ queryKey }) => {
  const [_, userId, formData] = queryKey;

  const apiUrl = `http://localhost:8080/users/updateCandidate/${userId}`;
  await axios
    .post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error.message;
    });
};

export const Get_Profile = async ({ queryKey }) => {
  const [_, userId, userRole, requestData] = queryKey;
  const apiUrl = `http://localhost:8080/users/userInfo/${userId}/${userRole}`;

  try {
    const response = await axios.get(apiUrl, { params: requestData });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
