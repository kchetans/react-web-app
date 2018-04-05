let format = require("string-template");

let base_url = `/workexnow/v1/`;

export const PUBLIC_JOB = `${base_url}public/jobs/{slug}`;

export const LINKEDIN_LOGIN = `${base_url}users/sign-in-with-linkedin`;
export const LINK_ACCOUNT = `${base_url}users/link-account`;
export const FB_LOGIN = `${base_url}users/sign-in-with-fb`;
export const GOOGLE_LOGIN = `${base_url}users/sign-in-with-google`;
export const MY_PROFILE = `${base_url}users/profile`;
export const USER_PROFILE = `${base_url}users/profile/{user_id}`;
export const ORG_PROFILE = `${base_url}orgs/`;
export const EMP_JOB_DETAIL = `${base_url}jobs/{job_id}`;
export const PEOPLES = `${base_url}jobs/user?state={state}&job_id={job_id}&pageNo={pageNo}&pageSize={pageSize}`;
export const MY_JOBS = `${base_url}jobs/er-jobs/v2`;
// export const ADMIN_JOBS = `${base_url}jobs/admin-jobs`;
export const ADMIN_JOBS = `${base_url}jobs/jobs/v2`;
export const UPLOAD_IMAGE = "/upload/image?tags={tags}";
export const PEOPLE_URL = "/workexnow/v1/search/people/v2";
export const CHAT_HEADERS_URL = "/workexnow/v1/chats/headers/v2";
export const CHAT_MESSAGES_URL = `${base_url}chats/{user_id}/chatmessages/v2`;


export const CHAT_PLACE_HOLDER_IMG = "https://az616578.vo.msecnd.net/files/2017/01/15/636200408102208677-440027302_sayhello_edited_dribbble.gif";
export function getRedefineUrl(url, payload = {}) {
  return format(url, payload);
}

// calculate the base url for a router handler from the props the router provides to it
export function getBaseUrl() {
  return window.location.origin;
}
