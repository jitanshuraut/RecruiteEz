import JWT from "jsonwebtoken";

export const requireSignInRecruiter = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_RECRUITER
    );

    console.log(req);
    req.recruiter = decode;
    next();
  } catch (error) {
    res.send(error);
  }
};

export const requireSignInCandidate = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_CANDIDATE
    );
    req.candidate = decode;

    next();
  } catch (error) {
    res.send(error);
  }
};


export const isRecruiter = async (req, res, next) => {
  try {
    const token = (req.body.token || req.query.token)
    const decode = JWT.verify(token, process.env.JWT_SECRET_RECRUITER);
    console.log("token info is", decode);
    req.body.tokenDetails = decode;
    const role = decode.role;
    console.log(">>");
    console.log(role);
    console.log(">>");

    if (role === 1) {
      console.log("going to next");
      next();
    } else {
      console.log("giving error");
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access, cant access this",
      });
    }
  } catch (error) {
    // console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in recruiter middleware",
    });
  }
};

export const isCandidate = async (req, res, next) => {
  try {
    // console.log("token for candidate is", req)
    // console.log("token for candidate is 2", req.query)
    const token = (req.body.token || req.query.token)
    const decode = JWT.verify(token, process.env.JWT_SECRET_CANDIDATE);
    console.log("token info is", decode);
    req.body.tokenDetails = decode;
    // console.log("<<");
    // console.log(req.body);
    // console.log(">>");

    const role = req.body.tokenDetails.role;
    console.log(">>");
    console.log(role);
    console.log(">>");

    if (role === 0) {
      console.log("going to next");
      next();
    } else {
      console.log("giving error");
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access, cant access this",
      });
    }

  } catch (error) {
    console.log("giving error 2");

    res.status(401).send({
      success: false,
      error,
      message: "Error in candidate middleware",
    });
  }
};
