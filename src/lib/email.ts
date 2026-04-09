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
    // Use a public QR code API which is more reliable for email clients
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${booking.bookingCode}`;

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_placeholder') {
      console.log('Skipping email send - RESEND_API_KEY not configured correctly.');
      console.log('Booking Code:', booking.bookingCode);
      return { success: true, mock: true };
    }

    // Skip sending for administrative placeholder email to avoid Resend validation errors
    if (booking.email === 'ticket-admin@event.com') {
      console.log(`Skipping email send for administrative placeholder: ${booking.email}`);
      return { success: true, skipped: true };
    }

    const { data, error } = await resend.emails.send({
      from: 'Neon Heritage <onboarding@resend.dev>',
      to: [booking.email],
      subject: `[Neon Heritage] Xác nhận đặt vé thành công - ${booking.bookingCode}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <h1 style="color: #ff0088; text-transform: uppercase; text-align: center;">Đặt Vé Thành Công!</h1>
          <p>Chào <strong>${booking.name}</strong>,</p>
          <p>Cảm ơn bạn đã đặt vé tham dự <strong>Neon Heritage Festival 2024</strong>. Dưới đây là thông tin chi tiết về vé của bạn:</p>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin: 20px 0; border: 1px solid #e9ecef;">
            <p style="margin: 8px 0; font-size: 16px;"><strong>Mã đặt chỗ:</strong> <span style="font-family: monospace; font-weight: bold; color: #00bcd4;">${booking.bookingCode}</span></p>
            <p style="margin: 8px 0; font-size: 16px;"><strong>Hạng vé:</strong> ${booking.ticketType}</p>
            <p style="margin: 8px 0; font-size: 16px;"><strong>Số lượng:</strong> ${booking.quantity}</p>
            <p style="margin: 8px 0; font-size: 16px;"><strong>Tổng tiền:</strong> <span style="color: #ff0088; font-weight: bold;">${booking.totalPrice.toLocaleString()} VNĐ</span></p>
          </div>

          <div style="text-align: center; margin: 30px 0; padding: 20px; border: 2px dashed #00bcd4; border-radius: 20px;">
            <p style="font-weight: bold; color: #00bcd4; margin-top: 0;">Mã QR Check-In của bạn:</p>
            <img src="${qrImageUrl}" alt="Check-in QR Code" style="width: 200px; height: 200px; display: block; margin: 0 auto;" />
            <p style="font-size: 12px; color: #666; margin-top: 15px;">Vui lòng xuất trình mã QR này tại cổng soát vé để vào cổng.</p>
          </div>

          <p style="text-align: center; font-style: italic; color: #666;">Hẹn gặp lại bạn tại đêm hội!</p>
          <p style="text-align: center; margin-top: 30px;">
            Trân trọng,<br />
            <strong>Đội ngũ Neon Heritage</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 40px;" />
          <p style="font-size: 10px; color: #999; text-align: center;">Đây là email tự động, vui lòng không phản hồi lại email này.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }

    return { success: true, data };
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

