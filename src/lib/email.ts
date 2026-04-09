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
