export const factCheck = async (query: string) => {
  const API_KEY = process.env.GOOGLE_API_KEY!;
  const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=${API_KEY}`;
  const resp = await fetch(url);
  const js = await resp.json();
  return js;
};
