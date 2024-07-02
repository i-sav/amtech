import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fssmofuasqbfyefiygaf.supabase.co";
//const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzc21vZnVhc3FiZnllZml5Z2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MjE5MTgsImV4cCI6MjAzNTQ5NzkxOH0.BRLQ5ruJH-vdxWJsICFl_XXaycKGx9w_i1n04FbILGI";

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

//console.log(supabase);

export default supabase;
