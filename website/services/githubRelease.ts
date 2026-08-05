export interface GitHubReleaseInfo {
  hasRelease: boolean;
  tagName: string;
  version: string;
  releaseDate: string;
  downloadUrl: string;
  devZipUrl: string;
  repoUrl: string;
  issuesUrl: string;
  releaseNotes: string;
  body: string;
}

const REPO_OWNER = 'harshit-911';
const REPO_NAME = 'ShieldSight.ai';
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
const DEV_ZIP_URL = `${REPO_URL}/archive/refs/heads/main.zip`;
const ISSUES_URL = `${REPO_URL}/issues/new`;

export async function fetchLatestRelease(): Promise<GitHubReleaseInfo> {
  const fallbackInfo: GitHubReleaseInfo = {
    hasRelease: false,
    tagName: 'v1.0.0-beta',
    version: '1.0.0 Beta',
    releaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    downloadUrl: DEV_ZIP_URL,
    devZipUrl: DEV_ZIP_URL,
    repoUrl: REPO_URL,
    issuesUrl: ISSUES_URL,
    releaseNotes: 'ShieldSight AI is currently in beta. You can download the latest development build directly from GitHub.',
    body: 'ShieldSight AI Beta Release',
  };

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes in Next.js
    });

    if (!res.ok) {
      return fallbackInfo;
    }

    const data = await res.json();
    if (!data || !data.tag_name) {
      return fallbackInfo;
    }

    const versionStr = data.tag_name.startsWith('v') ? data.tag_name.slice(1) : data.tag_name;
    const zipAsset = data.assets?.find((asset: { name: string; browser_download_url: string }) =>
      asset.name.toLowerCase().endsWith('.zip') || asset.name.toLowerCase().includes('shieldsightai')
    );

    const formattedDate = data.published_at
      ? new Date(data.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : fallbackInfo.releaseDate;

    return {
      hasRelease: Boolean(zipAsset),
      tagName: data.tag_name,
      version: `${versionStr}${zipAsset ? '' : ' Beta'}`,
      releaseDate: formattedDate,
      downloadUrl: zipAsset ? zipAsset.browser_download_url : DEV_ZIP_URL,
      devZipUrl: DEV_ZIP_URL,
      repoUrl: data.html_url || REPO_URL,
      issuesUrl: ISSUES_URL,
      releaseNotes: data.body || fallbackInfo.releaseNotes,
      body: data.body || '',
    };
  } catch (err) {
    console.warn('[ShieldSight Release API] Failed to fetch release, using fallback:', err);
    return fallbackInfo;
  }
}
