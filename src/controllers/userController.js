import { supabase } from "../config/supabaseClient.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) return res.status(400).json({ error: error.message });

    res.json({ users: data });
  } catch (err) {
    next(err);
  }
};
