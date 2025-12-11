// lib/auth.js
import jwt from "jsonwebtoken";
import { User } from "./models/User.js";

export function generateToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Helper to read JSON body safely (works for dev + prod)
export async function getJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

export async function getUserFromRequest(req) {
  const header =
    req.headers.authorization || req.headers.Authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw Object.assign(new Error("Not authorized, no token"), {
      statusCode: 401,
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      throw Object.assign(new Error("User not found"), {
        statusCode: 401,
      });
    }
    return user;
  } catch (err) {
    throw Object.assign(new Error("Invalid token"), {
      statusCode: 401,
    });
  }
}

export function assertRole(user, roles) {
  if (!roles.includes(user.role)) {
    throw Object.assign(
      new Error("Forbidden: insufficient permissions"),
      { statusCode: 403 }
    );
  }
}
