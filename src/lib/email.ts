import { Resend } from 'resend';
import QRCode from 'qrcode';

export async function sendTicketEmail(booking: {
  bookingCode: string;
  name: string;
  email: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
}) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
    
    // Quay lại dùng Link API bên thứ 3 (Cách này Gmail hiển thị ổn định nhất)
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${booking.bookingCode}`;

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
      return { success: true, mock: true };
    }

    if (booking.email === 'ticket-admin@event.com') {
      return { success: true, skipped: true };
    }

    // Vẫn GIỮ cơ chế THỬ LẠI và AWAIT để đảm bảo luôn gửi được trên Vercel
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Đang gửi email lần ${attempt} cho mã ${booking.bookingCode}...`);
        
        const { data, error } = await resend.emails.send({
          from: 'Neon Heritage <onboarding@resend.dev>',
          to: [booking.email],
          subject: `[Neon Heritage] Xác nhận đặt vé thành công - ${booking.bookingCode}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 25px; border-radius: 12px; color: #333;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #ff0088; margin: 0; text-transform: uppercase;">ĐẶT VÉ THÀNH CÔNG!</h1>
                <p style="color: #888; margin-top: 5px;">Cảm ơn bạn đã đồng hành cùng Neon Heritage 2024</p>
              </div>

              <div style="background: #fdfdfd; padding: 20px; border-radius: 10px; border: 1px solid #f0f0f0; margin-bottom: 25px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 5px 0; color: #666;">Mã đặt chỗ:</td><td style="padding: 5px 0; font-weight: bold; color: #00bcd4; font-family: monospace; font-size: 16px;">${booking.bookingCode}</td></tr>
                  <tr><td style="padding: 5px 0; color: #666;">Khách hàng:</td><td style="padding: 5px 0; font-weight: bold;">${booking.name}</td></tr>
                  <tr><td style="padding: 5px 0; color: #666;">Hạng vé:</td><td style="padding: 5px 0; font-weight: bold;">${booking.ticketType}</td></tr>
                  <tr><td style="padding: 5px 0; color: #666;">Tổng tiền:</td><td style="padding: 5px 0; font-weight: bold; color: #ff0088;">${booking.totalPrice.toLocaleString()} VNĐ</td></tr>
                </table>
              </div>

              <div style="text-align: center; padding: 20px; border: 2px dashed #00bcd4; border-radius: 15px; background: #f0fbff;">
                <p style="font-weight: bold; color: #00bcd4; margin: 0 0 15px 0;">Mã QR Check-In của bạn:</p>
                <img src="${qrImageUrl}" style="width: 250px; height: 250px;" alt="QR Code" />
                <p style="font-size: 11px; color: #777; margin-top: 15px;">Vui lòng dùng mã này tại cổng soát vé.</p>
              </div>

              <p style="text-align: center; margin-top: 30px; font-style: italic; color: #999; font-size: 12px;">Hẹn gặp lại bạn tại đêm hội Neon Heritage!</p>
            </div>
          `,
        });

        if (!error) {
          console.log(`Gửi email thành công ở lần ${attempt}`);
          return { success: true, data };
        }
        
        lastError = error;
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        lastError = err;
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000));
      }
    }

    return { success: false, error: lastError };
  } catch (err) {
    console.error('Email service error:', err);
    return { success: false, error: err };
  }
}

export async function sendSurveyEmail(booking: {
  bookingCode: string;
  name: string;
  email: string;
}) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
    const surveyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/survey?code=${booking.bookingCode}`;

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
      console.log('Skipping survey email - RESEND_API_KEY not configured.');
      return { success: true, mock: true };
    }

    if (booking.email === 'ticket-admin@event.com') return { success: true, skipped: true };

    const { data, error } = await resend.emails.send({
      from: 'Neon Heritage <onboarding@resend.dev>',
      to: [booking.email],
      subject: `[Neon Heritage] Trải nghiệm của bạn thế nào? Hãy chia sẻ cùng chúng tôi!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; background: #060010; padding: 40px; border-radius: 30px; border: 1px solid #4F1F76;">
          <h1 style="color: #00ffff; text-transform: uppercase; text-align: center; margin-bottom: 30px; letter-spacing: 2px;">Cảm ơn bạn đã tham dự!</h1>
          
          <p style="color: #fff; text-align: center;">Chào <strong>${booking.name}</strong>,</p>
          <p style="color: #8A8F98; text-align: center;">Hành trình tại <strong>Neon Heritage Festival</strong> vừa khép lại, bạn thấy thế nào?</p>
          
          <div style="text-align: center; border: 1px solid #4F1F76; padding: 40px; border-radius: 20px; margin: 40px 0; background: rgba(79, 31, 118, 0.1);">
            <p style="color: #fff; margin-bottom: 25px;">Hãy dành 2 phút để giúp chúng tôi làm tốt hơn trong những mùa lễ hội tiếp theo nhé.</p>
            <a href="${surveyUrl}" style="background: linear-gradient(90deg, #00ffff, #00c099); color: #060010; padding: 18px 35px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">Bắt đầu Khảo sát</a>
          </div>

          <p style="color: #8A8F98; font-size: 13px; text-align: center;">Sau khi hoàn thành, bạn sẽ nhận được sự trân trọng tuyệt đối từ ban tổ chức.</p>
          
          <p style="text-align: center; margin-top: 50px; color: #ff0088; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; font-size: 12px;">
            Neon Heritage Protocol 2024
          </p>
        </div>
      `,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (err) {
    console.error('Survey Email Error:', err);
    return { success: false, error: err };
  }
}

