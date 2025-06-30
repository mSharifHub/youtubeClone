export const handleLinkedinShare = () => {
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURI(import.meta.env.VITE_LINKEDIN_REDIRECT_URI);
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const scope = 'w_member_social';
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
};
