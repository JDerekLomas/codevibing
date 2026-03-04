import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createMagicToken } from '@/lib/magic-link';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'codevibing <onboarding@resend.dev>';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not configured');
  return new Resend(key);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'email required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Look up user by email
    const { data: user } = await supabaseAdmin
      .from('cv_users')
      .select('username, email')
      .eq('email', normalizedEmail)
      .single();

    if (!user) {
      // Don't reveal whether email exists — always say "sent"
      return NextResponse.json({ sent: true });
    }

    // Create magic token and login URL
    const token = createMagicToken(user.username);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://codevibing.com';
    const loginUrl = `${baseUrl}/login?token=${token}`;

    const resend = getResend();
    await resend.emails.send({
      from: FROM_EMAIL,
      to: normalizedEmail,
      subject: 'Your codevibing login link',
      html: `
        <div style="font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace; max-width: 480px; margin: 0 auto; padding: 32px 0;">
          <p style="color: #1c1917; font-size: 15px;">Hey @${user.username},</p>
          <p style="color: #57534e; font-size: 14px;">Here's your login link for codevibing:</p>
          <a href="${loginUrl}" style="display: inline-block; padding: 12px 28px; background: #92400E; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; margin: 16px 0;">
            Log in to codevibing
          </a>
          <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
            This link expires in 15 minutes. If you didn't request this, just ignore it.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error('send-login error:', error);
    return NextResponse.json({ error: 'Failed to send login email' }, { status: 500 });
  }
}
