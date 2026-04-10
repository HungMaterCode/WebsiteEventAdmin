import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email: string, code: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CyberAdmin <onboarding@resend.dev>', // Bạn nên thay bằng domain thật nếu có
      to: email,
      subject: `[CyberAdmin] Mã xác thực đăng nhập của bạn là ${code}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #060010; color: #ffffff; border-radius: 20px; border: 1px solid #4F1F76;">
          <h1 style="text-align: center; color: #00FFFF; text-transform: uppercase; letter-spacing: 5px;">CyberAdmin</h1>
          <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(0,255,255,0.2);">
            <p style="font-size: 16px; margin-bottom: 20px;">Chào bạn,</p>
            <p style="font-size: 16px; line-height: 1.6;">Để hoàn tất đăng nhập vào hệ thống quản trị Neon Heritage, vui lòng sử dụng mã xác thực dưới đây:</p>
            <div style="text-align: center; margin: 40px 0;">
              <span style="font-size: 42px; font-weight: bold; color: #FF0088; letter-spacing: 15px; padding: 15px 30px; border: 2px dashed #4F1F76; border-radius: 10px; background: black;">${code}</span>
            </div>
            <p style="font-size: 14px; color: #8A8F98; text-align: center;">Mã này có hiệu lực trong vòng 10 phút. Nếu không phải bạn thực hiện, vui lòng bỏ qua email này.</p>
          </div>
          <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #4F1F76;">
            &copy; 2024 Neon Heritage Festival. Secure Admin Portal.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception sending email:', err);
    return { success: false, error: err };
  }
}
