import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export async function register(email, password, type) {
  try {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email address");
    }

    if (!isValidPassword(password)) {
      throw new Error(
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number."
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          type: type,
        },
      },
    });

    if (error) {
      throw new Error("Failed to register user: " + error.message);
    }

    return data;
  } catch (err) {
    return err;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  return passwordRegex.test(password);
}

export async function login(email, password) {
  try {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email address");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error("Failed to log in: " + error.message);
    }
    return data;
  } catch (err) {
    return err;
  }
}

export async function fetchuser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return user;
  } catch (err) {
    alert(err.message);
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  } catch (err) {
    alert(err);
    return err;
  }
}

export async function updatedata(dataToUpdate) {
  try {
    const { user, error } = await supabase.auth.updateUser({
      data: dataToUpdate,
    });

    if (error) {
      console.error("Error updating user data:", error);
      return error;
    }
    location.reload();
    return user;
  } catch (error) {
    console.error("Error updating user data:", error);
    return error;
  }
}

export async function getjobs(company_id) {
  try {
    const { data, error } = await supabase
      .from("Job_Posts")
      .select("*")
      .eq("company_id", company_id);

    if (error) throw new Error(`Error fetching data: ${error.message}`);
    return data;
  } catch (err) {
    return err;
  }
}

export async function postjob(job) {
  try {
    const { data, error } = await supabase.from("Job_Posts").insert(job);

    if (error) {
      console.log(error);
      throw new Error(error);
    }
    return data;
  } catch (err) {
    return err;
  }
}

export async function getjobbyid(jobid) {
  const { data, error } = await supabase
    .from("Job_Posts")
    .select("*")
    .eq("id", jobid)
    .single();

  if (error) {
    return error;
  }
  return data;
}

export async function deletejob(jobid) {
  const { error } = await supabase.from("Job_Posts").delete().eq("id", jobid);

  if (error) {
    return error;
  }
}

export async function editjob(job) {
  const { error } = await supabase
    .from("Job_Posts")
    .update(job)
    .eq("id", job.id);

  if (error) return error;
}

export async function getapplicantjobs(applicant_id) {
  const { data, error } = await supabase
    .from("Applications")
    .select("*")
    .eq("applicant_id", applicant_id);

  if (error) return error;
  return data;
}

export async function searchforjobs(keyword, param) {
  let query = supabase
    .from("Job_Posts")
    .select()
    .eq("visibility", true)
    .or("status.eq.active,status.eq.pending");

  if (typeof param === "string") {
    query = query.filter(param, "ilike", `%${keyword}%`);
  } else {
    console.error("Invalid search parameter.");
    return;
  }

  const { data, error } = await query;

  if (error) return error;
  return data;
}

async function updatecount(application) {
  const applicant_data_to_append = {
    id: application.applicant_id,
    name: application.applicant_name,
    pfp: application.applicant_pfp,
    status: "pending",
  };

  const { data, error } = await supabase.rpc("append_to_array", {
    jobid: application.job_id,
    value_to_append: applicant_data_to_append,
  });

  if (error) return error;
  const { data2, error2 } = await supabase.rpc("increment_n_applicants", {
    jobid: application.job_id,
  });
  if (error2) return error2;

  return;

  // const { data, error } = await supabase
  //   .from("Job_Posts")
  //   .select("*")
  //   .eq("id", application.job_id);

  // if (error) {
  //   return error;
  // }
  // const newcount = data[0].n_applicants + 1;
  // let newapplicantsdata = data[0].applicants;
  // newapplicantsdata.push({
  //   id: application.applicant_id,
  //   name: application.applicant_name,
  // });
  // // console.log("New: ", newcount);
  // const { error2 } = await supabase
  //   .from("Job_Posts")
  //   .update({ n_applicants: newcount, applicants: newapplicantsdata })
  //   .eq("id", application.job_id);
  // if (error2) return error2;
}

export async function applytojob(application) {
  const { error } = await supabase.from("Applications").insert(application);

  if (error) return error;
  const res = await updatecount(application);
  if (res) return res;
}

