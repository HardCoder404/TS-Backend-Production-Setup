// Email template for password reset
// Returns a complete HTML email as a string
export const ResetPasswordEmail = (name: string, link: string, expiryTimeMinutes: number = 10): string => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
  </head>
  <body style="margin:0; padding:0; background-color:#F8F7FC; font-family:'Segoe UI', Arial, sans-serif;">
    <!-- Main wrapper -->
    <table width="100%" bgcolor="#F8F7FC" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <!-- Email container -->
          <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border-radius: 8px; border: 1px solid #E0DEED;">
            <!-- Body -->
            <tr>
              <td style="padding: 30px 24px; background-color: #ffffff; color: #333333;">
                <h2 style="margin: 0 0 20px; font-size: 20px; color: #6259E0;">Reset Your Password</h2>
                <p style="font-size: 16px; margin: 0 0 20px;">Hi <strong>${name}</strong>,</p>
                <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
                  We received a request to reset the password for your SmartED account. Click the button below to set a new password.
                </p>
                <!-- Button -->
                <table align="center" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
                  <tr>
                    <td align="center" bgcolor="#6259E0" style="border-radius: 4px;">
                      <a href="${link}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 14px; color: #ffffff; text-decoration: none; font-weight: 600;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>
                <!-- Highlight box -->
                <p style="font-size: 14px; color: #3D347A; line-height: 1.6; background-color: #EFE6FF; padding: 14px 18px; border-left: 4px solid #6259E0; border-radius: 4px;">
                  This link is valid for <strong>${expiryTimeMinutes} minutes</strong> only. If you didn’t request a password reset, you can safely ignore this email.
                </p>
                <p style="font-size: 14px; color: #444; line-height: 1.6; margin-top: 30px;">
                  If you need any assistance, contact us at
                  <a href="mailto:example@gmail.com" style="color: #6259E0; text-decoration: none;">example@gmail.com</a>.
                </p>
              </td>
            </tr>
          </table>
          <!-- Footer -->
          <tr>
            <td bgcolor="#F8F7FC" style="padding: 20px 24px; text-align: center; font-size: 13px; color: #777;">
              <p style="margin: 4px 0;">&copy; ${new Date().getFullYear()}. All rights reserved.</p>
            </td>
          </tr>
        </td>
      </tr>
    </table>
  </body>
</html>
`
