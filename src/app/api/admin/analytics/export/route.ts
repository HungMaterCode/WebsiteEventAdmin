import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

const SCORE_MAP: Record<string, number> = {
  "Xuất sắc": 5, "Vượt kỳ vọng": 5, "Rất nhiệt tình, chuyên nghiệp": 5, "Rất chuyên nghiệp": 5, 
  "Rất an tâm, chỉ dẫn rõ ràng": 5, "Rất nhanh": 5, "Chắc chắn có": 5,
  "Tốt": 4, "Đúng kỳ vọng": 4, "Thân thiện": 4, "Đạt yêu cầu": 4, "Tương đối nhanh": 4, "Có thể": 4, "Rất tốt": 4,
  "Bình thường": 3, "Chấp nhận được": 3, "Khá": 3, "Vừa đủ": 3, "Chưa chắc": 3,
  "Cần cải thiện": 2, "Chưa đạt kỳ vọng": 2, "Chậm": 2, "Thiếu chuyên nghiệp": 2, "Có phần cứng nhắc": 2,
  "Không tốt": 1, "Rất chậm / Không tìm thấy nhân viên": 1, "Kế hoạch kém": 1, "Không": 1, "Kém": 1
};

export async function GET() {
  try {
    // 1. Fetch Data
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });

    const surveyQuestions = await prisma.surveyQuestion.findMany({
      orderBy: { order: "asc" },
    });

    const surveyResponses = await prisma.surveyResponse.findMany({
      orderBy: { submittedAt: "desc" },
    });

    // 2. Initialize Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Neon Heritage Admin";
    workbook.lastModifiedBy = "Neon Heritage Admin";
    workbook.created = new Date();

    // --- STYLES ---
    const headerStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, color: { argb: "FFFFFFFF" }, size: 12 },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F1F76" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: {
        top: { style: "thin" }, left: { style: "thin" },
        bottom: { style: "thin" }, right: { style: "thin" },
      },
    };

    const titleStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, size: 16, color: { argb: "FF00FFFF" } },
      alignment: { horizontal: "center" },
    };

    // --- SHEET 1: DASHBOARD ---
    const dashSheet = workbook.addWorksheet("Dashboard");
    dashSheet.mergeCells("A1:D1");
    const dashTitle = dashSheet.getCell("A1");
    dashTitle.value = "TỔNG QUAN SỰ KIỆN - NEON HERITAGE";
    dashTitle.style = titleStyle;

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const checkedIn = bookings.filter((b) => b.checkInTime).length;
    const totalTickets = bookings.length;
    
    dashSheet.addRows([
      [],
      ["Hạng mục", "Giá trị", "Đơn vị"],
      ["Tổng doanh thu", totalRevenue, "VNĐ"],
      ["Tổng số vé bán ra", totalTickets, "Vé"],
      ["Tỉ lệ tham dự", checkedIn ? ((checkedIn / totalTickets) * 100).toFixed(1) + "%" : "0%", ""],
      ["Tổng khảo sát thu về", surveyResponses.length, "Phản hồi"],
    ]);
    
    dashSheet.getColumn(1).width = 25;
    dashSheet.getColumn(2).width = 20;
    dashSheet.getRow(3).font = { bold: true };

    // --- SHEET 2: TICKETING ---
    const ticketSheet = workbook.addWorksheet("Doanh thu Chi tiết");
    const ticketHeaders = ["Mã vé", "Khách hàng", "Email", "Loại vé", "Số lượng", "Tổng tiền", "Trạng thái", "Ngày mua"];
    const tRow = ticketSheet.addRow(ticketHeaders);
    tRow.eachCell((cell) => { cell.style = headerStyle; });

    bookings.forEach((b) => {
      ticketSheet.addRow([
        b.bookingCode, b.name, b.email, b.ticketType, b.quantity, b.totalPrice, b.status, b.createdAt.toLocaleDateString(),
      ]);
    });
    ticketSheet.columns.forEach((col) => { col.width = 15; });

    // --- SHEET 3: ATTENDANCE ---
    const attSheet = workbook.addWorksheet("Nhật ký Check-in");
    const attHeaders = ["Mã vé", "Khách hàng", "Check-in", "Check-out", "Thời gian có mặt"];
    const aRow = attSheet.addRow(attHeaders);
    aRow.eachCell((cell) => { cell.style = headerStyle; });

    bookings.forEach((b) => {
      const duration = b.checkInTime && b.checkOutTime 
        ? Math.round((b.checkOutTime.getTime() - b.checkInTime.getTime()) / 60000) + " phút" 
        : "-";
      attSheet.addRow([
        b.bookingCode, b.name, b.checkInTime?.toLocaleString() || "-", b.checkOutTime?.toLocaleString() || "-", duration
      ]);
    });
    attSheet.columns.forEach((col) => { col.width = 20; });

    // --- SHEET 4: CRM (Customer Classification) ---
    const crmSheet = workbook.addWorksheet("Phân loại Khách hàng");
    const crmHeaders = ["Khách hàng", "Email", "Điện thoại", "Tổng chi tiêu", "Số lần mua", "Phân hạng"];
    const cRow = crmSheet.addRow(crmHeaders);
    cRow.eachCell((cell) => { cell.style = headerStyle; });

    // Simple grouping logic
    const customerMap = new Map();
    bookings.forEach(b => {
      const email = b.email;
      if (!customerMap.has(email)) {
        customerMap.set(email, { name: b.name, phone: b.phone, total: 0, count: 0 });
      }
      const existing = customerMap.get(email);
      existing.total += b.totalPrice;
      existing.count += 1;
    });

    Array.from(customerMap.entries()).forEach(([email, data]: any) => {
      let tier = "Bronze";
      if (data.total > 5000000) tier = "Diamond";
      else if (data.total > 2000000) tier = "Gold";
      crmSheet.addRow([data.name, email, data.phone, data.total, data.count, tier]);
    });
    crmSheet.columns.forEach((col) => { col.width = 20; });

    // --- SHEET 5: SURVEY ---
    const surveySheet = workbook.addWorksheet("Đánh giá Khảo sát");
    const sHeaders = ["Mã vé", "Ngày gửi", "Điểm trung bình (Stars)", "Spam?", ...surveyQuestions.map(q => q.text)];
    const sRow = surveySheet.addRow(sHeaders);
    sRow.eachCell((cell) => { cell.style = headerStyle; });

    surveyResponses.forEach((r) => {
      const answers = r.answers as any[];
      const scores = answers
        .map(a => SCORE_MAP[a.answer])
        .filter(v => v !== undefined);
      const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "0.0";
      
      const rowData = [
        r.bookingCode || "Ẩn danh",
        r.submittedAt.toLocaleString(),
        avg,
        r.isSpam ? "X" : "-",
        ...surveyQuestions.map(q => {
          const ans = answers.find(a => a.questionId === q.id);
          return ans ? ans.answer : "-";
        })
      ];
      surveySheet.addRow(rowData);
    });
    surveySheet.columns.forEach((col, i) => { col.width = i < 4 ? 15 : 40; });

    // 3. Export
    const buffer = await workbook.xlsx.writeBuffer();
    
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="Neon-Heritage-Export.xlsx"',
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Export API Error:", error);
    return NextResponse.json({ error: "Lỗi khi tạo file báo cáo." }, { status: 500 });
  }
}