export async function getblogposts() {
  const { data, error } = await supabase.from("Blog_Posts").select("*");
  if (error) return error;
  return data;
}

export async function postblogpost(blogpost) {
  const { error } = await supabase.from("Blog_Posts").insert(blogpost);
  if (error) return error;
}

export async function deletepost(post_id, user_id) {
  const { error } = await supabase
    .from("Blog_Posts")
    .delete()
    .eq("id", post_id)
    .eq("user_id", user_id);

  if (error) return error;
}

// work on this
// create a table that hosts public information that the user can customize
export async function getuserpage(user, user_id) {
  // console.log("Fetching");
  const { data, error } = await supabase
    .from("Public_Info")
    .select("*")
    .eq("user_id", user_id)
    .single();
  if (error) return error;
  if (data.length === 0 && user.id === user_id) {
    const newdata = {
      name: user.user_metadata.name,
      user_id: user.id,
      pfp: user.user_metadata.pfp,
    };
    const res = await createuserpage(newdata);
    return res;
  } else if (data.length === 0) {
    return "No page yet";
  } else if (data.visibility === false && user.id !== data.user_id) {
    return "Not Visible";
  } else {
    return data;
  }
}

export async function createuserpage(page_data) {
  const { data, error } = await supabase
    .from("Public_Info")
    .select("*")
    .eq("user_id", page_data.user_id);
  if (error) return error;
  if (data.length > 0) return "Page already exists";
  const { error: error2 } = await supabase
    .from("Public_Info")
    .insert(page_data);

  if (error2) return error2;
  return 1;
}

export async function getchannelsbyuserid(user_id) {
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .or(`user1_id.eq.${user_id},user2_id.eq.${user_id}`);

  if (error) return error;
  return data;
}

export async function getchannel(channel_id) {
  const { data, error } = await supabase
    .from("channels")
    .select()
    .eq("id", channel_id);

  if (error) return error;
  return data;
}

export async function sendmessage(msg, channelid) {
  const { error } = await supabase.rpc("append_to_messages", {
    message: msg,
    channel_id: channelid,
  });

  return error;
}

export async function getspecificchannel(user1_id, user2_id) {
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .or(
      `and(user2_id.eq.${user2_id}, user1_id.eq.${user1_id}),and(user1_id.eq.${user2_id}, user2_id.eq.${user1_id})`
    );

  if (error) return error;
  return data;
}
export async function getorcreatechannel(user, other) {
  const res = await getspecificchannel(user.id, other.company_id);
  if (!res.code && res.length === 0) {
    const newchannel = {
      user1_id: user.id,
      user1_name: user.user_metadata.name,
      user1_pfp: user.user_metadata.pfp,
      user2_id: other.company_id,
      user2_name: other.company_name,
      user2_pfp: other.company_pfp,
      messages: [],
    };
    const { error } = await supabase
      .from("channels")
      .insert(newchannel)
      .select();

    if (error) return error;
  }
  if (res.code) return res;
}

export async function getalljobs() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("Job_Posts")
    .select("*")
    .gte("deadline", today)
    .neq("status", "closed")
    .eq("visibility", true);

  if (error) return error;
  return data;
}

export async function respondtoapplication(response, jobid, app_id) {
  const { error } = await supabase
    .from("Applications")
    .update({ status: response })
    .eq("job_id", jobid);
  if (error) return error;

  let { data, error2 } = await supabase
    .from("Job_Posts")
    .select("applicants")
    .eq("id", jobid);

  if (error2) return error2;

  let newdata = data[0].applicants;
  data[0].applicants.forEach((item, index) => {
    if (item.id === app_id) {
      newdata[index].status = response;
      return;
    }
  });
  const { error3 } = await supabase
    .from("Job_Posts")
    .update({ applicants: newdata })
    .eq("id", jobid);
  if (error3) return error3;
  return;
}

export async function updatepage(data) {
  const { error } = await supabase
    .from("Public_Info")
    .update(data)
    .eq("id", data.id);

  if (error) return error;
}
