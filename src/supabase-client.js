import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mbttpimkgallkklqbndt.supabase.co";
//const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idHRwaW1rZ2FsbGtrbHFibmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4ODQxMDksImV4cCI6MjAyNTQ2MDEwOX0.cFOppPlHfxeqiTh1AOtgjiQ2Z3Sb1WrSpqORCvscNsU";

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseKey);

//console.log(supabase);

export default supabase;
