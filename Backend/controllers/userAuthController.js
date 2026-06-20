import User from '../models/userModel.js';
import axios from 'axios';

// Get Auth0 Management API token
const getManagementToken = async () => {
  const res = await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_MGMT_CLIENT_ID,
      client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    }
  );
  return res.data.access_token;
};


export const handleSignUp = async (req, res) => {
  const { email, password, name, role, branch, semester, collegeId } = req.body;

  try {
    // Validate format of college ID
    const normalizedCollegeId = collegeId?.trim().toUpperCase();
    if (!/^[A-Z][0-9]{6}$/.test(normalizedCollegeId)) {
      return res.status(400).json({
        error: "College ID must be in the format B23XXXX",
      });
    }

    // create user in Auth0
    const mgmtToken = await getManagementToken();

    const auth0Response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
      {
        connection: 'Username-Password-Authentication',
        email,
        password,
        name,
      },
      { headers: { Authorization: `Bearer ${mgmtToken}` } }
    );

    const auth0Id = auth0Response.data.user_id;

    // extra fields in MongoDB
    const user = await User.create({
      auth0Id,
      email,
      name,
      role,
      branch,
      semester,
      collegeId,
    });

    res.status(201).json({ message: 'Account created. Please log in.' });

  } catch (err) {
    console.error('Signup error:', err.response?.data || err.message);

    if (err.response?.data?.code === 'user_exists') {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    if (err.code === 11000) {
      return res.status(409).json({ error: 'College ID already registered.' });
    }

    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
};



export const handleSignin = async (req,res)=>{
  try {
    const { email, password } = req.body;

    // Auth0 verifies credentials and returns token
    const authResponse = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: 'password',
        username: email,
        password,
        audience: process.env.AUTH0_AUDIENCE,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        scope: 'openid profile email',
      }
    );

    const { access_token } = authResponse.data;

    // Store token in cookie
    return res
      .status(200)
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        path: '/'
      })
      .json({ message: 'Signin successful' });

  } catch (error) {
    console.error('Signin error:', error.response?.data || error.message);
    return res.status(401).json({ error: 'Invalid email or password' });
  }
}

export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Strict',
    path: '/',
  }).json({ message: 'Logged out successfully' });
}