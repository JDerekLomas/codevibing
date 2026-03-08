import { Resend } from 'resend';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'codevibing <onboarding@resend.dev>';

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY not configured');
    resendInstance = new Resend(key);
  }
  return resendInstance;
}

const WRAPPER = (content: string) => `
<div style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace; max-width: 480px; margin: 0 auto; padding: 32px 0;">
  ${content}
  <p style="color: #a8a29e; font-size: 11px; margin-top: 32px; border-top: 1px solid #e7e5e4; padding-top: 16px;">
    codevibing — a community for people building with AI<br>
    <a href="https://codevibing.com" style="color: #92400E;">codevibing.com</a>
  </p>
</div>
`;

export async function sendWelcomeEmail(email: string, username: string): Promise<void> {
  const resend = getResend();
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Welcome to codevibing, @${username}`,
    html: WRAPPER(`
      <p style="color: #1c1917; font-size: 15px;">Hey @${username},</p>
      <p style="color: #57534e; font-size: 14px; line-height: 1.6;">
        You're in. codevibing is a community for people shipping side projects with AI — half-finished counts, janky counts, we want to see it all.
      </p>
      <p style="color: #57534e; font-size: 14px; line-height: 1.6;">Here's what you can do:</p>
      <ul style="color: #57534e; font-size: 14px; line-height: 1.8; padding-left: 20px;">
        <li><a href="https://codevibing.com/u/${username}" style="color: #92400E;">Set up your profile</a> — add your projects and bio</li>
        <li><a href="https://codevibing.com/feed" style="color: #92400E;">Browse the feed</a> — see what others are building</li>
        <li><a href="https://codevibing.com/feed" style="color: #92400E;">Post what you're working on</a> — the community wants to see it</li>
      </ul>
      <a href="https://codevibing.com/feed" style="display: inline-block; padding: 12px 28px; background: #92400E; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; margin: 16px 0;">
        Check out the feed
      </a>
      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        You can always log back in at <a href="https://codevibing.com/login" style="color: #92400E;">codevibing.com/login</a> with this email.
      </p>
    `),
  });
}

export async function sendReplyNotification(
  toEmail: string,
  toUsername: string,
  replyAuthor: string,
  replyContent: string,
  postId: string
): Promise<void> {
  const resend = getResend();
  // Truncate reply content for email
  const preview = replyContent.length > 300 ? replyContent.slice(0, 300) + '...' : replyContent;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `@${replyAuthor} replied to your post on codevibing`,
    html: WRAPPER(`
      <p style="color: #1c1917; font-size: 15px;">Hey @${toUsername},</p>
      <p style="color: #57534e; font-size: 14px;">
        <strong>@${replyAuthor}</strong> replied to your post:
      </p>
      <div style="background: #fafaf9; border-left: 3px solid #92400E; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0;">
        <p style="color: #44403c; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${preview}</p>
      </div>
      <a href="https://codevibing.com/feed#post-${postId}" style="display: inline-block; padding: 12px 28px; background: #92400E; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; margin: 8px 0;">
        View the conversation
      </a>
    `),
  });
}
