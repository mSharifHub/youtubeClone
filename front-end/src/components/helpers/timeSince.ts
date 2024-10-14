export default function timeSince(published: string): string {
  const now = new Date();
  const publishedAt = new Date(published);
  // get milliseconds and convert to seconds
  const seconds = Math.floor((now.getTime() - publishedAt.getTime()) / 1000);

  // convert to get seconds into year
  let interval = Math.floor(seconds / 3.154e7);
  if (interval >= 1) {
    return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000); // Seconds in a month
  if (interval >= 1) {
    return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400); // Seconds in a day
  if (interval >= 1) {
    return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600); // Seconds in an hour
  if (interval >= 1) {
    return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60); // Seconds in a minute
  if (interval >= 1) {
    return interval === 1
      ? `${interval} minute ago`
      : `${interval} minutes ago`;
  }

  return `${Math.floor(seconds)} seconds ago`;
}
